import { createCipheriv, createDecipheriv, createHash, createSign, randomBytes } from "node:crypto";
import type { GaReport, GaStatus, RangeDays, StatRow } from "@/config/analytics";
import { PREFIX } from "./env";
import { redis, redisToken } from "./stats";

/**
 * Riwayat Google Analytics 4 dibaca lewat Google Analytics Data API memakai service account.
 * Kunci JSON-nya diunggah dari panel dan disimpan di Redis (bukan Blob, yang publik), terenkripsi
 * AES-256-GCM dengan kunci turunan token Redis, jadi tidak pernah tertulis di repo maupun env.
 */
const CONFIG_KEY = `${PREFIX}:ga`;
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

interface GaConfig {
  email: string;
  privateKey: string;
  propertyId: string | null;
}

export class GaError extends Error {}

const cipherKey = () => createHash("sha256").update(`njm-ga|${redisToken}`).digest();

function encrypt(value: GaConfig): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cipherKey(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64url")).join(".");
}

function decrypt(value: string): GaConfig | null {
  try {
    const [iv, tag, data] = value.split(".").map((p) => Buffer.from(p, "base64url"));
    const decipher = createDecipheriv("aes-256-gcm", cipherKey(), iv);
    decipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8")) as GaConfig;
  } catch {
    // Token Redis berganti: kunci lama tidak bisa dibuka lagi dan perlu diunggah ulang.
    return null;
  }
}

async function readConfig(): Promise<GaConfig | null> {
  if (!redis) return null;
  const raw = await redis.get<string>(CONFIG_KEY);
  return typeof raw === "string" ? decrypt(raw) : null;
}

async function writeConfig(config: GaConfig): Promise<void> {
  if (!redis) throw new GaError("Database statistik belum tersambung.");
  await redis.set(CONFIG_KEY, encrypt(config));
  tokenCache = null;
}

export async function gaStatus(): Promise<GaStatus> {
  const config = await readConfig();
  return { storage: Boolean(redis), email: config?.email ?? null, propertyId: config?.propertyId ?? null };
}

/** Terima isi file JSON service account dari Google Cloud. */
export async function saveGaKey(text: string): Promise<void> {
  let parsed: { type?: unknown; client_email?: unknown; private_key?: unknown };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new GaError("File bukan JSON yang valid.");
  }
  if (parsed.type !== "service_account" || typeof parsed.client_email !== "string" || typeof parsed.private_key !== "string") {
    throw new GaError("Ini bukan kunci service account. Pilih jenis kunci JSON saat membuat key di Google Cloud.");
  }
  if (!parsed.private_key.includes("PRIVATE KEY")) throw new GaError("Kunci privat di file JSON tidak lengkap.");
  const current = await readConfig();
  await writeConfig({ email: parsed.client_email, privateKey: parsed.private_key, propertyId: current?.propertyId ?? null });
}

