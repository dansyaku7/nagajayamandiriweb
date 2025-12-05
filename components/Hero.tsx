import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    // PERUBAHAN: Ganti min-h-screen jadi tinggi fix biar ga terlalu maksa nge-zoom
    <section className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/ballroom2.jpg"
          alt="Background Pylon Sign"
          fill
          // Tambah object-center biar fokus di tengah
          className="object-cover object-center"
          priority
        />
        {/* Overlay Hitam */}
        <div className="absolute inset-0 bg-black/70 md:bg-black/60" />
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
                <Phone size={20} /> Hubungi Kami
             </Link>

             <Link
                href={siteConfig.portfolio[0].href}
                className="border-2 border-white text-white px-8 py-4 rounded font-bold text-lg hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2"
             >
                Lihat Portfolio <ArrowRight size={20} />
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}