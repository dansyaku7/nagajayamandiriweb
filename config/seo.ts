/**
 * Pengaturan SEO yang bisa diubah dari panel tersembunyi (/kelola-seo-njm). Dipakai bersama oleh
 * server (generateMetadata, robots, sitemap) dan panel admin (formulir), supaya aturan validasinya
 * hanya ditulis sekali.
 */
export interface SeoSettings {
  siteUrl: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  /** Isi atribut content dari meta tag verifikasi Google Search Console. */
  googleVerification: string;
  /** Nama file verifikasi HTML Search Console, mis. google1a2b3c4d5e6f7a8b.html */
  googleVerificationFile: string;
  bingVerification: string;
  /** Google Analytics 4, format G-XXXXXXXXXX */
  gaMeasurementId: string;
  /** Google Tag Manager, format GTM-XXXXXXX */
  gtmId: string;
  robotsIndex: boolean;
  updatedAt: string;
}

export const SEO_LIMITS = {
  title: { ideal: 60, max: 120 },
  description: { ideal: 160, max: 320 },
  keywords: { max: 500 },
} as const;

/** Nilai awal sama dengan yang sebelumnya ditulis langsung di layout, jadi situs tidak berubah sebelum panel dipakai. */
export const defaultSeo: SeoSettings = {
  siteUrl: "https://www.njm-advertising.com",
  title: "NJM Advertising - Jasa Neon Box, Huruf Timbul & Signage Jakarta Jabodetabek",
  description:
    "Jasa pembuatan Neon Box, Huruf Timbul (Stainless, Acrylic, LED), Pylon Sign, Billboard & Signage Reklame profesional di Jabodetabek. Workshop milik sendiri, presisi tinggi & bergaransi.",
  keywords:
    "jasa neon box jakarta, huruf timbul stainless, huruf timbul akrilik, pylon sign jabodetabek, plang nama toko, neon box bekasi, neon box tangerang, billboard reklame jakarta, kontraktor advertising jabodetabek, neon sign custom, naga jaya mandiri, njm advertising",
  ogImage: "/images/hero-bg.jpg",
  googleVerification: "qfA98IfdPHRGjLz0V6E4s_NG6eAujthOFmPpqXNzO1E",
  googleVerificationFile: "",
  bingVerification: "",
  gaMeasurementId: "G-2T3N94DB2Y",
  gtmId: "",
  robotsIndex: true,
  updatedAt: new Date(0).toISOString(),
};

export type SeoValidation =
  | { ok: true; value: SeoSettings }
  | { ok: false; errors: Partial<Record<keyof SeoSettings, string>> };

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Pengguna sering menempel seluruh tag <meta ...>; ambil nilai content-nya saja. */
function extractMetaContent(raw: string): string {
  const match = raw.match(/content\s*=\s*["']([^"']+)["']/i);
  return (match?.[1] ?? raw).trim();
}

export function validateSeo(input: unknown): SeoValidation {
  const src = (input ?? {}) as Record<string, unknown>;
  const errors: Partial<Record<keyof SeoSettings, string>> = {};

  const siteUrl = str(src.siteUrl).replace(/\/+$/, "");
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(siteUrl)) errors.siteUrl = "URL harus diawali http:// atau https://";

  const title = str(src.title);
  if (!title) errors.title = "Judul wajib diisi";
  else if (title.length > SEO_LIMITS.title.max) errors.title = `Maksimal ${SEO_LIMITS.title.max} karakter`;

  const description = str(src.description);
  if (!description) errors.description = "Deskripsi wajib diisi";
  else if (description.length > SEO_LIMITS.description.max)
    errors.description = `Maksimal ${SEO_LIMITS.description.max} karakter`;

  const keywords = str(src.keywords);
  if (keywords.length > SEO_LIMITS.keywords.max) errors.keywords = `Maksimal ${SEO_LIMITS.keywords.max} karakter`;

  const ogImage = str(src.ogImage);
  if (ogImage && !/^(https?:\/\/|\/)[^\s"'<>]+$/i.test(ogImage))
    errors.ogImage = "Gunakan URL lengkap atau path yang diawali /";

  const googleVerification = extractMetaContent(str(src.googleVerification));
  if (googleVerification && !/^[A-Za-z0-9_-]{10,100}$/.test(googleVerification))
    errors.googleVerification = "Kode verifikasi tidak valid";

  const googleVerificationFile = str(src.googleVerificationFile).replace(/^\/+/, "");
  if (googleVerificationFile && !/^google[a-z0-9]{8,40}\.html$/i.test(googleVerificationFile))
    errors.googleVerificationFile = "Format: google123abc....html";

  const bingVerification = extractMetaContent(str(src.bingVerification));
  if (bingVerification && !/^[A-Za-z0-9_-]{10,100}$/.test(bingVerification))
    errors.bingVerification = "Kode verifikasi tidak valid";

  const gaMeasurementId = str(src.gaMeasurementId).toUpperCase();
  if (gaMeasurementId && !/^G-[A-Z0-9]{4,16}$/.test(gaMeasurementId))
    errors.gaMeasurementId = "Format: G-XXXXXXXXXX";

  const gtmId = str(src.gtmId).toUpperCase();
  if (gtmId && !/^GTM-[A-Z0-9]{4,12}$/.test(gtmId)) errors.gtmId = "Format: GTM-XXXXXXX";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      siteUrl,
      title,
      description,
      keywords,
      ogImage,
      googleVerification,
      googleVerificationFile,
      bingVerification,
      gaMeasurementId,
      gtmId,
      robotsIndex: src.robotsIndex !== false,
      updatedAt: new Date().toISOString(),
    },
  };
}
