import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/config/site";

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "NJM Advertising - Jasa Neon Box, Huruf Timbul & Signage Jakarta Jabodetabek",
    template: "%s | NJM Advertising",
  },
  description:
    "Jasa pembuatan Neon Box, Huruf Timbul (Stainless, Acrylic, LED), Pylon Sign, Billboard & Signage Reklame profesional di Jabodetabek. Workshop milik sendiri, presisi tinggi & bergaransi.",
  keywords: [
    "jasa neon box jakarta",
    "huruf timbul stainless",
    "huruf timbul akrilik",
    "pylon sign jabodetabek",
    "plang nama toko",
    "neon box bekasi",
    "neon box tangerang",
    "billboard reklame jakarta",
    "kontraktor advertising jabodetabek",
    "neon sign custom",
    "naga jaya mandiri",
    "njm advertising",
  ],
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
    title:
      "NJM Advertising - Jasa Neon Box, Huruf Timbul & Signage Profesional",
    description:
      "Partner visual branding & advertising terbaik di Jabodetabek. Spesialis pembuatan Neon Box, Huruf Timbul, Pylon Sign, hingga Billboard dengan workshop milik sendiri.",
    url: siteConfig.url,
    siteName: "NJM Advertising",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Workshop & Portofolio NJM Advertising Jabodetabek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NJM Advertising - Jasa Pembuatan Signage & Reklame Jabodetabek",
    description:
      "Pengerjaan Neon Box, Huruf Timbul Stainless/Acrylic, Pylon Sign & Billboard langsung dari workshop sendiri. Presisi & bergaransi.",
    images: ["/images/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteConfig.url}/#business`,
      name: "NJM Advertising (PT Naga Jaya Mandiri)",
      alternateName: "Naga Jaya Mandiri Advertising",
      description:
        "Spesialis pembuatan Neon Box, Huruf Timbul, Pylon Sign, Billboard, dan Signage Reklame profesional di wilayah Jabodetabek dengan workshop milik sendiri.",
      url: siteConfig.url,
      telephone: "+6285174145007",
      priceRange: "$$",
      image: `${siteConfig.url}/images/logonjm.png`,
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
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: "NJM Advertising",
      description: siteConfig.description,
      publisher: {
        "@id": `${siteConfig.url}/#business`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="qfA98IfdPHRGjLz0V6E4s_NG6eAujthOFmPpqXNzO1E"
        />

        {/* Google Analytics 4 (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-2T3N94DB2Y"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2T3N94DB2Y');
          `}
        </Script>

        {/* Structured Data JSON-LD (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-red-600 selection:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
