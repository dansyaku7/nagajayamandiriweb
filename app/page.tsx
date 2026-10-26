"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import { siteConfig } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";
import {
  CheckCircle2,
  MapPin,
  Instagram,
  Lightbulb,
  Layers,
  ArrowUpRight,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Wrench,
  Sparkles,
  Building2,
  Tv,
  Store,
  Box,
  HelpCircle,
  ChevronDown,
  Clock,
  Award,
  Check,
  Calculator,
  X,
  Maximize2,
} from "lucide-react";

export default function Home() {
  const portfolioItems = [
    {
      src: "/images/angkasakarya.jpg",
      title: "Angkasa Karya",
      category: "Komersial",
      tag: "Signage Fasad",
      alt: "Pengerjaan Signage Fasad Komersial Angkasa Karya oleh NJM Advertising",
    },
    {
      src: "/images/ballroom2.jpg",
      title: "Ballroom Signage",
      category: "Huruf Timbul",
      tag: "Stainless Gold",
      alt: "Pemasangan Huruf Timbul Ballroom Signage Mewah Berbahan Stainless Gold",
    },
    {
      src: "/images/banteng.jpg",
      title: "Project Banteng",
      category: "Neon Box",
      tag: "Outdoor Sign",
      alt: "Konstruksi Neon Box dan Signage Komersial Project Banteng Jabodetabek",
    },
    {
      src: "/images/carwashgogo.jpg",
      title: "Carwash Gogo",
      category: "Neon Box",
      tag: "Acrylic LED",
      alt: "Pembuatan Neon Box LED dan Fascia Carwash Gogo oleh NJM Advertising",
    },
    {
      src: "/images/centralindonusamedika.jpg",
      title: "Central Indo Medika",
      category: "Huruf Timbul",
      tag: "Klinik Medis",
      alt: "Huruf Timbul Stainless Backlight Central Indo Medika",
    },
    {
      src: "/images/citrasehatreflexology.jpg",
      title: "Citra Sehat",
      category: "Komersial",
      tag: "Signage Outdoor",
      alt: "Signage Outdoor Neon Box Citra Sehat Reflexology",
    },
    {
      src: "/images/lumiclinic.jpg",
      title: "Lumi Clinic",
      category: "Huruf Timbul",
      tag: "Akrilik Presisi",
      alt: "Huruf Timbul Akrilik LED Lumi Clinic oleh NJM Advertising",
    },
    {
      src: "/images/manleyburgerax.jpg",
      title: "Manley Burger",
      category: "Neon Box",
      tag: "Resto & F&B",
      alt: "Neon Box Restoran Manley Burger dengan Pencahayaan Merata",
    },
    {
      src: "/images/olsedonut.jpg",
      title: "Olse Donut",
      category: "Huruf Timbul",
      tag: "Neon Sign & Toko",
      alt: "Signage Toko Donut Olse Donut Huruf Timbul LED",
    },
    {
      src: "/images/padel.jpg",
      title: "Padel Court",
      category: "Komersial",
      tag: "Pylon & Lapangan",
      alt: "Signage Outdoor Lapangan Olahraga Padel Court Jabodetabek",
    },
    {
      src: "/images/pesonamobil.jpg",
      title: "Pesona Mobil",
      category: "Neon Box",
      tag: "Showroom Otomotif",
      alt: "Pylon Sign dan Plang Nama Showroom Pesona Mobil",
    },
    {
      src: "/images/PTDIAN.jpg",
      title: "PT Dian Project",
      category: "Komersial",
      tag: "Signage Kantor",
      alt: "Huruf Timbul Kantor PT Dian Project oleh Workshop NJM",
    },
  ];

  const products = [
    {
      title: "Neonbox",
      desc: "Media promosi menyala visual kuat untuk siang & malam.",
      icon: Box,
      features: "Acrylic Marga Cipta • Backlite Korea • LED Hemat Energi",
      badge: "Paling Populer",
    },
    {
      title: "Huruf Timbul",
      desc: "Acrylic, Stainless, Galvanis, LED, & Acrylic LED.",
      icon: Layers,
      features:
        "Stainless 304 Anti Karat • Laser Cut Presisi • Pilihan Backlight",
      badge: "Best Seller",
    },
    {
      title: "Pylon / Totem Sign",
      desc: "Penanda identitas bisnis yang kokoh dan elegan.",
      icon: Building2,
      features: "Konstruksi Pipa Besi Kokoh • ACP Outdoor Grade • Pondasi Kuat",
      badge: "Megah & Kokoh",
    },
    {
      title: "Billboard & Videotron",
      desc: "Media iklan skala besar untuk eksposur maksimal.",
      icon: Tv,
      features:
        "Struktur Baja Standar PU • Perizinan Lengkap • Visibilitas Tinggi",
      badge: "Skala Besar",
    },
    {
      title: "Neon Sign Custom",
      desc: "Lampu artistik custom untuk cafe & interior.",
      icon: Sparkles,
      features:
        "Silicone Neon Flex • Bebas Desain Huruf/Logo • Estetik & Terang",
      badge: "Tren Cafe",
    },
    {
      title: "Shop Signage",
      desc: "Branding toko & storefront lettering profesional.",
      icon: Store,
      features: "Fascia Toko Ritel • Tahan Cuaca Ekstrem • Instalasi Cepat",
      badge: "Bisnis Ritel",
    },
  ];

  // DATA DUMMY TESTIMONI (Data asli dipertahankan 100%)
  const testimonials = [
    {
      name: "Dewi Sari",
      role: "Manager, Coffee Shop",
      text: "Hasil neon box-nya sangat rapi dan terang. Pengerjaan on-time sesuai janji. Sukses terus buat NJM!",
      initials: "DS",
    },
    {
      name: "Siti Rahayu",
      role: "Manager, Klinik Kecantikan",
      text: "Huruf timbul stainless-nya bikin fasad klinik kami jadi terlihat jauh lebih mewah dan profesional. Recommended!",
      initials: "SR",
    },
    {
      name: "Ahmad Fauzi",
      role: "Pekerja, Usaha Mobil",
      text: "Pelayanan sangat responsif. Diskusi desain enak, dan hasil akhirnya presisi banget. Bakal order lagi untuk cabang baru.",
      initials: "AF",
    },
  ];

  // DATA FAQ UNTUK SEO & RICH SNIPPETS
  const faqs = [
    {
      q: "Berapa lama proses pembuatan neon box atau huruf timbul di NJM?",
      a: "Waktu pengerjaan umumnya memakan waktu 4 hingga 10 hari kerja tergantung dimensi, kompleksitas desain, dan ketersediaan material. Untuk kebutuhan mendesak (*urgent project*), silakan konsultasikan langsung dengan tim kami via WhatsApp.",
    },
    {
      q: "Apakah NJM Advertising melayani survei lokasi dan pengukuran langsung?",
      a: "Ya! Kami melayani survei langsung ke lokasi Anda di wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi (Jabodetabek) untuk mengukur bidang pasang, mengecek jalur listrik, dan menentukan jenis material yang paling tepat.",
    },
    {
      q: "Material apa saja yang digunakan untuk huruf timbul dan signage?",
      a: "Kami menggunakan bahan standar industri terbaik, seperti Stainless Steel 304 anti karat, Plat Galvanis cat oven/powder coating, Acrylic Marga Cipta original, modul LED Samsung/Epistar tahan air (waterproof IP65/IP67), serta trafo/power supply bergaransi.",
    },
    {
      q: "Bagaimana jika saya belum memiliki file desain?",
      a: "Jangan khawatir! Tim desainer kami siap membantu membuatkan simulasi desain 2D/3D mockup penempatan signage pada foto gedung/toko Anda secara gratis sebelum proses produksi dimulai.",
    },
    {
      q: "Apakah produk signage dari NJM bergaransi?",
      a: "Tentu. Setiap pembuatan signage di NJM dilengkapi dengan garansi pemasangan, konstruksi fisik, serta garansi kelistrikan (lampu LED dan power supply/trafo).",
    },
  ];

  // ESTIMASI HARGA & SPESIFIKASI UNTUK DOMINASI SEO KOMERSIAL
  const pricingEstimates = [
    {
      name: "Neon Box Acrylic LED",
      badge: "Paling Diminati",
      price: "Mulai Rp 2.500.000",
      unit: "per meter persegi (m²)",
      desc: "Solusi plang nama toko, apotek, klinik, dan ruko dengan visual menyala terang merata.",
      specs: [
        "Akrilik Marga Cipta 3mm Solid / Milky",
        "Visual Cutting Sticker Oracal / Print UV Tahan Pudar",
        "Rangka Besi Hollow Galvanis Anti Karat",
        "Lampu LED Modul Samsung Waterproof IP68",
        "Trafo Rainproof Bergaransi Resmi",
      ],
      waMessage:
        "Halo NJM Advertising, saya ingin tanya estimasi harga Neon Box Acrylic LED",
    },
    {
      name: "Huruf Timbul Stainless 304",
      badge: "Kesan Mewah & Eksklusif",
      price: "Mulai Rp 20.000",
      unit: "per centimeter",
      desc: "Standar hotel, kantor korporat, showroom, dan instansi. Tahan karat puluhan tahun di outdoor.",
      specs: [
        "Plat Stainless Steel 304 Mirror / Hairline",
        "Ketebalan Plat 0.8mm - 1.2mm",
        "Teknik Potong Laser Fiber Presisi Tinggi",
        "Spon / Baut Tanam Stainless Kokoh",
        "Opsi Backlight LED Menyala Belakang",
      ],
      waMessage:
        "Halo NJM Advertising, saya ingin tanya estimasi harga Huruf Timbul Stainless 304",
    },
    {
      name: "Huruf Timbul Acrylic LED",
      badge: "Best Seller Komersial",
      price: "Mulai Rp 20.000",
      unit: "per centimeter",
      desc: "Menyala penuh dari depan atau samping, warna visual cerah siang dan malam untuk outlet ritel.",
      specs: [
        "Muka Akrilik Marga Cipta Tebal 3mm",
        "Samping Plat Stainless / Akrilik",
        "Modul LED Samsung Ultra-Bright 1.5W",
        "Finishing Rapi Tanpa Bocor Cahaya",
        "Garansi Instalasi & Kelistrikan",
      ],
      waMessage:
        "Halo NJM Advertising, saya ingin tanya estimasi harga Huruf Timbul Acrylic LED",
    },
    {
      name: "Pylon Sign / Totem Sign",
      badge: "Megah & Landmark Gedung",
      price: "Mulai Rp 3.500.000",
      unit: "per meter tinggi / m²",
      desc: "Penanda identitas megah pinggir jalan raya untuk SPBU, rumah sakit, mall, dan gedung perkantoran.",
      specs: [
        "Rangka Pipa Seamless & Konstruksi Baja WF",
        "Cover Aluminium Composite Panel (ACP) Seven",
        "Pondasi Cor Beton Cakar Ayam Standar PU",
        "Kombinasi Huruf Timbul Akrilik LED & Logo",
        "Perhitungan Beban Angin & Keamanan",
      ],
      waMessage:
        "Halo NJM Advertising, saya ingin tanya estimasi harga Pylon Sign Gedung",
    },
  ];

  // 5 TAHAPAN WORKFLOW PROFESIONAL
  const workflowSteps = [
    {
      step: "01",
      title: "Konsultasi & Estimasi Cepat",
      desc: "Sampaikan ukuran, foto lokasi, atau contoh konsep signage via WhatsApp. Tim kami segera menghitungkan estimasi RAB transparan dalam hitungan jam.",
    },
    {
      step: "02",
      title: "Survei Lokasi & Pengukuran",
      desc: "Teknisi NJM mendatangi lokasi Anda di Jabodetabek untuk mengukur bidang pasang, mengecek jalur listrik, dan memastikan kekuatan struktur gedung.",
    },
    {
      step: "03",
      title: "Simulasi Mockup Desain 2D/3D",
      desc: "Kami buatkan visualisasi penempatan signage di fasad gedung/toko Anda agar Anda mendapatkan gambaran riil sebelum masuk proses produksi.",
    },
    {
      step: "04",
      title: "Fabrikasi Presisi di Workshop",
      desc: "Pengerjaan diproses langsung di workshop milik sendiri menggunakan mesin laser cutting, pemotongan presisi, dan perakitan lampu LED berkualitas.",
    },
    {
      step: "05",
      title: "Pemasangan Rapi & Serah Garansi",
      desc: "Instalasi dilakukan oleh teknisi berpengalaman dengan standar keamanan tinggi. Selesai pasang, Anda menerima garansi resmi konstruksi & kelistrikan.",
    },
  ];

  // CAKUPAN WILAYAH LAYANAN (LOCAL SEO CITATIONS)
  const serviceAreas = [
    {
      city: "Jakarta Barat",
      coverage:
        "Kebon Jeruk, Puri Indah, Cengkareng, Tanjung Duren, Daan Mogot, Meruya, Kembangan, Palmerah",
    },
    {
      city: "Jakarta Selatan",
      coverage:
        "Senopati, Kemang, TB Simatupang, Pondok Indah, Blok M, Tebet, Cilandak, Fatmawati, Kuningan",
    },
    {
      city: "Jakarta Pusat & Utara",
      coverage:
        "Sudirman, Thamrin, Menteng, Tanah Abang, Kelapa Gading, PIK (Pantai Indah Kapuk), Sunter, Pluit",
    },
    {
      city: "Tangerang & Tangsel",
      coverage:
        "BSD City, Gading Serpong, Alam Sutera, Bintaro Jaya, Ciputat, Pamulang, Karawaci, Cikokol",
    },
    {
      city: "Bekasi & Cikarang",
      coverage:
        "Summarecon Bekasi, Bekasi Barat, Bekasi Timur, Galaxy, Harapan Indah, Jababeka Cikarang",
    },
    {
      city: "Depok & Bogor",
      coverage:
        "Margonda, Cinere, Sawangan, Cibubur, Sentul City, Cibinong, Pajajaran Bogor Kota",
    },
  ];

  // LOGIC SLIDER OWNER
  const [currentOwnerIndex, setCurrentOwnerIndex] = useState(0);
  const ownerImages = [
    {
      src: "/images/owner.jpg",
      alt: "Niko Christian Founder NJM Advertising di Workshop Fabrikasi",
    },
    {
      src: "/images/owner12.jpg",
      alt: "Niko Christian Memantau Kualitas Pembuatan Huruf Timbul",
    },
    {
      src: "/images/owner2.jpg",
      alt: "Niko Christian Pemilik Workshop NJM Advertising Jabodetabek",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOwnerIndex((prev) => (prev + 1) % ownerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ownerImages.length]);

  const nextOwner = () => {
    setCurrentOwnerIndex((prev) => (prev + 1) % ownerImages.length);
  };

  const prevOwner = () => {
    setCurrentOwnerIndex(
      (prev) => (prev - 1 + ownerImages.length) % ownerImages.length,
    );
  };

  // Filter Kategori Portofolio
  const [activeCategory, setActiveCategory] = useState("Semua");
  const filteredPortfolio =
    activeCategory === "Semua"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Lightbox Modal State untuk Portofolio
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Navigasi Keyboard: Escape untuk tutup, panah kiri/kanan untuk navigasi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredPortfolio.length : null,
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredPortfolio.length) % filteredPortfolio.length
            : null,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredPortfolio.length]);

  // Lock scroll layar background saat modal terbuka
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. VALUE PROPOSITION / TRUST BAR (SEO & TRUST SIGNAL) */}
      <section className="bg-slate-900 text-white py-8 border-y border-slate-800 shadow-inner">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
                <Wrench size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base text-white">
                  Workshop Sendiri
                </h4>
                <p className="text-xs text-slate-400">
                  Bukan makelar, harga tangan pertama
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base text-white">
                  100% Bergaransi
                </h4>
                <p className="text-xs text-slate-400">
                  Garansi lampu LED, trafo & pasang
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base text-white">
                  Bahan Berkualitas
                </h4>
                <p className="text-xs text-slate-400">
                  Stainless 304 & Acrylic grade A
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base text-white">
                  Gratis Survei
                </h4>
                <p className="text-xs text-slate-400">
                  Area Jakarta, Bogor, Depok, Tangerang, Bekasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-20 md:py-28 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* KOLOM KIRI: FOTO OWNER SLIDER */}
          <div className="relative group select-none">
            <div className="relative h-[480px] md:h-[540px] w-full overflow-hidden rounded-3xl shadow-2xl bg-slate-900 border border-slate-200">
              {/* SLIDER IMAGES */}
              {ownerImages.map((item, index) => (
                <div
                  key={item.src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentOwnerIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))}

              {/* NAVIGATION BUTTONS */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-40 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={prevOwner}
                  className="bg-black/50 text-white p-2.5 rounded-full hover:bg-red-600 backdrop-blur-md transition-all hover:scale-110"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={nextOwner}
                  className="bg-black/50 text-white p-2.5 rounded-full hover:bg-red-600 backdrop-blur-md transition-all hover:scale-110"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95 z-20" />

              {/* OWNER BIO CARD */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 z-30">
                <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  Founder & Owner
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                  Niko Christian
                </h3>
                <div className="border-l-4 border-red-500 pl-4 bg-white/5 backdrop-blur-xs py-2 rounded-r-lg">
                  <p className="text-slate-200 text-sm md:text-base italic font-medium leading-relaxed">
                    &ldquo;Kualitas dan kepuasan klien adalah prioritas utama
                    kami di workshop ini.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: STORY & VALUE */}
          <div>
            <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest mb-3 text-xs md:text-sm">
              <span className="w-8 h-0.5 bg-red-600 inline-block" />
              Tentang NJM Advertising
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.2] tracking-tight">
              Dedikasi Tinggi untuk{" "}
              <span className="text-red-700">Visual Branding</span> Bisnis Anda
            </h2>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
              NJM Advertising lahir dari semangat untuk membantu bisnis tampil
              beda. Berbasis di workshop sendiri, kami memastikan setiap potong
              acrylic dan setiap titik las dikerjakan dengan presisi tinggi oleh
              tangan-tangan ahli.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 text-red-800 font-bold text-xs md:text-sm">
                <CheckCircle2 size={16} className="text-red-600" />
                Workshop Milik Sendiri
              </div>
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 text-red-800 font-bold text-xs md:text-sm">
                <CheckCircle2 size={16} className="text-red-600" />
                Pengerjaan Rapi & Presisi
              </div>
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 text-red-800 font-bold text-xs md:text-sm">
                <CheckCircle2 size={16} className="text-red-600" />
                Standar Material Industri
              </div>
            </div>

            {/* Visi & Misi */}
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 transition-colors">
                <div className="bg-red-100 p-3 h-fit rounded-xl text-red-600 shrink-0">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">
                    Visi Kami
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Menjadi partner visual branding nomor 1 di Jabodetabek yang
                    mengutamakan kualitas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 transition-colors">
                <div className="bg-red-100 p-3 h-fit rounded-xl text-red-600 shrink-0">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">
                    Misi Kami
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Menghadirkan inovasi material terbaru & pelayanan yang
                    responsif untuk setiap klien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUK & LAYANAN SECTION */}
      <section
        id="services"
        className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden"
      >
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Produk & Layanan
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Solusi Visual Branding Terlengkap
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Dikerjakan langsung di workshop sendiri dengan kontrol mutu ketat,
              material bersertifikat, dan instalasi profesional di Jabodetabek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((item) => {
              const IconComp = item.icon;
              const waProductLink = `https://wa.me/6285174145007?text=Halo%20NJM%20Advertising,%20saya%20mau%20konsultasi%20pembuatan%20${encodeURIComponent(
                item.title,
              )}`;
              return (
                <div
                  key={item.title}
                  className="bg-slate-900/90 border border-slate-800 hover:border-red-500/50 p-7 md:p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/50 flex flex-col group relative"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <IconComp size={28} />
                    </div>
                    <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-800/80">
                    <p className="text-xs text-slate-400 mb-4 font-medium">
                      {item.features}
                    </p>
                    <Link
                      href={waProductLink}
                      target="_blank"
                      onClick={() =>
                        trackWhatsAppClick(`service_${item.title}`)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300 hover:underline uppercase tracking-wider"
                    >
                      <span>Konsultasi Produk Ini</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ESTIMASI HARGA & SPESIFIKASI MATERIAL (TARGET SEO: HARGA NEON BOX PER METER) */}
      <section
        id="pricing"
        className="py-20 md:py-28 bg-white border-b border-slate-200"
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-3">
              <Calculator size={16} />
              Transparansi Biaya & Mutu Bahan
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Estimasi Harga Neon Box & Huruf Timbul
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Dapatkan harga langsung dari workshop tangan pertama tanpa
              perantara. Setiap unit diproduksi dengan material berkualitas
              tinggi dan bergaransi resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {pricingEstimates.map((plan) => (
              <div
                key={plan.name}
                className="bg-slate-50 border border-slate-200 hover:border-red-500 rounded-3xl p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
              >
                <div>
                  <div className="inline-block bg-red-100 text-red-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                    {plan.badge}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    {plan.desc}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <span className="text-2xl lg:text-3xl font-black text-red-700">
                      {plan.price}
                    </span>
                    <span className="block text-xs font-semibold text-slate-500 mt-1">
                      {plan.unit}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Spesifikasi Standar:
                    </span>
                    {plan.specs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-2.5 text-xs text-slate-600"
                      >
                        <Check
                          size={15}
                          className="text-red-600 shrink-0 mt-0.5"
                        />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`https://wa.me/6285174145007?text=${encodeURIComponent(plan.waMessage)}`}
                  target="_blank"
                  onClick={() => trackWhatsAppClick(`pricing_${plan.name}`)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-red-700 text-slate-800 hover:text-white border border-slate-300 hover:border-red-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
                >
                  <span>Minta Rincian Biaya</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-3xl mx-auto">
            <p className="text-xs md:text-sm text-red-900 font-medium leading-relaxed">
              <span className="font-bold">Catatan:</span> Harga di atas
              merupakan estimasi dasar. Biaya akhir disesuaikan dengan dimensi
              presisi, tingkat kerumitan font/logo, jenis modul LED, dan tingkat
              kesulitan akses pemasangan di lokasi Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 6. ALUR KERJA PROFESIONAL (5 TAHAPAN) */}
      <section className="py-20 md:py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-red-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">
              Alur Kerja Terstruktur
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              5 Langkah Mudah Pesan Signage di NJM
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Dari konsultasi awal hingga pemasangan selesai, proses kami
              transparan dan profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step) => (
              <div
                key={step.step}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative group hover:border-red-500/50 transition-colors"
              >
                <div className="text-4xl font-black text-red-500/40 group-hover:text-red-500 transition-colors mb-4 font-mono">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO & REKLAME SECTION */}
      <section
        id="portfolio"
        className="py-20 md:py-28 bg-slate-50 border-b border-slate-200"
      >
        <div className="container mx-auto px-6">
          {/* Header Portfolio */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">
                Galeri Hasil Produksi
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Project Signage Terbaru
              </h2>
            </div>
            <p className="text-slate-600 max-w-md text-sm md:text-base leading-relaxed">
              Kumpulan hasil karya signage dan reklame yang telah terpasang di
              berbagai lokasi bisnis & komersial se-Jabodetabek.
            </p>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {["Semua", "Neon Box", "Huruf Timbul", "Komersial"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-red-700 text-white shadow-md shadow-red-700/20"
                    : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                }`}
              >
                {cat === "Semua" ? "Semua Project (12)" : cat}
              </button>
            ))}
          </div>

          {/* Grid Foto Project */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {filteredPortfolio.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                aria-label={`Buka detail foto project ${item.title}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Hover Quick Zoom Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg z-10">
                  <Maximize2 size={15} />
                </div>

                {/* Hover Gradient Overlay & Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-5">
                  <span className="text-[10px] md:text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                    {item.tag}
                  </span>
                  <h3 className="text-white font-bold text-sm md:text-base tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                    <MapPin size={12} className="text-red-400" />
                    <span>Jabodetabek • Klik perbesar</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* POPUP LIGHTBOX MODAL (SMOOTH FULLSCREEN PREVIEW) */}
          {lightboxIndex !== null && filteredPortfolio[lightboxIndex] && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Detail Foto ${filteredPortfolio[lightboxIndex].title}`}
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-slate-950/90 backdrop-blur-md transition-all animate-in fade-in duration-300"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Card Container */}
              <div
                className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Modal */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800 text-white z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">
                      {filteredPortfolio[lightboxIndex].tag}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {lightboxIndex + 1} / {filteredPortfolio.length} Project
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    aria-label="Tutup preview"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Main Large Image Container */}
                <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                  <Image
                    src={filteredPortfolio[lightboxIndex].src}
                    alt={filteredPortfolio[lightboxIndex].alt}
                    fill
                    className="object-contain transition-all duration-300"
                    sizes="(max-width: 1024px) 100vw, 85vw"
                    priority
                  />

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev !== null
                          ? (prev - 1 + filteredPortfolio.length) %
                            filteredPortfolio.length
                          : null,
                      );
                    }}
                    className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all hover:scale-110 shadow-xl cursor-pointer"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev !== null
                          ? (prev + 1) % filteredPortfolio.length
                          : null,
                      );
                    }}
                    className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all hover:scale-110 shadow-xl cursor-pointer"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Footer Modal dengan Info & CTA WhatsApp */}
                <div className="px-6 py-4 md:py-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                      {filteredPortfolio[lightboxIndex].title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400">
                      Kategori: {filteredPortfolio[lightboxIndex].category} •
                      Fabrikasi & Pemasangan oleh NJM Advertising
                    </p>
                  </div>

                  <Link
                    href={`https://wa.me/6285174145007?text=${encodeURIComponent(
                      `Halo NJM Advertising, saya tertarik dengan pembuatan signage seperti project: ${filteredPortfolio[lightboxIndex].title}`,
                    )}`}
                    target="_blank"
                    onClick={() =>
                      trackWhatsAppClick(
                        `lightbox_${filteredPortfolio[lightboxIndex].title}`,
                      )
                    }
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0"
                  >
                    <span>Konsultasi Model Ini</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Instagram Banner Callout */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-20">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0 hidden sm:block">
                <Instagram size={32} />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-slate-900">
                  Ingin melihat lebih banyak dokumentasi proses workshop &
                  pemasangan?
                </h4>
                <p className="text-xs md:text-sm text-slate-500">
                  Update foto & video project harian kami bagikan secara berkala
                  di Instagram.
                </p>
              </div>
            </div>

            <Link
              href={siteConfig.links.instagram}
              target="_blank"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all shrink-0"
            >
              <Instagram size={18} />
              <span>Follow @nagajayamandiri</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Section Divider */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-slate-50 px-6 py-2 border border-slate-200 rounded-full">
              <span className="text-red-700 font-bold uppercase tracking-widest text-xs">
                Kepuasan Pelanggan
              </span>
            </div>
          </div>

          {/* 6. TESTIMONIALS SECTION */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Apa Kata Klien Kami?
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Testimoni nyata dari pemilik usaha dan manajer bisnis yang telah
              mempercayakan visual branding kepada NJM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testi) => (
              <div
                key={testi.name}
                className="bg-white p-7 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-red-200 hover:shadow-xl transition-all duration-300 flex flex-col relative group"
              >
                <Quote className="absolute top-6 right-6 text-slate-200 w-12 h-12 rotate-180 group-hover:text-red-100 transition-colors" />

                {/* Stars */}
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-700 text-sm md:text-base italic leading-relaxed mb-6 relative z-10">
                  &ldquo;{testi.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="mt-auto relative z-10 border-t border-slate-100 pt-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {testi.initials}
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-base">
                      {testi.name}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium">
                      {testi.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION (SEO CONTENT & GOOGLE SNIPPETS) */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-3">
              <HelpCircle size={16} />
              FAQ - Tanya Jawab
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Hal-hal umum seputar pemesanan neon box, huruf timbul, pylon sign,
              survei lokasi, hingga garansi.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 md:p-6 text-left font-bold text-slate-900 text-base md:text-lg flex justify-between items-center gap-4 hover:text-red-700 bg-slate-50/50"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-red-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 md:p-6 pt-0 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 bg-white">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. WILAYAH JANGKAUAN LAYANAN (LOCAL SEO CITATION GRID) */}
      <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
              <MapPin size={16} />
              Cakupan Wilayah Jabodetabek
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Jasa Pembuatan Neon Box & Signage Terdekat di Lokasi Anda
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Tim NJM Advertising siap melayani survei lokasi, pengukuran
              langsung, pengiriman, dan instalasi reklame di seluruh wilayah
              megapolitan Jabodetabek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <div
                key={area.city}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-red-300 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {area.city}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {area.coverage}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section
        id="cta"
        className="py-20 md:py-24 bg-gradient-to-br from-red-700 via-red-800 to-slate-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <span className="inline-block bg-white/20 text-white text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6 backdrop-blur-xs">
            Hubungi Workshop Kami
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Siap Melayani Kebutuhan <br className="hidden sm:block" /> Visual
            Branding Bisnis Anda
          </h2>

          <p className="text-red-100 max-w-2xl mx-auto mb-10 text-base md:text-xl font-normal leading-relaxed">
            Tidak perlu ragu untuk memilih kami. Pelayanan dan produk terbaik
            akan kami berikan. Konsultasikan kebutuhan Anda sekarang langsung
            dengan tim teknis kami.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={siteConfig.links.whatsapp}
              target="_blank"
              onClick={() => trackWhatsAppClick("cta_section")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-red-700 hover:bg-red-50 px-8 py-4 rounded-full font-bold text-base md:text-lg shadow-2xl transition-all hover:-translate-y-1 hover:shadow-white/20"
            >
              <Image
                src="/images/logowa2.png"
                alt="Logo WhatsApp NJM Advertising"
                width={26}
                height={26}
                className="w-6 h-6 object-contain"
              />
              <span>Hubungi Kami via WhatsApp</span>
            </Link>

            <Link
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/80 hover:border-white text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-slate-900 transition-all"
            >
              <span>Tentang Workshop NJM</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer
        id="footer"
        className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800"
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 border-b border-slate-800 pb-12 mb-10">
          {/* Kolom 1: Perusahaan */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logonjm.svg"
                alt="Logo PT Naga Jaya Mandiri Advertising & Welding"
                width={280}
                height={80}
                className="h-12 md:h-16 w-auto object-contain drop-shadow-md"
              />
              <span className="text-white font-black text-xl tracking-tight">
                NAGAJAYA<span className="text-red-500">MANDIRI</span>
              </span>
            </div>

            <p className="mb-6 text-slate-400 max-w-md leading-relaxed text-sm md:text-base">
              Partner terbaik untuk kebutuhan advertising dan signage bisnis
              Anda. Melayani pembuatan Neon Box, Huruf Timbul, Pylon Sign,
              hingga konstruksi Billboard langsung dari workshop berpengalaman.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                aria-label="Instagram NJM Advertising"
                className="bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white p-3 rounded-full transition-colors border border-slate-800"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
                aria-label="WhatsApp NJM Advertising"
                className="bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white p-3 rounded-full transition-colors border border-slate-800"
              >
                <Image
                  src="/images/logowa2.png"
                  alt="WhatsApp Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Kolom 2: Layanan */}
          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-5 tracking-wide">
              Layanan Signage
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#services"
                  className="hover:text-red-400 transition-colors"
                >
                  Neon Box Acrylic & LED
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-red-400 transition-colors"
                >
                  Huruf Timbul Stainless & Acrylic
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-red-400 transition-colors"
                >
                  Pylon Sign & Totem Sign
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-red-400 transition-colors"
                >
                  Billboard & Reklame
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-red-400 transition-colors"
                >
                  Neon Sign Custom Cafe
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-red-400 transition-colors"
                >
                  Shop Signage & Fasad Toko
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Area Layanan */}
          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-5 tracking-wide">
              Kontak & Lokasi
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-red-500 mt-1" />
                <span>
                  HVR3+R7R, Jl. Tole Iskandar No.22 b, Sukamaju, Kec. Cilodong,
                  Kota Depok, Jawa Barat 16415
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logowa2.png"
                  alt="WhatsApp Icon"
                  width={18}
                  height={18}
                  className="w-4 h-4 object-contain shrink-0"
                />
                <Link
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  className="hover:text-red-400 transition-colors font-bold text-white"
                >
                  {siteConfig.contact.phone}
                </Link>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Clock size={16} className="text-red-500 shrink-0" />
                <span>Konsultasi & Penawaran Online 24 Jam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} NJM Advertising (PT Naga Jaya
            Mandiri). All rights reserved by SYK.
          </p>
          <p>
            Spesialis Neon Box, Huruf Timbul & Signage Kontraktor Jabodetabek.
          </p>
        </div>
      </footer>

      {/* 10. FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        {/* Instagram Floating Pill */}
        <Link
          href={siteConfig.links.instagram}
          target="_blank"
          aria-label="Kunjungi Instagram NJM Advertising"
          className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 hover:scale-105 text-xs md:text-sm font-bold"
        >
          <Instagram size={18} />
          <span>@njm.advertising</span>
        </Link>

        {/* WhatsApp Floating CTA with Online Pulse */}
        <Link
          href={siteConfig.links.whatsapp}
          target="_blank"
          onClick={() => trackWhatsAppClick("floating_button")}
          aria-label="Hubungi WhatsApp NJM Advertising"
          className="relative inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5b] text-white px-5 py-3.5 md:px-6 md:py-4 rounded-full shadow-2xl transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 group"
        >
          {/* Online Indicator Badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          </span>

          <Image
            src="/images/logowa2.png"
            alt="WhatsApp Logo"
            width={32}
            height={32}
            className="w-7 h-7 object-contain"
          />
          <div className="text-left">
            <span className="block text-[10px] text-emerald-100 uppercase tracking-wider font-semibold leading-none">
              Respon Cepat
            </span>
            <span className="font-black text-sm md:text-base leading-tight">
              Chat WhatsApp
            </span>
          </div>
        </Link>
      </div>
    </main>
  );
}
