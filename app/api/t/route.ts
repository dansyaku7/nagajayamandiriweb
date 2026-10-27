import type { NextRequest } from "next/server";
import { clientIp } from "@/lib/server/auth";
import { isBot, parseEvents, record } from "@/lib/server/stats";

const MAX_BODY = 8_000;
const noContent = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

/** Hanya terima kiriman dari halaman situs ini sendiri, bukan dari situs lain. */
function sameOrigin(req: NextRequest): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** Pencatat kunjungan dari components/Tracker.tsx. Selalu membalas 204 agar tidak mengganggu pengunjung. */
export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!sameOrigin(req) || isBot(ua)) return noContent();

  const text = await req.text();
  if (text.length > MAX_BODY) return noContent();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return noContent();
  }

  await record(parseEvents(body), {
    ip: clientIp(req),
    ua,
    host: req.headers.get("host") ?? "",
    headers: req.headers,
  }).catch((err: unknown) => console.error("[stats] gagal mencatat", err));
  return noContent();
}