/** Property ID berupa angka (Admin > Detail properti), bukan Measurement ID "G-...". */
export async function saveGaProperty(input: string): Promise<void> {
  const id = input.trim().replace(/^properties\//, "");
  if (/^G-/i.test(id)) throw new GaError("Itu Measurement ID. Yang dibutuhkan Property ID berupa angka, misalnya 412345678.");
  if (!/^\d{6,15}$/.test(id)) throw new GaError("Property ID harus berupa angka, misalnya 412345678.");
  const current = await readConfig();
  if (!current) throw new GaError("Unggah kunci JSON service account terlebih dahulu.");
  await writeConfig({ ...current, propertyId: id });
}

export async function removeGa(): Promise<void> {
  await redis?.del(CONFIG_KEY);
  tokenCache = null;
}

/* ---------- Google API ---------- */

let tokenCache: { email: string; token: string; exp: number } | null = null;

async function accessToken(config: GaConfig): Promise<string> {
  if (tokenCache && tokenCache.email === config.email && tokenCache.exp > Date.now() + 60_000) return tokenCache.token;
  const now = Math.floor(Date.now() / 1000);
  const enc = (v: object) => Buffer.from(JSON.stringify(v)).toString("base64url");
  const unsigned = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({
    iss: config.email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  let signature: string;
  try {
    signature = createSign("RSA-SHA256").update(unsigned).sign(config.privateKey, "base64url");
  } catch {
    throw new GaError("Kunci privat service account rusak. Buat dan unggah kunci JSON baru.");
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
  if (!res.ok || !body.access_token) {
    throw new GaError("Google menolak kunci ini. Mungkin kuncinya sudah dihapus di Google Cloud; buat dan unggah kunci baru.");
  }
  tokenCache = { email: config.email, token: body.access_token, exp: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return body.access_token;
}

interface ReportRow {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}

function explain(status: number, message: string, email: string): string {
  if (/has not been used|is disabled|SERVICE_DISABLED/i.test(message)) {
    return "Google Analytics Data API belum diaktifkan di project Google Cloud milik service account ini.";
  }
  if (status === 403) return `Email ${email} belum diberi akses Viewer di properti GA4 ini, atau Property ID-nya salah.`;
  if (status === 404 || status === 400) return "Property ID tidak ditemukan. Periksa lagi angkanya di GA4 > Admin > Detail properti.";
  return `Google Analytics membalas galat (${status}). Coba lagi beberapa saat lagi.`;
}

/** "20261027" -> "2026-10-27"; "202643" (minggu ISO) -> tanggal Senin minggu itu. */
function toDate(value: string, weekly: boolean): string {
  if (!weekly) return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  const year = Number(value.slice(0, 4));
  const week = Number(value.slice(4));
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const monday = Date.UTC(year, 0, 4) - ((jan4.getUTCDay() + 6) % 7) * 86_400_000 + (week - 1) * 7 * 86_400_000;
  return new Date(monday).toISOString().slice(0, 10);
}

export async function gaReport(days: RangeDays): Promise<GaReport | null> {
  const config = await readConfig();
  if (!config?.propertyId) return null;
  const token = await accessToken(config);
  const weekly = days > 90;
  const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: "today" }];
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${config.propertyId}:batchRunReports`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      requests: [
        {
          dateRanges,
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "averageSessionDuration" },
            { name: "bounceRate" },
          ],
        },
        {
          dateRanges,
          dimensions: [{ name: weekly ? "isoYearIsoWeek" : "date" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }],
          orderBys: [{ dimension: { dimensionName: weekly ? "isoYearIsoWeek" : "date" } }],
        },
        {
          dateRanges,
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges,
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        },
        {
          // Klik WhatsApp sudah dikirim ke GA sebagai event generate_lead sejak sebelum panel ada.
          dateRanges,
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "generate_lead" } } },
        },
      ],
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { reports?: { rows?: ReportRow[] }[]; error?: { message?: string } };
  if (!res.ok || !body.reports) throw new GaError(explain(res.status, body.error?.message ?? "", config.email));

  const [totals, series, sources, devices, leads] = body.reports.map((r) => r.rows ?? []);
  const metric = (row: ReportRow | undefined, i: number) => Number(row?.metricValues?.[i]?.value ?? 0);
  const rows = (list: ReportRow[]): StatRow[] =>
    list.map((r) => ({ key: r.dimensionValues?.[0]?.value || "(tidak diketahui)", value: metric(r, 0) }));

  return {
    totals: {
      users: metric(totals[0], 0),
      sessions: metric(totals[0], 1),
      pageviews: metric(totals[0], 2),
      avgDuration: metric(totals[0], 3),
      bounceRate: metric(totals[0], 4),
      leads: metric(leads[0], 0),
    },
    series: series.map((r) => ({ date: toDate(r.dimensionValues?.[0]?.value ?? "", weekly), users: metric(r, 0), sessions: metric(r, 1) })),
    sources: rows(sources),
    devices: rows(devices),
  };
}
