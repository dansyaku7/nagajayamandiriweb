import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { SiteImagesProvider } from "@/components/SiteImages";
import { resolveImage } from "@/config/images";
import { getImages, getSeo } from "@/lib/server/store";

/** Halaman statis yang dibuat ulang tiap 1 jam, atau langsung setelah panel menyimpan perubahan. */
export const revalidate = 3600;

/** Seluruh meta tag diambil dari panel SEO (/kelola-seo-njm), dengan nilai awal di config/seo.ts. */
export async function generateMetadata(): Promise<Metadata> {
  const [seo, images] = await Promise.all([getSeo(), getImages()]);
  const ogImage = images["og-image"] ?? seo.ogImage;
  const favicon = resolveImage(images, "favicon");

  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      default: seo.title,
      template: "%s | NJM Advertising",
    },
    description: seo.description,
    keywords: seo.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    authors: [{ name: "Niko Christian" }, { name: "NJM Advertising" }],
    creator: "NJM Advertising",
    publisher: "PT Naga Jaya Mandiri",
    formatDetection: {
      email: false,
      address: true,
      telephone: true,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.siteUrl,
      siteName: "NJM Advertising",
      locale: "id_ID",
      type: "website",
      images: ogImage ? [{ url: ogImage, alt: "Workshop & Portofolio NJM Advertising Jabodetabek" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: seo.robotsIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : { index: false, follow: false },
    verification: {
      google: seo.googleVerification || undefined,
      other: seo.bingVerification ? { "msvalidate.01": seo.bingVerification } : undefined,
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
  };
}

/** JSON di dalam <script> aman dari penutupan tag lebih awal bila "<" di-escape. */
const safeJson = (value: unknown): string => JSON.stringify(value).replace(/</g, "\\u003c");

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [seo, images] = await Promise.all([getSeo(), getImages()]);
  const siteUrl = seo.siteUrl;
  const absolute = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url);
  const logo = images["brand-logo"] ?? "/images/logonjm.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: "NJM Advertising (PT Naga Jaya Mandiri)",
        alternateName: "Naga Jaya Mandiri Advertising",
        description: seo.description,
        url: siteUrl,
        telephone: "+6285174145007",
        priceRange: "$$",
        image: absolute(logo),
        logo: absolute(logo),
        founder: {
          "@type": "Person",
          name: "Niko Christian",
          jobTitle: "Founder & Owner",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jakarta",
          addressRegion: "DKI Jakarta & Jabodetabek",
          addressCountry: "ID",
        },
        areaServed: [
          { "@type": "City", name: "Jakarta" },
          { "@type": "City", name: "Bogor" },
          { "@type": "City", name: "Depok" },
          { "@type": "City", name: "Tangerang" },
          { "@type": "City", name: "Bekasi" },
        ],
        sameAs: [
          "https://instagram.com/njm.advertising",
          "https://instagram.com/nagajayamandiri",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Layanan Signage & Advertising NJM",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Jasa Pembuatan Neon Box",
                description:
                  "Media promosi visual menyala siang dan malam dengan bahan acrylic atau backlite berkualitas.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Jasa Huruf Timbul (Letter Sign)",
                description:
                  "Pembuatan huruf timbul berbahan Stainless, Acrylic, Galvanis, LED, dan Acrylic LED.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Pylon / Totem Sign",
                description:
                  "Penanda identitas bisnis skala besar yang kokoh, megah, dan elegan.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Billboard & Videotron",
                description:
                  "Konstruksi media reklame luar ruang skala besar untuk visibilitas maksimal.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Neon Sign Custom",
                description:
                  "Lampu neon fleksibel artistik untuk interior cafe, outlet, dan dekorasi komersial.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Shop Signage & Fascia Toko",
                description:
                  "Branding fasad toko dan signage toko profesional yang menarik perhatian pembeli.",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "NJM Advertising",
        description: seo.description,
        publisher: {
          "@id": `${siteUrl}/#business`,
        },
      },
    ],
  };

  return (
    <>
      {/* Google Tag Manager (opsional, diisi dari panel SEO) */}
      {seo.gtmId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${seo.gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${seo.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Google Analytics 4 (gtag.js), ID diatur dari panel SEO */}
      {seo.gaMeasurementId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${seo.gaMeasurementId}`}
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seo.gaMeasurementId}');
            `}
          </Script>
        </>
      )}

      {/* Structured Data JSON-LD (Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }}
      />

      <SiteImagesProvider overrides={images}>
        <Navbar />
        {children}
      </SiteImagesProvider>
    </>
  );
}
