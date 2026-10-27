import type { NextRequest } from "next/server";
import { json } from "@/lib/server/api";
import * as auth from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  const ip = auth.clientIp(req);
  const wait = auth.loginBlocked(ip);
  if (wait > 0) return json({ message: `Terlalu banyak percobaan. Coba lagi dalam ${wait} menit.` }, 429);

  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!auth.passwordMatches(password)) {
    auth.recordFailure(ip);
    return json({ message: "Password salah." }, 401);
  }
  auth.clearFailures(ip);
  const res = json({ authenticated: true });
  auth.setSessionCookie(res, auth.issueToken());
  return res;
}
