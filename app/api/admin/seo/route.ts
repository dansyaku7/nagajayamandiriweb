import { validateSeo } from "@/config/seo";
import { adminRoute, json } from "@/lib/server/api";
import { readSeo, saveSeo, storageEnabled } from "@/lib/server/store";

export const GET = adminRoute(async () => json({ settings: await readSeo(), storage: storageEnabled() }));

export const PUT = adminRoute(async (req) => {
  const result = validateSeo(await req.json().catch(() => null));
  if (!result.ok) return json({ message: "Periksa kembali isian yang ditandai.", errors: result.errors }, 422);
  await saveSeo(result.value);
  return json({ settings: result.value });
});
