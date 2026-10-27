import { isRange } from "@/config/analytics";
import { adminRoute, json } from "@/lib/server/api";
import { readStats, redis } from "@/lib/server/stats";

export const GET = adminRoute(async (req) => {
  if (!redis) return json({ enabled: false, report: null });
  const days = Number(req.nextUrl.searchParams.get("days") ?? 7);
  if (!isRange(days)) return json({ message: "Rentang waktu tidak dikenal." }, 400);
  return json({ enabled: true, report: await readStats(days) });
});
