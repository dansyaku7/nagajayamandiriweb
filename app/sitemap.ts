import { MetadataRoute } from "next";
import { getSeo } from "@/lib/server/store";

/**
 * Situs ini satu halaman. Alamat dengan #anchor tidak dianggap halaman terpisah oleh Google,
 * jadi sitemap cukup berisi beranda.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeo();
  const updated = seo.updatedAt > new Date(0).toISOString() ? new Date(seo.updatedAt) : new Date();

  return [
    {
      url: `${seo.siteUrl}/`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
