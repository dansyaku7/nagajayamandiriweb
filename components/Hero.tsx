"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";

// Array Gambar Background (Diambil dari portfolio)
const heroImages = [
  "/images/ballroom2.jpg",
  "/images/security.jpg",
  "/images/royalurban.jpg",
  "/images/carwashgogo.jpg",
  "/images/padel.jpg",
  "/images/olsedonut.jpg",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  // Logic ganti gambar setiap 6 detik (6000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    // PERUBAHAN: Ganti min-h-screen jadi tinggi fix biar ga terlalu maksa nge-zoom
    <section className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden">

      {/* Background Image Slider */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <Image
              src={src}
              alt={`Background Slide ${index + 1}`}
              fill
              // Tambah object-center biar fokus di tengah
              className="object-cover object-center"
              priority={index === 0} // Load prioritas cuma buat gambar pertama
            />
          </div>
        ))}
        
        {/* Overlay Hitam - Static di atas semua gambar */}
        <div className="absolute inset-0 bg-black/70 md:bg-black/60 z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center md:text-left mt-10 md:mt-0">
        <div className="max-w-3xl">
          <h2 className="text-brand-red font-bold tracking-widest uppercase mb-3 text-sm md:text-lg">
            Professional Advertising Contractor
          </h2>

          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6">
            Wujudkan Identitas <br className="hidden md:block" />
            Bisnis Anda
          </h1>

          <p className="text-slate-200 text-base md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto md:mx-0">
            Kami adalah spesialis pembuatan Pylon Sign, Billboard, dan Neon Box dengan standar kualitas terbaik di Jakarta. Tahan lama, presisi, dan elegan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
             <Link
                href={siteConfig.links.whatsapp}
                className="bg-brand-red text-white px-8 py-4 rounded font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
             >
                <Phone size={20} /> Hubungi Sekarang!
             </Link>

             <Link
                href={siteConfig.portfolio[0].href}
                className="border-2 border-white text-white px-8 py-4 rounded font-bold text-lg hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2"
             >
                Lihat Portfolio <ArrowRight size={20} />
             </Link>
          </div>

          {/* --- NEW: INSTAGRAM LINK SECTION --- */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 text-sm text-slate-300 animate-fade-in">
            <span>Kunjungi Instagram kami</span>
            
            {/* Link Handle IG (Lebih Menonjol) */}
            <Link 
              href={siteConfig.links.instagram} 
              target="_blank"
              className="flex items-center gap-1.5 font-bold text-white hover:text-brand-red transition-colors"
            >
              <Instagram size={18} className="text-brand-red" />
              @nagajayamandiri
            </Link>
            
            {/* Link Alternatif "Klik Disini" (Lebih Subtle) */}
            <span className="hidden md:inline text-slate-500">atau</span>
            <Link 
              href={siteConfig.links.instagram}
              target="_blank"
              className="underline underline-offset-4 decoration-slate-500 hover:text-white hover:decoration-white transition-all"
            >
              klik disini
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}