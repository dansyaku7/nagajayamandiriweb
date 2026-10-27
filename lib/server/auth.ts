import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const COOKIE = "njm_admin";
const SESSION_HOURS = 8;

/**
 * Password panel ditulis di kode (bukan .env), tetapi hanya dalam bentuk hash scrypt karena repo
 * ini publik. Untuk mengganti password, buat hash baru:
 *   node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');console.log(s, c.scryptSync('PASSWORD_BARU',s,32).toString('hex'))"
 * lalu salin kedua nilainya ke bawah ini.
 */
const PASSWORD_SALT = "f5171eb0f76d0cba0dc492259f0b72b6";
const PASSWORD_HASH = "e9c302c809ff2a7d30b1ab61f60917e5c7cfd27a8eb2fa7e083a34ef181fa361";

/**
 * Kunci tanda tangan sesi harus rahasia dan sama di semua instance serverless. Token Blob sudah
 * memenuhi keduanya, jadi tidak perlu variabel tambahan. Mengganti password juga membatalkan sesi lama.
 */
const secret = createHash("sha256")
  .update(`njm-admin-session|${PASSWORD_HASH}|${process.env.SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN || randomBytes(32).toString("hex")}`)
  .digest();

export function passwordMatches(candidate: string): boolean {
  const given = scryptSync(candidate, PASSWORD_SALT, 32);
  return timingSafeEqual(given, Buffer.from(PASSWORD_HASH, "hex"));
}

const sign = (payload: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function issueToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3_600_000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function setSessionCookie(res: NextResponse, token: string | null): void {
  res.cookies.set(COOKIE, token ?? "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/admin",
    maxAge: token ? SESSION_HOURS * 3600 : 0,
  });
}

export const isAuthenticated = (req: NextRequest): boolean => verifyToken(req.cookies.get(COOKIE)?.value);

export const clientIp = (req: NextRequest): string =>
  req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

/** Pembatas percobaan login sederhana per IP: 5 kali gagal dalam 15 menit. */
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;

export function loginBlocked(ip: string): number {
  const entry = attempts.get(ip);
  if (!entry || entry.until < Date.now()) return 0;
  return entry.count >= MAX_ATTEMPTS ? Math.ceil((entry.until - Date.now()) / 60_000) : 0;
}

export function recordFailure(ip: string): void {
  const entry = attempts.get(ip);
  if (!entry || entry.until < Date.now()) attempts.set(ip, { count: 1, until: Date.now() + WINDOW_MS });
  else entry.count += 1;
}

export const clearFailures = (ip: string): void => void attempts.delete(ip);
