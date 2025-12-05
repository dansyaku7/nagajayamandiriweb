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
      
      {/* 1. TOP BAR - MERAH (Teks Putih) */}
      <div className="bg-red-700 text-white text-[10px] md:text-xs py-2 px-4 shadow-sm z-50 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-bold tracking-wide">
              <Phone size={12} className="text-white" /> 
              WHATSAPP: 0851-7414-5007
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-medium">
             <span className="text-red-100">Melayani Jabodetabek</span>
          </div>
        </div>
      </div>
      
      {/* 2. MAIN NAVBAR - PUTIH */}
      <header className="bg-white shadow-md py-4 transition-all relative">
        <div className="container mx-auto px-4 flex items-center justify-between relative">
          
          {/* LOGO IMAGE */}
          {/* PERUBAHAN DISINI: 
              - Mobile: absolute left-1/2 (Biar bener-bener di tengah layar HP)
              - Desktop: static (Balik ke flow normal di kiri)
          */}
          <Link 
            href="/" 
            className="flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
          >
            <Image 
              src="/images/logonjm.png" 
              alt="Logo Naga Jaya Mandiri"
              width={400} 
              height={120}
              className="h-12 md:h-20 w-auto object-contain" 
              priority
            />
          </Link>

          {/* Desktop Menu (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-slate-900 hover:text-red-700 hover:underline decoration-red-700 decoration-2 underline-offset-4 transition-all uppercase"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Icons (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4">
             <Link
              href={siteConfig.links.whatsapp}
              className="bg-red-700 text-white px-5 py-2 rounded text-sm font-bold uppercase hover:bg-red-800 transition-all shadow-lg shadow-red-700/20"
            >
              Penawaran
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          {/* Tambah 'ml-auto' biar dia maksa geser ke kanan karena logonya udah 'absolute' */}
          <button
            className="md:hidden text-slate-900 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[100px] z-40 bg-white border-t border-slate-100 p-6 md:hidden">
          <div className="flex flex-col gap-6">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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