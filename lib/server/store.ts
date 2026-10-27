import { del, list, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { sanitizeOverrides, type ImageOverrides, type SlotId } from "@/config/images";
import { defaultSeo, validateSeo, type SeoSettings } from "@/config/seo";
import { PREFIX } from "./env";

/**
 * Pengaturan panel disimpan di Vercel Blob (store "njm-kelola-seo"), karena filesystem Vercel
 * read-only. BLOB_READ_WRITE_TOKEN dipasang otomatis oleh Vercel saat store disambungkan.
 */
const SEO_DIR = `${PREFIX}/settings/seo/`;
const IMAGES_DIR = `${PREFIX}/settings/images/`;
/** Versi lama yang disimpan sebagai cadangan bila perlu dikembalikan manual. */
const KEEP_VERSIONS = 5;

export const storageEnabled = (): boolean => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export class StorageDisabledError extends Error {
  constructor() {
    super("Penyimpanan belum aktif. Sambungkan Vercel Blob ke project ini.");
  }
}

/** Versi diurutkan dari yang terbaru; nama file berupa waktu simpan (ms) dengan panjang tetap. */
async function versions(dir: string) {
  const { blobs } = await list({ prefix: dir });
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
}

/**
 * Setiap simpan menulis file baru, bukan menimpa file lama. File yang ditimpa masih bisa tersaji
 * versi lamanya dari CDN Blob selama beberapa detik, sedangkan URL baru selalu berisi data terbaru.
 * Versi terbaru dicari lewat list(), yang selalu mutakhir.
 */
async function readJson(dir: string): Promise<unknown> {
  if (!storageEnabled()) return null;
  const [latest] = await versions(dir);
  if (!latest) return null;
  // Isi satu URL versi tidak pernah berubah, jadi aman di-cache (dan halaman tetap statis).
  const res = await fetch(latest.url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Gagal membaca ${latest.pathname} (${res.status})`);
  return res.json();
}

async function writeJson(dir: string, value: unknown): Promise<void> {
  if (!storageEnabled()) throw new StorageDisabledError();
  await put(`${dir}${Date.now()}.json`, JSON.stringify(value, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  const old = (await versions(dir)).slice(KEEP_VERSIONS);
  if (old.length) await del(old.map((b) => b.url)).catch((err: unknown) => console.error("[store] gagal merapikan versi lama", err));
}

/* ---------- Baca langsung (panel admin) ---------- */

/*
 * Galat jaringan sengaja tidak ditangkap: lebih baik permintaan gagal (ISR tetap menyajikan
 * halaman versi sebelumnya, panel menampilkan pesan galat) daripada diam-diam memakai nilai
 * default yang lalu tersimpan di cache halaman atau menimpa data asli saat panel menyimpan.
 */

export async function readSeo(): Promise<SeoSettings> {
  const parsed = (await readJson(SEO_DIR)) as SeoSettings | null;
  if (!parsed) return defaultSeo;
  const result = validateSeo({ ...defaultSeo, ...parsed });
  // Data yang rusak atau tidak valid tidak boleh menjatuhkan situs.
  return result.ok ? { ...result.value, updatedAt: parsed.updatedAt } : defaultSeo;
}

export async function readImages(): Promise<ImageOverrides> {
  return sanitizeOverrides(await readJson(IMAGES_DIR));
}

/* ---------- Halaman publik ---------- */

/**
 * Halaman publik dirender statis (ISR, revalidate 1 jam), jadi Blob hanya dibaca saat halaman
 * dibuat ulang, bukan di setiap kunjungan. cache() mencegah pembacaan ganda dalam satu render.
 */
export const getSeo = cache(readSeo);
export const getImages = cache(readImages);

/** Buat ulang semua halaman (beranda, robots.txt, sitemap.xml) agar perubahan panel langsung tampil. */
function refreshSite(): void {
  revalidatePath("/", "layout");
}

/* ---------- Tulis ---------- */

export async function saveSeo(next: SeoSettings): Promise<void> {
  await writeJson(SEO_DIR, next);
  refreshSite();
}

export async function saveImages(next: ImageOverrides): Promise<void> {
  await writeJson(IMAGES_DIR, next);
  refreshSite();
}

const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

/** Simpan foto unggahan dan kembalikan URL publiknya. */
export async function uploadImage(slot: SlotId, ext: keyof typeof MIME, body: Buffer): Promise<string> {
  if (!storageEnabled()) throw new StorageDisabledError();
  // Nama unik per unggahan, sehingga cache browser/CDN tidak pernah menyajikan foto lama.
  const blob = await put(`${PREFIX}/uploads/${slot}-${Date.now().toString(36)}.${ext}`, body, {
    access: "public",
    contentType: MIME[ext],
    addRandomSuffix: true,
  });
  return blob.url;
}

/** Hapus file unggahan lama bila foto diganti atau dikembalikan ke default. */
export async function removeUpload(url: string | undefined): Promise<void> {
  if (!url || !storageEnabled()) return;
  let pathname: string;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(".public.blob.vercel-storage.com")) return;
    pathname = decodeURIComponent(parsed.pathname.slice(1));
  } catch {
    return;
  }
  // Hanya file unggahan panel ini yang boleh dihapus, bukan pengaturan atau file lain di store.
  if (!pathname.startsWith(`${PREFIX}/uploads/`)) return;
  await del(url).catch((err: unknown) => console.error("[store] gagal menghapus foto lama", err));
}
