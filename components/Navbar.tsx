"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full fixed top-0 z-50">
      
      {/* 1. TOP BAR - MODIFIED: Background Putih, Teks Hitam */}
      {/* Gue ganti border-slate-800 jadi border-slate-200 biar garis pembatasnya halus di background putih */}
      <div className="bg-white text-slate-900 text-[10px] md:text-xs py-2 px-4 border-b border-slate-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-bold tracking-wide">
              {/* Icon merah di atas putih = Kontras Tajam (Good) */}
              <Phone size={12} className="text-red-600" /> 
              WHATSAPP: 0851-7414-5007
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-medium">
             {/* Teks secondary gue gelapin dikit biar kebaca di background putih */}
             <span className="text-slate-600">Melayani Jabodetabek</span>
          </div>
        </div>
      </div>
      
      {/* 2. MAIN NAVBAR (Tetap Merah) */}
      <header className="bg-red-700 shadow-xl py-4 transition-all">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl tracking-tighter text-white">
            NAGAJAYA<span className="text-white">MANDIRI</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-red-100 hover:text-white hover:underline decoration-white decoration-2 underline-offset-4 transition-all uppercase"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
             <Link
              href={siteConfig.links.whatsapp}
              className="bg-white text-red-700 px-5 py-2 rounded text-sm font-bold uppercase hover:bg-slate-100 transition-all shadow-lg shadow-black/20"
            >
              Penawaran
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[100px] z-40 bg-red-800 border-t border-red-600 p-6 md:hidden">
          <div className="flex flex-col gap-6">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xl font-bold text-white hover:text-red-200"
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