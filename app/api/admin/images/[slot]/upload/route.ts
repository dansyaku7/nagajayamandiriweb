import { isSlotId } from "@/config/images";
import { adminRoute, json } from "@/lib/server/api";
import { readImages, removeUpload, saveImages, uploadImage } from "@/lib/server/store";

/** Batas body fungsi Vercel 4,5 MB; panel sudah memperkecil foto sebelum diunggah. */
const MAX_BYTES = 4 * 1024 * 1024;

/** Kenali jenis gambar dari byte awalnya, bukan dari nama file atau header yang bisa dipalsukan. */
function detectImage(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export const POST = adminRoute<{ params: Promise<{ slot: string }> }>(async (req, { params }) => {
  const { slot } = await params;
  if (!isSlotId(slot)) return json({ message: "Slot foto tidak dikenal." }, 404);

  const body = Buffer.from(await req.arrayBuffer());
  if (body.length > MAX_BYTES) return json({ message: "Ukuran file terlalu besar (maks. 4 MB)." }, 413);
  const ext = detectImage(body);
  if (!ext) return json({ message: "File harus berupa gambar JPG, PNG, atau WebP." }, 415);

  const url = await uploadImage(slot, ext, body);
  const current = await readImages();
  const previous = current[slot];
  const next = { ...current, [slot]: url };
  await saveImages(next);
  await removeUpload(previous);
  return json({ overrides: next });
});
