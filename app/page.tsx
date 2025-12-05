import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import { siteConfig } from "@/config/site";
import { CheckCircle2, MapPin, Instagram, Phone, Lightbulb, Layers, MessageCircle, ArrowUpRight, Star, Quote } from "lucide-react";

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

  // DATA DUMMY TESTIMONI
  const testimonials = [
    {
      name: "Dewi Lestari",
      role: "Manager, Coffee Shop",
      text: "Hasil neon box-nya sangat rapi dan terang. Pengerjaan on-time sesuai janji. Sukses terus buat NJM!",
    },
    {
      name: "Siti Rahayu",
      role: "Manager, Klinik Kecantikan",
      text: "Huruf timbul stainless-nya bikin fasad klinik kami jadi terlihat jauh lebih mewah dan profesional. Recommended!",
    },
    {
      name: "Ahmad Fauzi",
      role: "Staff, Usaha Mobil",
      text: "Pelayanan sangat responsif. Diskusi desain enak, dan hasil akhirnya presisi banget. Bakal order lagi untuk cabang baru.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. ABOUT */}
      <section id="about" className="py-16 md:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* KOLOM KIRI: FOTO OWNER */}
          <div className="relative group">
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl bg-red-700">
               <Image 
                 src="/images/owner.jpg" 
                 alt="Niko Christian - Owner NJM Advertising"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
               <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                   <p className="text-red-400 font-bold uppercase tracking-widest mb-2 text-xs md:text-sm">
                      Founder & Owner
                   </p>
                   <h4 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                      Niko Christian
                   </h4>
                   <div className="border-l-4 border-red-500 pl-4">
                      <p className="text-slate-200 text-sm md:text-base italic font-medium leading-relaxed">
                        "Kualitas dan kepuasan klien adalah prioritas utama kami di workshop ini."
                      </p>
                   </div>
               </div>
            </div>
          </div>

          {/* KOLOM KANAN: TEXT & VISI MISI */}
          <div>
            <h2 className="text-red-700 font-bold uppercase tracking-widest mb-3 text-sm md:text-base">Tentang NJM Advertising</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
              Tentang Kami <br />
            </h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
              NJM Advertising lahir dari semangat untuk membantu bisnis tampil beda. Berbasis di workshop sendiri, kami memastikan setiap potong acrylic dan setiap titik las dikerjakan dengan presisi tinggi oleh tangan-tangan ahli.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
               <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold text-xs md:text-sm">
                  <CheckCircle2 size={16} className="text-red-600" /> Workshop Milik Sendiri
               </div>
               <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold text-xs md:text-sm">
                  <CheckCircle2 size={16} className="text-red-600" /> Pengerjaan Rapi
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="bg-red-100 p-3 h-fit rounded-lg text-red-600">
                     <Lightbulb size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900 mb-1">Visi Kami</h4>
                     <p className="text-slate-600 text-sm">Menjadi partner visual branding nomor 1 di Jabodetabek yang mengutamakan kualitas.</p>
                  </div>
               </div>

               <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="bg-red-100 p-3 h-fit rounded-lg text-red-600">
                     <Layers size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900 mb-1">Misi Kami</h4>
                     <p className="text-slate-600 text-sm">Menghadirkan inovasi material terbaru & pelayanan yang responsif untuk setiap klien.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN */}
      <section id="services" className="py-16 md:py-24 bg-red-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-red-200 font-bold uppercase tracking-widest mb-2 text-sm md:text-base">Produk & Layanan</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Solusi Branding Terlengkap</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-xl border border-transparent shadow-lg hover:shadow-red-900/20 hover:-translate-y-1 transition-all group">
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-700 transition-colors">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO & TESTIMONIALS */}
      <section id="portfolio" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
           {/* Header Portfolio */}
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="text-center md:text-left w-full md:w-auto">
                <h2 className="text-red-700 font-bold uppercase tracking-widest mb-2 text-sm md:text-base">Portofolio</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Project Terbaru</h3>
              </div>
              <p className="text-slate-600 max-w-md text-center md:text-left text-sm md:text-base hidden md:block">
                Kumpulan hasil karya signage dan reklame yang telah terpasang di berbagai lokasi Jabodetabek.
              </p>
           </div>
           
           {/* Grid Foto Project */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
              {portfolioItems.map((item, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 cursor-pointer shadow-sm hover:shadow-xl transition-all">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                      <p className="text-white font-bold text-sm md:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                      </p>
                  </div>
                </div>
              ))}
           </div>

           {/* Instagram Link */}
           <div className="flex justify-center md:justify-end mb-16">
              <div className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-3 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <span className="text-slate-600 font-medium text-sm md:text-base">
                  Untuk melihat project kami lainnya ada di Instagram :
                </span>
                <Link 
                  href={siteConfig.links.instagram} 
                  target="_blank"
                  className="flex items-center gap-2 text-red-700 font-bold text-sm md:text-base hover:text-red-800 hover:underline"
                >
                  <Instagram size={20} />
                  @nagajayamandiri
                  <ArrowUpRight size={16} />
                </Link>
              </div>
           </div>

           {/* --- SEPARATOR GARIS MERAH --- */}
           <div className="relative flex items-center justify-center mb-16">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t-2 border-red-600/20"></div>
              </div>
              <div className="relative bg-white px-6 py-2 border-2 border-red-600/10 rounded-full">
                 <h3 className="text-red-700 font-bold uppercase tracking-widest text-sm">Apa Kata Mereka?</h3>
              </div>
           </div>

           {/* --- TESTIMONIALS SECTION (Kotak Merah, Teks Putih) --- */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testi, idx) => (
                <div key={idx} className="bg-red-700 p-8 rounded-2xl shadow-xl shadow-red-900/10 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                   {/* Background Decor */}
                   <Quote className="absolute top-4 right-4 text-red-600/30 w-16 h-16 rotate-180" />
                   
                   {/* Stars */}
                   <div className="flex gap-1 mb-4 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                   </div>
                   
                   {/* Content */}
                   <p className="text-red-50 text-base italic leading-relaxed mb-6 relative z-10">
                     "{testi.text}"
                   </p>
                   
                   {/* Author */}
                   <div className="mt-auto relative z-10 border-t border-red-600 pt-4">
                      <h4 className="text-white font-bold text-lg">{testi.name}</h4>
                      <p className="text-red-200 text-sm font-medium">{testi.role}</p>
                   </div>
                </div>
              ))}
           </div>

        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section id="cta" className="py-20 md:py-24 bg-red-700">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-5xl font-black text-white mb-6 tracking-tight">
               Siap Melayani Kebutuhan <br className="md:hidden" /> Bisnis Anda
            </h2>
            <p className="text-red-100 max-w-3xl mx-auto mb-10 text-base md:text-xl font-medium leading-relaxed">
               Tidak perlu ragu untuk memilih kami. Pelayanan dan produk terbaik akan kami berikan. 
               Konsultasikan kebutuhan Anda sekarang.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link 
                  href={siteConfig.links.whatsapp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 shadow-xl transition-transform hover:-translate-y-1"
               >
                  <MessageCircle size={24} /> Hubungi Kami
               </Link>
               <Link 
                  href="#footer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-700 transition-colors"
               >
                  Lokasi Workshop
               </Link>
            </div>
         </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="footer" className="bg-white text-slate-600 py-12 md:py-16 border-t border-slate-200">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-b border-slate-200 pb-12 mb-12">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <Image 
                    src="/images/logonjm.png" 
                    alt="Logo Naga Jaya Mandiri" 
                    width={400} 
                    height={120}
                    className="h-14 md:h-25 w-auto object-contain"
                  />
                  <h3 className="text-slate-900 font-black text-2xl tracking-tight">
                    NAGAJAYA<span className="text-red-600">MANDIRI</span>
                  </h3>
               </div>
               <p className="mb-6 text-slate-600 max-w-sm leading-relaxed text-sm md:text-base">
                 Partner terbaik untuk kebutuhan advertising dan signage bisnis Anda. Melayani pembuatan Neon Box, Huruf Timbul, hingga konstruksi Billboard.
               </p>
               <div className="flex gap-4">
                  <Link href={siteConfig.links.instagram} className="bg-slate-100 p-3 rounded-full text-slate-900 hover:bg-red-600 hover:text-white transition-all"><Instagram size={20} /></Link>
                  <Link href={siteConfig.links.whatsapp} className="bg-slate-100 p-3 rounded-full text-slate-900 hover:bg-red-600 hover:text-white transition-all"><Phone size={20} /></Link>
               </div>
            </div>
            
            <div>
               <h3 className="text-slate-900 font-bold text-lg mb-4 md:mb-6">Layanan</h3>
               <ul className="space-y-3 text-sm">
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Neon Box</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Huruf Timbul</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Pylon Sign</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Billboard</Link></li>
               </ul>
            </div>
            
            <div>
               <h3 className="text-slate-900 font-bold text-lg mb-4 md:mb-6">Hubungi Kami</h3>
               <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="shrink-0 text-red-600 mt-1" />
                    <span>Jabodetabek & Sekitarnya</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-red-600" />
                    <span>{siteConfig.contact.phone}</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="container mx-auto px-6 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} NJM Advertising. All rights reserved.
         </div>
      </footer>

      {/* --- FLOATING BUTTONS CONTAINER --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Instagram (Sekunder - Di Atas) */}
        <Link
          href={siteConfig.links.instagram}
          target="_blank"
          aria-label="Kunjungi Instagram"
          className="flex items-center gap-3 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-5 py-3 md:px-6 md:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:scale-105"
        >
          <Instagram size={24} />
          <span className="font-bold text-sm md:text-base">Instagram @njm.advertising</span>
        </Link>

        {/* WhatsApp (Primary - Paling Bawah) */}
        <Link
          href={siteConfig.links.whatsapp}
          target="_blank"
          aria-label="Hubungi WhatsApp"
          className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 md:px-6 md:py-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:-translate-y-1 hover:scale-105"
        >
          <MessageCircle size={28} fill="white" className="text-[#25D366]" />
          <span className="font-bold text-base md:text-lg">Hubungi Sekarang!</span>
        </Link>

      </div>

    </main>
  );
}