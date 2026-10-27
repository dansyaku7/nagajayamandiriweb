import { isRange } from "@/config/analytics";
import { adminRoute, json } from "@/lib/server/api";
import { GaError, gaReport, gaStatus, removeGa, saveGaKey, saveGaProperty } from "@/lib/server/ga";

/** Status koneksi GA4 sekaligus laporannya untuk rentang yang dipilih (bila sudah lengkap). */
export const GET = adminRoute(async (req) => {
  const days = Number(req.nextUrl.searchParams.get("days") ?? 7);
  if (!isRange(days)) return json({ message: "Rentang waktu tidak dikenal." }, 400);
  const status = await gaStatus();
  try {
    return json({ status, report: await gaReport(days), error: null });
  } catch (err) {
    if (err instanceof GaError) return json({ status, report: null, error: err.message });
    throw err;
  }
});

/** Body: { key?: string (isi file JSON), propertyId?: string }. */
export const PUT = adminRoute(async (req) => {
  const body = (await req.json().catch(() => null)) as { key?: unknown; propertyId?: unknown } | null;
  try {
    if (typeof body?.key === "string") await saveGaKey(body.key);
    if (typeof body?.propertyId === "string") await saveGaProperty(body.propertyId);
  } catch (err) {
    if (err instanceof GaError) return json({ message: err.message }, 422);
    throw err;
  }
  return json({ status: await gaStatus() });
});

export const DELETE = adminRoute(async () => {
  await removeGa();
  return json({ status: await gaStatus() });
});
