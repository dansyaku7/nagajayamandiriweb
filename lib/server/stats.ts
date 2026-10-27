import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import {
  isKnownButton,
  isSectionId,
  TRACKED_SECTIONS,
  type RangeDays,
  type SeriesPoint,
  type StatRow,
  type StatsReport,
  type TrackEvent,
} from "@/config/analytics";
import { PREFIX } from "./env";

/**
 * Statistik kunjungan disimpan di Upstash Redis (integrasi Vercel Marketplace "njm-analytics").
 * Vercel memasang KV_REST_API_URL & KV_REST_API_TOKEN otomatis saat database disambungkan.
 *
 * Per hari (zona WIB) ada satu hash berisi semua penghitung, misalnya "pv", "src:Google",
 * "wa:hero_konsultasi", dan satu HyperLogLog untuk pengunjung unik. Data disimpan ±13 bulan.
 */
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const redis = url && token ? new Redis({ url, token }) : null;
export const redisToken = token;

const TTL_SECONDS = 400 * 86_400;
const dayKey = (day: string) => `${PREFIX}:st:d:${day}`;
const visitorsKey = (day: string) => `${PREFIX}:st:u:${day}`;
const SINCE_KEY = `${PREFIX}:st:since`;

const WIB_OFFSET_MS = 7 * 3_600_000;
const today = (now = Date.now()) => new Date(now + WIB_OFFSET_MS).toISOString().slice(0, 10);
const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/* ---------- Penggolongan ---------- */

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|prerender|python|curl|wget|httpclient|preview/i;
export const isBot = (ua: string) => !ua || BOT.test(ua);

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/(^|\.)(threads\.net|threads\.com)$/, "Threads"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, "X / Twitter"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "WhatsApp"],
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "ChatGPT"],
];

const UTM_SOURCES: Record<string, string> = {
  google: "Google",
  ig: "Instagram",
  instagram: "Instagram",
  fb: "Facebook",
  facebook: "Facebook",
  wa: "WhatsApp",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  youtube: "YouTube",
};

function classifySource(referrer: string | undefined, utm: string | undefined, ua: string, ownHost: string): string {
  if (utm) {
    const key = utm.trim().toLowerCase();
    return UTM_SOURCES[key] ?? label(key);
  }
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (host && host !== ownHost.replace(/^www\./, "")) {
        return SOURCES.find(([re]) => re.test(host))?.[1] ?? label(host);
      }
    } catch {
      /* referrer tidak valid: anggap kunjungan langsung */
    }
  }
  // Browser bawaan aplikasi sering tidak mengirim referrer.
  if (/Instagram/.test(ua)) return "Instagram";
  if (/FBAN|FBAV/.test(ua)) return "Facebook";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "TikTok";
  return "Langsung";
}

