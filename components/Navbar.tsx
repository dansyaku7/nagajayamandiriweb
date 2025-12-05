"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full fixed top-0 z-50">
      {/* 1. TOP BAR UPDATED */}
      <div className="bg-black text-slate-300 text-[10px] md:text-xs py-2 px-4 border-b border-slate-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-bold tracking-wide">
              <Phone size={12} className="text-brand-red" /> 
              WHATSAPP: 0851-7414-5007
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-medium">
             <span className="text-slate-500">Melayani Jabodetabek</span>
          </div>
        </div>
      </div>
      
      {/* 2. MAIN NAVBAR (Hitam Slate) */}
      <header className="bg-slate-900 shadow-xl py-4 transition-all">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo (Putih) */}
          <Link href="/" className="font-bold text-2xl tracking-tighter text-white">
            NAGAJAYA<span className="text-brand-red">MANDIRI</span>
          </Link>

          {/* Desktop Menu (Teks Putih) */}
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-slate-300 hover:text-white hover:underline decoration-brand-red decoration-2 underline-offset-4 transition-all uppercase"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
             <button className="text-slate-300 hover:text-white transition-colors">
                <ShoppingCart size={24} />
             </button>
             <Link
              href={siteConfig.links.whatsapp}
              className="bg-brand-red text-white px-5 py-2 rounded text-sm font-bold uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
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
        <div className="fixed inset-0 top-[100px] z-40 bg-slate-900 border-t border-slate-800 p-6 md:hidden">
          <div className="flex flex-col gap-6">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xl font-bold text-white hover:text-brand-red"
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