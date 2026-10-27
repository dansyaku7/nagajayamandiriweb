import { MetadataRoute } from "next";
import { getSeo } from "@/lib/server/store";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeo();

  // Saat izin indeks dimatikan dari panel SEO, seluruh situs ditutup untuk mesin pencari.
  if (!seo.robotsIndex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
