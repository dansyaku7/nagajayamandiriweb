/**
 * Statistik situs untuk dashboard panel (/kelola-seo-njm). Dipakai bersama oleh pelacak di
 * browser, endpoint pencatat (/api/t), dan tampilan dashboard.
 */

/** Section beranda yang dihitung "dilihat" saat melewati tengah layar, urut sesuai halaman. */
export const TRACKED_SECTIONS = [
  { id: "about", label: "Tentang Kami" },
  { id: "services", label: "Layanan" },
  { id: "pricing", label: "Paket Harga" },
  { id: "portfolio", label: "Portofolio" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Kontak" },
  { id: "footer", label: "Footer" },
] as const;

export type SectionId = (typeof TRACKED_SECTIONS)[number]["id"];

export const isSectionId = (value: unknown): value is SectionId =>
  TRACKED_SECTIONS.some((s) => s.id === value);

/** Pilihan rentang waktu dashboard, dalam hari. */
export const RANGES = [7, 30, 90, 365] as const;
export type RangeDays = (typeof RANGES)[number];

export const isRange = (value: number): value is RangeDays => (RANGES as readonly number[]).includes(value);

/** Kunjungan dihitung selesai setelah 30 menit tanpa aktivitas, sama seperti Google Analytics. */
export const SESSION_TIMEOUT_MS = 30 * 60_000;

/** Kunjungan dianggap "terlibat" (bukan bounce) setelah 10 detik dilihat atau ada klik, sama seperti GA4. */
export const ENGAGED_AFTER_MS = 10_000;

/** Event yang dikirim browser ke /api/t. */
export type TrackEvent =
  /** Page view. s = kunjungan baru, r = referrer, u = utm_source, m = Mac layar sentuh (iPad). */
  | { t: "pv"; s?: 1; r?: string; u?: string; m?: 1 }
  /** Kunjungan menjadi "terlibat". */
  | { t: "eng" }
  /** Tambahan waktu dilihat, dalam detik. */
  | { t: "dur"; n: number }
  | { t: "sec"; k: SectionId }
  /** Klik WhatsApp / Instagram / project portofolio dibuka, k = asal tombol atau nama project. */
  | { t: "wa" | "ig" | "pf"; k: string };

export interface StatRow {
  key: string;
  value: number;
}

export interface SeriesPoint {
  /** Tanggal awal (YYYY-MM-DD) hari atau minggu tersebut. */
  date: string;
  visitors: number;
  sessions: number;
  pageviews: number;
  wa: number;
}

export interface StatsReport {
  days: RangeDays;
  bucket: "day" | "week";
  /** Tanggal pertama data tercatat, atau null bila belum ada kunjungan sama sekali. */
  since: string | null;
  totals: {
    visitors: number;
    sessions: number;
    pageviews: number;
    engaged: number;
    /** Total detik dilihat. */
    duration: number;
    wa: number;
    ig: number;
  };
  series: SeriesPoint[];
  sources: StatRow[];
  devices: StatRow[];
  browsers: StatRow[];
  cities: StatRow[];
  sections: StatRow[];
  waButtons: StatRow[];
  igButtons: StatRow[];
  portfolio: StatRow[];
}

export interface GaReport {
  totals: { users: number; sessions: number; pageviews: number; avgDuration: number; bounceRate: number; leads: number };
  series: { date: string; users: number; sessions: number }[];
  sources: StatRow[];
  devices: StatRow[];
}

export interface GaStatus {
  /** Database statistik (Redis) sudah tersambung, syarat untuk menyimpan kunci GA. */
  storage: boolean;
  /** Email service account dari kunci JSON yang diunggah. */
  email: string | null;
  propertyId: string | null;
}

/** Nama yang mudah dibaca untuk asal tombol WhatsApp / Instagram. */
const BUTTON_LABELS: Record<string, string> = {
  navbar_topbar: "Navbar · nomor di bar atas",
  navbar_penawaran: "Navbar · Minta Penawaran",
  navbar_mobile: "Menu HP · Konsultasi",
  hero_konsultasi: "Hero · Konsultasi",
  hero: "Hero",
  cta_section: "Section Kontak",
  floating_button: "Tombol mengambang",
  footer: "Footer",
  footer_icon: "Footer · ikon",
  footer_phone: "Footer · nomor telepon",
  portfolio_banner: "Banner Portofolio",
};

const BUTTON_PREFIXES: [string, string][] = [
  ["service_", "Layanan"],
  ["pricing_", "Paket"],
  ["lightbox_", "Portofolio"],
];

/** Hanya asal tombol yang memang ada di situs yang dicatat. */
export const isKnownButton = (key: string): boolean =>
  key in BUTTON_LABELS || BUTTON_PREFIXES.some(([p]) => key.startsWith(p) && key.length > p.length);

export function buttonLabel(key: string): string {
  if (BUTTON_LABELS[key]) return BUTTON_LABELS[key];
  const prefix = BUTTON_PREFIXES.find(([p]) => key.startsWith(p));
  return prefix ? `${prefix[1]} · ${key.slice(prefix[0].length)}` : key;
}
