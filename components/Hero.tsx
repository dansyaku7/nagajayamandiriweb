"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useSiteImage } from "@/components/SiteImages";
import { isOptimizable, type SlotId } from "@/config/images";

// Foto tiap slide bisa diganti dari panel admin (tab Foto, grup Hero).
const heroSlides: { slot: SlotId; alt: string; label: string }[] = [
  {
    slot: "hero-1",
    alt: "Portofolio Signage Ballroom dan Huruf Timbul Elegan oleh NJM Advertising Jakarta",
    label: "Ballroom Signage & Huruf Timbul",
  },
  {
    slot: "hero-2",
    alt: "Neon Box LED dan Fasad Usaha Carwash Gogo Jabodetabek - NJM Advertising",
    label: "Neon Box Fasad Toko",
  },
  {
    slot: "hero-3",
    alt: "Pylon Sign dan Plang Nama Usaha Royal Urban oleh NJM Advertising",
    label: "Pylon Sign & Branding Komersial",
  },
  {
    slot: "hero-4",
    alt: "Pemasangan Signage Pos Security dan Reklame Gedung oleh Kontraktor NJM",
    label: "Signage Gedung & Keamanan",
  },
  {
    slot: "hero-5",
    alt: "Signage Outdoor Lapangan Padel Court Tahan Cuaca oleh NJM Advertising",
    label: "Signage Outdoor & Komersial",
  },
  {
    slot: "hero-6",
    alt: "Neon Sign Custom dan Huruf Timbul Akrilik Toko Olse Donut NJM",
    label: "Neon Sign Cafe & Toko Ritel",
  },
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const image = useSiteImage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[640px] md:min-h-[780px] lg:h-[840px] flex items-center justify-center overflow-hidden pt-20 md:pt-16">
      {/* Background Image Slider with Crossfade */}
      <div className="absolute inset-0 w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.slot}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <Image
              src={image(slide.slot)}
              alt={slide.alt}
              fill
              unoptimized={!isOptimizable(image(slide.slot))}
              className="object-cover object-center scale-105 transition-transform duration-10000 ease-linear"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Multi-layer Dark Gradient Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/60 z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 z-2" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-red-600/20 text-red-300 border border-red-500/30 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="tracking-wide uppercase">
              Spesialis Advertising & Signage Jabodetabek
            </span>
          </div>

          {/* Main H1 Heading (Keyword Optimized for SEO) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.12] tracking-tight mb-6">
            Jasa Pembuatan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Neon Box
            </span>{" "}
            &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
              Huruf Timbul
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-slate-200 text-base sm:text-lg md:text-xl mb-8 leading-relaxed font-normal max-w-2xl">
            Wujudkan identitas bisnis Anda lebih prestisius dan menarik
            perhatian. Spesialis pembuatan Pylon Sign, Billboard, Neon Box, dan
            Huruf Timbul langsung dari workshop milik sendiri di Jabodetabek.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href={siteConfig.links.whatsapp}
              target="_blank"
              onClick={() => trackWhatsAppClick("hero_konsultasi")}
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-bold text-base md:text-lg shadow-xl shadow-red-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone size={20} />
              <span>Konsultasi & Survei Gratis</span>
            </Link>

            <Link
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/80 hover:border-white bg-white/5 hover:bg-white text-white hover:text-slate-900 px-8 py-4 rounded-xl font-bold text-base md:text-lg backdrop-blur-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Lihat Portofolio</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Social Proof / Instagram Callout */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
            <span className="text-slate-400">
              Dokumentasi project harian di Instagram:
            </span>
            <Link
              href={siteConfig.links.instagram}
              target="_blank"
              className="inline-flex items-center gap-1.5 font-bold text-white hover:text-red-400 transition-colors bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/10"
            >
              <Instagram size={15} className="text-red-400" />
              <span>@nagajayamandiri</span>
            </Link>
          </div>
        </div>

        {/* Interactive Slide Controls & Thumbnail Label */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/15">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Project Showcased:
            </span>
            <span className="text-xs md:text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-md border border-white/10">
              {heroSlides[currentImage].label}
            </span>
          </div>

          {/* Slide Dots */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Slideshow Project"
          >
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.slot}
                type="button"
                onClick={() => setCurrentImage(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentImage
                    ? "w-8 h-2.5 bg-red-500 shadow-md shadow-red-500/50"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Lihat project slide ${idx + 1}`}
                aria-current={idx === currentImage ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
