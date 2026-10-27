import { json } from "@/lib/server/api";
import { setSessionCookie } from "@/lib/server/auth";

export function POST() {
  const res = json({ authenticated: false });
  setSessionCookie(res, null);
  return res;
}
