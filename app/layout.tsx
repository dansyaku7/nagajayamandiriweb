import type { Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
};

/** Kerangka HTML saja. Metadata, Navbar & Analytics situs ada di app/(site)/layout.tsx, panel di app/kelola-seo-njm. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
