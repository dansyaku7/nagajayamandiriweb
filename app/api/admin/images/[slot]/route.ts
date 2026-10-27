import { isSlotId, isValidImageUrl } from "@/config/images";
import { adminRoute, json } from "@/lib/server/api";
import { readImages, removeUpload, saveImages } from "@/lib/server/store";

type Ctx = { params: Promise<{ slot: string }> };

export const PUT = adminRoute<Ctx>(async (req, { params }) => {
  const { slot } = await params;
  if (!isSlotId(slot)) return json({ message: "Slot foto tidak dikenal." }, 404);
  const body = (await req.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!isValidImageUrl(url)) return json({ message: "URL harus diawali https:// (atau path yang diawali /)." }, 422);

  const current = await readImages();
  const previous = current[slot];
  const next = { ...current, [slot]: url };
  await saveImages(next);
  if (previous !== url) await removeUpload(previous);
  return json({ overrides: next });
});

export const DELETE = adminRoute<Ctx>(async (_req, { params }) => {
  const { slot } = await params;
  if (!isSlotId(slot)) return json({ message: "Slot foto tidak dikenal." }, 404);
  const { [slot]: previous, ...rest } = await readImages();
  await saveImages(rest);
  await removeUpload(previous);
  return json({ overrides: rest });
});
