import type { NextConfig } from "next";

const noIndex = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "no-store" },
];

const nextConfig: NextConfig = {
  images: {
    // Foto yang diunggah dari panel admin (/kelola-seo-njm) disimpan di Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      { source: "/kelola-seo-njm", headers: noIndex },
      { source: "/api/admin/:path*", headers: noIndex },
    ];
  },
  async rewrites() {
    return [
      // File verifikasi HTML Google Search Console yang namanya diisi dari panel SEO.
      { source: "/:file(google[a-zA-Z0-9]+\\.html)", destination: "/api/google-verification/:file" },
    ];
  },
};

export default nextConfig;
