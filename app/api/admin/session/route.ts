import type { NextRequest } from "next/server";
import { json } from "@/lib/server/api";
import { isAuthenticated } from "@/lib/server/auth";

export function GET(req: NextRequest) {
  return json({ authenticated: isAuthenticated(req) });
}
