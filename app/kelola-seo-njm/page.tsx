import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

/** Panel SEO & Foto. Tidak ditautkan dari halaman mana pun dan tidak diindeks mesin pencari. */
export const metadata: Metadata = {
  title: "Panel SEO · NJM Advertising",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.ico" },
};

export default function KelolaSeoPage() {
  return <AdminApp />;
}
