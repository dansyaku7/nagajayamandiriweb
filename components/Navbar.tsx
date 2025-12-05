"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full fixed top-0 z-50">
      
      {/* 1. TOP BAR - SEKARANG MERAH (Teks Putih) */}
      {/* Fokus mata langsung ke nomor telepon karena warnanya mencolok */}
      <div className="bg-red-700 text-white text-[10px] md:text-xs py-2 px-4 shadow-sm z-50 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-bold tracking-wide">
              {/* Icon putih biar kontras sama background merah */}
              <Phone size={12} className="text-white" /> 
              WHATSAPP: 0851-7414-5007
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-medium">
             {/* Teks secondary putih agak transparan dikit biar ada hierarki, atau putih solid juga oke */}
             <span className="text-red-100">Melayani Jabodetabek</span>
          </div>
        </div>
      </div>
      
      {/* 2. MAIN NAVBAR - SEKARANG PUTIH (Clean Look) */}
      <header className="bg-white shadow-md py-4 transition-all">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo Image */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logonjm.png" 
              alt="Logo Naga Jaya Mandiri"
              width={400} // Gue naikin "intrinsic width" biar pas dirender gede gak pecah
              height={120} // Gue naikin juga
              // PERUBAHAN DISINI:
              // h-12 (48px) untuk HP
              // md:h-20 (80px) untuk Desktop/Laptop
              className="h-12 md:h-20 w-auto object-contain" 
              priority
            />
          </Link>

          {/* Desktop Menu - Teks Hitam */}
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                // Teks Slate-900 (Hitam), Hover jadi Merah biar interaktif
                className="text-sm font-bold text-slate-900 hover:text-red-700 hover:underline decoration-red-700 decoration-2 underline-offset-4 transition-all uppercase"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
             {/* Button Penawaran - Dibalik jadi Merah (Teks Putih) biar kontras di atas putih */}
             <Link
              href={siteConfig.links.whatsapp}
              className="bg-red-700 text-white px-5 py-2 rounded text-sm font-bold uppercase hover:bg-red-800 transition-all shadow-lg shadow-red-700/20"
            >
              Penawaran
            </Link>
          </div>

          {/* Mobile Toggle - Jadi Hitam */}
          <button
            className="md:hidden text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Ikut tema Putih */}
      {isOpen && (
        <div className="fixed inset-0 top-[100px] z-40 bg-white border-t border-slate-100 p-6 md:hidden">
          <div className="flex flex-col gap-6">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                // Teks Mobile jadi hitam
                className="text-xl font-bold text-slate-900 hover:text-red-700"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}