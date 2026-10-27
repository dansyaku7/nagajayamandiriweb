"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useSiteImage } from "@/components/SiteImages";
import { isOptimizable } from "@/config/images";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const logo = useSiteImage()("brand-logo");

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-300">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white text-[11px] md:text-xs py-2 px-4 shadow-xs border-b border-red-600/30">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.links.whatsapp}
              target="_blank"
              onClick={() => trackWhatsAppClick("navbar_topbar")}
              className="flex items-center gap-1.5 font-bold tracking-wide hover:text-red-200 transition-colors"
            >
              <Phone size={13} className="text-white" />
              <span>WHATSAPP: {siteConfig.contact.phone}</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 text-red-200 font-medium">
              <Clock size={12} />
              <span>Respon Cepat 24 Jam</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-red-100 font-medium">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-red-300" />
              <span>100% Workshop Sendiri & Bergaransi</span>
            </span>
            <span className="text-red-200 font-semibold">• Jabodetabek</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav
        aria-label="Navigasi Utama"
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-100"
            : "bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100/60 shadow-xs"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform hover:scale-[1.02]"
            aria-label="Kembali ke Beranda NJM Advertising"
          >
            <Image
              src={logo}
              unoptimized={!isOptimizable(logo)}
              alt="Logo Naga Jaya Mandiri Advertising - Spesialis Signage & Neon Box"
              width={260}
              height={70}
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* DESKTOP NAVIGATION MENU */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-red-700 hover:bg-red-50/60 rounded-lg transition-all"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* DESKTOP CTA BUTTON */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href={siteConfig.links.whatsapp}
              target="_blank"
              onClick={() => trackWhatsAppClick("navbar_penawaran")}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              <span>Minta Penawaran</span>
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            type="button"
            className="lg:hidden p-2 text-slate-800 hover:text-red-700 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[88px] bg-white border-b border-slate-200 shadow-2xl p-6 transition-all duration-300">
          <div className="flex flex-col gap-2">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-xl font-bold text-slate-800 hover:text-red-700 hover:bg-red-50/70 transition-all text-base"
                onClick={() => setIsOpen(false)}
              >
                <span>{item.title}</span>
                <ChevronRight size={18} className="text-slate-400" />
              </Link>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-sm uppercase tracking-wider transition-all"
              >
                <MessageCircle size={18} />
                <span>Konsultasi WhatsApp Sekarang</span>
              </Link>
              <p className="text-center text-xs text-slate-500 font-medium">
                Melayani Jakarta, Bogor, Depok, Tangerang & Bekasi
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