function classifyDevice(ua: string, touchMac: boolean): string {
  if (touchMac || /iPad|Tablet|PlayBook|Silk|Kindle/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "Tablet";
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return "HP";
  return "Desktop";
}

const BROWSERS: [RegExp, string][] = [
  [/Instagram/, "Instagram (dalam aplikasi)"],
  [/FBAN|FBAV/, "Facebook (dalam aplikasi)"],
  [/musical_ly|BytedanceWebview/i, "TikTok (dalam aplikasi)"],
  [/SamsungBrowser/, "Samsung Internet"],
  [/OPR\/|Opera/, "Opera"],
  [/Edg/, "Edge"],
  [/Firefox|FxiOS/, "Firefox"],
  [/CriOS|Chrome/, "Chrome"],
  [/Safari/, "Safari"],
];

const classifyBrowser = (ua: string) => BROWSERS.find(([re]) => re.test(ua))?.[1] ?? "Lainnya";

function classifyCity(headers: Headers): string {
  const decode = (v: string | null) => {
    try {
      return v ? decodeURIComponent(v) : "";
    } catch {
      return "";
    }
  };
  const city = decode(headers.get("x-vercel-ip-city"));
  const country = headers.get("x-vercel-ip-country") ?? "";
  if (!city) return country && country !== "ID" ? `Luar negeri (${country})` : "Tidak diketahui";
  return country && country !== "ID" ? `${city} (${country})` : city;
}

/** Nama untuk field hash: dibatasi supaya isian dari browser tidak bisa merusak data. */
const label = (value: string) =>
  value
    .replace(/[^\p{L}\p{N} _&.,'()/+-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

/* ---------- Pencatatan ---------- */

export interface Visitor {
  ip: string;
  ua: string;
  host: string;
  headers: Headers;
}

/** Hash harian yang tidak bisa dibalik ke IP: pengunjung yang sama dihitung sekali per hari, tanpa cookie. */
const visitorId = (day: string, v: Visitor) =>
  createHash("sha256").update(`${day}|${v.ip}|${v.ua}|${token}`).digest("base64url").slice(0, 16);

const MAX_EVENTS = 40;

export function parseEvents(body: unknown): TrackEvent[] {
  const list = (body as { e?: unknown } | null)?.e;
  if (!Array.isArray(list)) return [];
  const events: TrackEvent[] = [];
  for (const raw of list.slice(0, MAX_EVENTS)) {
    const e = raw as Record<string, unknown>;
    switch (e?.t) {
      case "pv":
        events.push({
          t: "pv",
          s: e.s === 1 ? 1 : undefined,
          r: typeof e.r === "string" ? e.r.slice(0, 300) : undefined,
          u: typeof e.u === "string" ? e.u.slice(0, 60) : undefined,
          m: e.m === 1 ? 1 : undefined,
        });
        break;
      case "eng":
        events.push({ t: "eng" });
        break;
      case "dur":
        // Satu laporan maksimal 30 menit, supaya tab yang lupa ditutup tidak merusak rata-rata.
        if (typeof e.n === "number" && e.n > 0) events.push({ t: "dur", n: Math.min(Math.round(e.n), 1800) });
        break;
      case "sec":
        if (isSectionId(e.k)) events.push({ t: "sec", k: e.k });
        break;
      case "wa":
      case "ig":
        if (typeof e.k === "string" && isKnownButton(label(e.k))) events.push({ t: e.t, k: label(e.k) });
        break;
      case "pf":
        if (typeof e.k === "string" && label(e.k)) events.push({ t: "pf", k: label(e.k) });
        break;
    }
  }
  return events;
}

export async function record(events: TrackEvent[], v: Visitor): Promise<void> {
  if (!redis || !events.length) return;
  const day = today();
  const key = dayKey(day);
  const p = redis.pipeline();

  for (const e of events) {
    switch (e.t) {
      case "pv":
        p.hincrby(key, "pv", 1);
        p.pfadd(visitorsKey(day), visitorId(day, v));
        p.expire(visitorsKey(day), TTL_SECONDS);
        if (e.s) {
          p.hincrby(key, "ses", 1);
          p.hincrby(key, `src:${classifySource(e.r, e.u, v.ua, v.host)}`, 1);
          p.hincrby(key, `dev:${classifyDevice(v.ua, e.m === 1)}`, 1);
          p.hincrby(key, `br:${classifyBrowser(v.ua)}`, 1);
          p.hincrby(key, `city:${classifyCity(v.headers)}`, 1);
          p.set(SINCE_KEY, day, { nx: true });
        }
        break;
      case "eng":
        p.hincrby(key, "eng", 1);
        break;
      case "dur":
        p.hincrby(key, "dur", e.n);
        break;
      case "sec":
        p.hincrby(key, `sec:${e.k}`, 1);
        break;
      case "wa":
      case "ig":
        p.hincrby(key, e.t, 1);
        p.hincrby(key, `${e.t}:${e.k}`, 1);
        break;
      case "pf":
        p.hincrby(key, `pf:${e.k}`, 1);
        break;
    }
  }
  p.expire(key, TTL_SECONDS);
  await p.exec();
}

/* ---------- Laporan ---------- */

const toRows = (map: Map<string, number>, limit = 12): StatRow[] =>
  [...map.entries()]
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, value }));

