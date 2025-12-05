import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import { siteConfig } from "@/config/site";
import { CheckCircle2, MapPin, Instagram, Phone, Lightbulb, Layers, MessageCircle } from "lucide-react";

export default function Home() {
  const portfolioItems = [
    { src: "/images/angkasakarya.jpg", title: "Angkasa Karya" },
    { src: "/images/ballroom2.jpg", title: "Ballroom Signage" },
    { src: "/images/banteng.jpg", title: "Project Banteng" },
    { src: "/images/carwashgogo.jpg", title: "Carwash Gogo" },
    { src: "/images/centralindonusamedika.jpg", title: "Central Indo Medika" },
    { src: "/images/citrasehatreflexology.jpg", title: "Citra Sehat" },
    { src: "/images/lumiclinic.jpg", title: "Lumi Clinic" },
    { src: "/images/manleyburgerax.jpg", title: "Manley Burger" },
    { src: "/images/olsedonut.jpg", title: "Olse Donut" },
    { src: "/images/padel.jpg", title: "Padel Court" },
    { src: "/images/pesonamobil.jpg", title: "Pesona Mobil" },
    { src: "/images/PTDIAN.jpg", title: "PT Dian Project" },
  ];

  const products = [
    { title: "Neonbox", desc: "Media promosi menyala visual kuat untuk siang & malam." },
    { title: "Huruf Timbul", desc: "Acrylic, Stainless, Galvanis, LED, & Acrylic LED." },
    { title: "Pylon / Totem Sign", desc: "Penanda identitas bisnis yang kokoh dan elegan." },
    { title: "Billboard & Videotron", desc: "Media iklan skala besar untuk eksposur maksimal." },
    { title: "Neon Sign Custom", desc: "Lampu artistik custom untuk cafe & interior." },
    { title: "Shop Signage", desc: "Branding toko & storefront lettering profesional." },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      
      {/* 1. HERO SECTION (Home) */}
      <Hero />

      {/* 2. ABOUT (Gua tetep kasih id="about" buat jaga-jaga) */}
      <section id="about" className="py-16 md:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-brand-red font-bold uppercase tracking-widest mb-2 text-sm md:text-base">Tentang NJM Advertising</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Membangun Identitas Visual Bisnis Anda</h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
              Kami adalah penyedia layanan pembuatan media promosi visual yang berfokus pada neonbox, huruf timbul, dan signage profesional. 
              Kami membantu UMKM, brand, hingga korporasi membangun identitas visual yang kuat dengan standar produksi modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-slate-800 font-medium">
               <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" /> Presisi</div>
               <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" /> Estetik</div>
               <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" /> Tahan Lama</div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm mt-6 md:mt-0">
             <div className="mb-6">
                <h4 className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-2">
                   <Lightbulb className="text-brand-red" /> Visi
                </h4>
                <p className="text-slate-600 text-sm md:text-base">Menjadi penyedia solusi media promosi visual terpercaya dan berkualitas di Jabodetabek.</p>
             </div>
             <div>
                <h4 className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-2">
                   <Layers className="text-brand-red" /> Misi
                </h4>
                <ul className="space-y-2 text-slate-600 text-sm md:text-base">
                   <li className="flex gap-2"><span>•</span> Memberikan hasil produk signage yang presisi & estetik.</li>
                   <li className="flex gap-2"><span>•</span> Pelayanan cepat, profesional, dan responsif.</li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN (Target: #services) */}
      <section id="services" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-brand-red font-bold uppercase tracking-widest mb-2 text-sm md:text-base">Produk & Layanan</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Solusi Branding Terlengkap</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-xl border border-transparent shadow-lg hover:shadow-brand-red/20 hover:border-brand-red/50 transition-all group">
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-red transition-colors">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO */}
      <section id="portfolio" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="text-center md:text-left w-full md:w-auto">
                <h2 className="text-brand-red font-bold uppercase tracking-widest mb-2 text-sm md:text-base">Portofolio</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Project Terbaru</h3>
              </div>
              <p className="text-slate-600 max-w-md text-center md:text-left text-sm md:text-base hidden md:block">
                Kumpulan hasil karya signage dan reklame yang telah terpasang di berbagai lokasi Jabodetabek.
              </p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {portfolioItems.map((item, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 cursor-pointer shadow-sm hover:shadow-xl transition-all">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                     <p className="text-white font-bold text-sm md:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                     </p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. CTA SECTION (Target: #cta) */}
      {/* Ini yang lo minta buat link "Kontak" */}
      <section id="cta" className="py-20 md:py-24 bg-slate-900">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-5xl font-black text-white mb-6 tracking-tight">
               Siap Melayani Kebutuhan <br className="md:hidden" /> Bisnis Anda
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto mb-10 text-base md:text-xl font-medium leading-relaxed">
               Tidak perlu ragu untuk memilih kami. Pelayanan dan produk terbaik akan kami berikan. 
               Konsultasikan kebutuhan Anda sekarang.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link 
                  href={siteConfig.links.whatsapp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 shadow-xl transition-transform hover:-translate-y-1"
               >
                  <MessageCircle size={24} /> Hubungi Kami
               </Link>
               <Link 
                  href="#footer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-colors"
               >
                  Lokasi Workshop
               </Link>
            </div>
         </div>
      </section>

      {/* 6. FOOTER (Target: #footer) */}
      {/* Ini yang lo minta buat link "Tentang Kami" */}
      <footer id="footer" className="bg-white text-slate-600 py-12 md:py-16 border-t border-slate-200">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-b border-slate-200 pb-12 mb-12">
            <div className="md:col-span-2">
               <h3 className="text-slate-900 font-black text-2xl mb-6 tracking-tight">NAGAJAYA<span className="text-brand-red">MANDIRI</span></h3>
               <p className="mb-6 text-slate-600 max-w-sm leading-relaxed text-sm md:text-base">
                  Partner terbaik untuk kebutuhan advertising dan signage bisnis Anda. Melayani pembuatan Neon Box, Huruf Timbul, hingga konstruksi Billboard.
               </p>
               <div className="flex gap-4">
                  <Link href={siteConfig.links.instagram} className="bg-slate-100 p-3 rounded-full text-slate-900 hover:bg-brand-red hover:text-white transition-all"><Instagram size={20} /></Link>
                  <Link href={siteConfig.links.whatsapp} className="bg-slate-100 p-3 rounded-full text-slate-900 hover:bg-brand-red hover:text-white transition-all"><Phone size={20} /></Link>
               </div>
            </div>
            
            <div>
               <h3 className="text-slate-900 font-bold text-lg mb-4 md:mb-6">Layanan</h3>
               <ul className="space-y-3 text-sm">
                  <li><Link href="#" className="hover:text-brand-red transition-colors">Neon Box</Link></li>
                  <li><Link href="#" className="hover:text-brand-red transition-colors">Huruf Timbul</Link></li>
                  <li><Link href="#" className="hover:text-brand-red transition-colors">Pylon Sign</Link></li>
                  <li><Link href="#" className="hover:text-brand-red transition-colors">Billboard</Link></li>
               </ul>
            </div>
            
            <div>
               <h3 className="text-slate-900 font-bold text-lg mb-4 md:mb-6">Hubungi Kami</h3>
               <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="shrink-0 text-brand-red mt-1" />
                    <span>Jabodetabek & Sekitarnya</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-brand-red" />
                    <span>{siteConfig.contact.phone}</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="container mx-auto px-6 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} NJM Advertising. All rights reserved.
         </div>
      </footer>
    </main>
  );
}