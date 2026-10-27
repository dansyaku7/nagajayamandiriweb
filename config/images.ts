/**
 * Daftar semua foto di situs yang bisa diganti dari panel admin (tab Foto). Dipakai bersama oleh
 * halaman (untuk memilih foto yang tampil), server (untuk validasi slot), dan panel admin (untuk
 * menampilkan pratinjau beserta letaknya di halaman).
 */

export type ImageGroup = "Brand" | "Hero" | "Owner" | "Portofolio";

const hero = (n: number, label: string, file: string) =>
  ({
    id: `hero-${n}`,
    group: "Hero",
    label: `Slide ${n} — ${label}`,
    where: `Latar paling atas (slideshow), slide ke-${n}`,
    anchor: "",
    aspect: "16/9",
    recommended: "Lanskap, min. 1920×1080 px",
    defaultSrc: `/images/${file}`,
  }) as const;

const owner = (n: number, file: string) =>
  ({
    id: `owner-${n}`,
    group: "Owner",
    label: `Foto owner ${n}`,
    where: `Section Tentang Kami, slider foto Niko Christian (foto ke-${n})`,
    anchor: "about",
    aspect: "4/5",
    recommended: "Potret, min. 1000×1250 px (wajah di bagian atas)",
    defaultSrc: `/images/${file}`,
  }) as const;

const project = (id: string, label: string, file: string) =>
  ({
    id: `portfolio-${id}`,
    group: "Portofolio",
    label,
    where: "Section Portofolio, kotak foto project",
    anchor: "portfolio",
    aspect: "1/1",
    recommended: "Persegi atau lanskap, min. 1200 px",
    defaultSrc: `/images/${file}`,
  }) as const;

export const IMAGE_SLOTS = [
  { id: "brand-logo", group: "Brand", label: "Logo NJM", where: "Navbar dan footer", anchor: "", aspect: "16/9", recommended: "PNG transparan atau SVG, lebar min. 600 px", defaultSrc: "/images/logonjm.svg" },
  { id: "og-image", group: "Brand", label: "Gambar share (Open Graph)", where: "Tampil saat link dibagikan di WhatsApp, Facebook, LinkedIn", anchor: "", aspect: "1200/630", recommended: "1200×630 px", defaultSrc: "/images/hero-bg.jpg" },
  { id: "favicon", group: "Brand", label: "Ikon tab browser (favicon)", where: "Ikon kecil di tab browser dan hasil pencarian Google", anchor: "", aspect: "1/1", recommended: "PNG persegi, min. 192×192 px", defaultSrc: "/favicon.ico" },
  { id: "whatsapp-icon", group: "Brand", label: "Ikon WhatsApp", where: "Tombol WhatsApp di section Kontak, footer, dan tombol mengambang", anchor: "cta", aspect: "1/1", recommended: "PNG transparan, persegi, min. 128×128 px", defaultSrc: "/images/logowa2.png" },

  hero(1, "Ballroom Signage", "ballroom2.jpg"),
  hero(2, "Neon Box Fasad Toko", "carwashgogo.jpg"),
  hero(3, "Pylon Sign Royal Urban", "royalurban.jpg"),
  hero(4, "Signage Gedung & Keamanan", "security.jpg"),
  hero(5, "Signage Outdoor Padel", "padel.jpg"),
  hero(6, "Neon Sign Olse Donut", "olsedonut.jpg"),

  owner(1, "owner.jpg"),
  owner(2, "owner12.jpg"),
  owner(3, "owner2.jpg"),

  project("angkasakarya", "Angkasa Karya", "angkasakarya.jpg"),
  project("ballroom", "Ballroom Signage", "ballroom2.jpg"),
  project("banteng", "Project Banteng", "banteng.jpg"),
  project("carwashgogo", "Carwash Gogo", "carwashgogo.jpg"),
  project("centralindomedika", "Central Indo Medika", "centralindonusamedika.jpg"),
  project("citrasehat", "Citra Sehat", "citrasehatreflexology.jpg"),
  project("lumiclinic", "Lumi Clinic", "lumiclinic.jpg"),
  project("manleyburger", "Manley Burger", "manleyburgerax.jpg"),
  project("olsedonut", "Olse Donut", "olsedonut.jpg"),
  project("padel", "Padel Court", "padel.jpg"),
  project("pesonamobil", "Pesona Mobil", "pesonamobil.jpg"),
  project("ptdian", "PT Dian Project", "PTDIAN.jpg"),
  project("purisafana", "Puri Safana Cikeas", "purisafana.jpg"),
  project("ribens", "Ribens Sports", "ribens.jpg"),
  project("seastar", "Seastar Resto", "seastarresto.jpg"),
] as const satisfies readonly {
  id: string;
  group: ImageGroup;
  label: string;
  where: string;
  anchor: string;
  aspect: string;
  recommended: string;
  defaultSrc: string;
}[];

export type ImageSlot = (typeof IMAGE_SLOTS)[number];
export type SlotId = ImageSlot["id"];
/** Foto pengganti per slot. Slot yang tidak ada di sini memakai defaultSrc. */
export type ImageOverrides = Partial<Record<SlotId, string>>;

export const IMAGE_GROUPS: ImageGroup[] = ["Brand", "Hero", "Owner", "Portofolio"];

const slotIds = new Set<string>(IMAGE_SLOTS.map((s) => s.id));
export const isSlotId = (id: string): id is SlotId => slotIds.has(id);

/** URL lengkap http(s) atau path lokal yang diawali "/". Tanpa spasi, kutip, atau kurung sudut. */
export const isValidImageUrl = (url: string): boolean => /^(https?:\/\/|\/)[^\s"'<>()]+$/i.test(url) && url.length <= 1000;

export function sanitizeOverrides(input: unknown): ImageOverrides {
  const out: ImageOverrides = {};
  if (!input || typeof input !== "object") return out;
  for (const [key, value] of Object.entries(input)) {
    if (isSlotId(key) && typeof value === "string" && isValidImageUrl(value)) out[key] = value;
  }
  return out;
}

export function resolveImage(overrides: ImageOverrides, id: SlotId): string {
  return overrides[id] ?? IMAGE_SLOTS.find((s) => s.id === id)!.defaultSrc;
}

/**
 * next/image hanya bisa mengoptimasi foto lokal dan foto unggahan di Vercel Blob (lihat
 * images.remotePatterns di next.config.ts). Foto dari URL lain ditampilkan apa adanya.
 */
export const isOptimizable = (src: string): boolean =>
  src.startsWith("/") || /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i.test(src);