export async function readStats(days: RangeDays): Promise<StatsReport> {
  if (!redis) throw new Error("Database statistik belum tersambung.");
  const end = today();
  const dates = Array.from({ length: days }, (_, i) => addDays(end, i - days + 1));
  // Rentang 1 tahun ditampilkan per minggu supaya grafik tetap terbaca.
  const bucket = days > 90 ? "week" : "day";
  const size = bucket === "week" ? 7 : 1;
  const buckets: string[][] = [];
  for (let i = dates.length; i > 0; i -= size) buckets.unshift(dates.slice(Math.max(0, i - size), i));

  const p = redis.pipeline();
  for (const d of dates) p.hgetall(dayKey(d));
  for (const b of buckets) p.pfcount(visitorsKey(b[0]), ...b.slice(1).map(visitorsKey));
  p.pfcount(visitorsKey(dates[0]), ...dates.slice(1).map(visitorsKey));
  p.get(SINCE_KEY);
  const results = await p.exec();

  const hashes = results.slice(0, dates.length) as (Record<string, unknown> | null)[];
  const bucketVisitors = results.slice(dates.length, dates.length + buckets.length) as number[];
  const visitors = results[dates.length + buckets.length] as number;
  const since = (results[dates.length + buckets.length + 1] as string | null) ?? null;

  const totals = { visitors, sessions: 0, pageviews: 0, engaged: 0, duration: 0, wa: 0, ig: 0 };
  const groups: Record<string, Map<string, number>> = {};
  const perDay = new Map<string, Omit<SeriesPoint, "date" | "visitors">>();

  dates.forEach((date, i) => {
    const day = { sessions: 0, pageviews: 0, wa: 0 };
    for (const [field, raw] of Object.entries(hashes[i] ?? {})) {
      const value = Number(raw) || 0;
      const sep = field.indexOf(":");
      if (sep === -1) {
        if (field === "pv") day.pageviews += value;
        else if (field === "ses") day.sessions += value;
        else if (field === "wa") day.wa += value;
        else if (field === "eng") totals.engaged += value;
        else if (field === "dur") totals.duration += value;
        else if (field === "ig") totals.ig += value;
        continue;
      }
      const group = field.slice(0, sep);
      const map = (groups[group] ??= new Map());
      map.set(field.slice(sep + 1), (map.get(field.slice(sep + 1)) ?? 0) + value);
    }
    totals.sessions += day.sessions;
    totals.pageviews += day.pageviews;
    totals.wa += day.wa;
    perDay.set(date, day);
  });

  const series: SeriesPoint[] = buckets.map((b, i) => {
    const point: SeriesPoint = { date: b[0], visitors: bucketVisitors[i] ?? 0, sessions: 0, pageviews: 0, wa: 0 };
    for (const d of b) {
      const day = perDay.get(d)!;
      point.sessions += day.sessions;
      point.pageviews += day.pageviews;
      point.wa += day.wa;
    }
    return point;
  });

  const sectionMap = groups.sec ?? new Map<string, number>();
  return {
    days,
    bucket,
    since,
    totals,
    series,
    sources: toRows(groups.src ?? new Map()),
    devices: toRows(groups.dev ?? new Map()),
    browsers: toRows(groups.br ?? new Map(), 8),
    cities: toRows(groups.city ?? new Map(), 10),
    // Section ditampilkan urut halaman (bukan urut terbanyak) supaya terbaca sebagai alur pengunjung.
    sections: TRACKED_SECTIONS.map((s) => ({ key: s.id, value: sectionMap.get(s.id) ?? 0 })),
    waButtons: toRows(groups.wa ?? new Map(), 20),
    igButtons: toRows(groups.ig ?? new Map()),
    portfolio: toRows(groups.pf ?? new Map(), 20),
  };
}
