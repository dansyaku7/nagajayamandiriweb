"use client";

import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  LayoutDashboard,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  LogOut,
  Save,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { resolveImage, type ImageOverrides } from "@/config/images";
import { SEO_LIMITS, type SeoSettings } from "@/config/seo";
import { cn } from "@/lib/utils";
import { api, ApiError } from "./api";
import { ImagesPanel } from "./ImagesPanel";
import { StatsPanel } from "./StatsPanel";

type Errors = Partial<Record<keyof SeoSettings, string>>;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none transition-shadow placeholder:text-slate-300 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.12)]";

function Field({
  label,
  hint,
  error,
  count,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  count?: { value: number; ideal: number; max: number };
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-slate-900">{label}</span>
        {count && (
          <span
            className={cn(
              "font-mono text-[11px]",
              count.value > count.max ? "text-red-600" : count.value > count.ideal ? "text-amber-600" : "text-slate-400",
            )}
          >
            {count.value}/{count.ideal}
          </span>
        )}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white">{icon}</span>
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.login(password);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5">
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-red-600/30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-red-900/30 blur-[140px]" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="inline-flex rounded-2xl bg-white px-4 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logonjm.svg" alt="NJM Advertising" className="h-10 w-auto" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Panel SEO</h1>
        <p className="mt-1 text-sm text-white/55">Khusus pengelola situs NJM Advertising.</p>
        <div className="relative mt-8">
          <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
            className="h-12 w-full rounded-xl bg-white/10 pl-11 pr-11 text-sm text-white placeholder:text-white/35 ring-1 ring-white/15 outline-none focus:ring-red-400"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition-opacity hover:bg-red-700 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Masuk
        </button>
      </form>
    </div>
  );
}

function SerpPreview({ s, mark }: { s: SeoSettings; mark: string }) {
  const host = s.siteUrl.replace(/^https?:\/\//, "");
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="mb-3 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Pratinjau di Google</p>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} alt="" className="h-7 w-7 rounded-full border border-slate-200 bg-white object-contain p-0.5" />
        <div className="leading-tight">
          <p className="text-[13px] text-[#202124]">NJM Advertising</p>
          <p className="text-[12px] text-[#4d5156]">{host}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-1 text-[19px] leading-snug text-[#1a0dab]">{s.title || "Judul halaman"}</p>
      <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-[#4d5156]">{s.description || "Deskripsi halaman akan tampil di sini."}</p>
    </div>
  );
}

function SocialPreview({ s, img }: { s: SeoSettings; img: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <p className="px-5 pt-4 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Pratinjau saat dibagikan (WhatsApp, Facebook, LinkedIn)</p>
      <div className="mt-3 aspect-[1200/630] bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img && <img src={img} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
      </div>
      <div className="bg-[#f0f2f5] px-5 py-3">
        <p className="text-[11px] text-[#65676b] uppercase">{s.siteUrl.replace(/^https?:\/\//, "")}</p>
        <p className="line-clamp-1 text-[15px] font-semibold text-[#050505]">{s.title}</p>
        <p className="line-clamp-1 text-[13px] text-[#65676b]">{s.description}</p>
      </div>
    </div>
  );
}

function SeoPanel({ onLogout, overrides, onOpenImages }: { onLogout: () => void; overrides: ImageOverrides; onOpenImages: () => void }) {
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [saved, setSaved] = useState<SeoSettings | null>(null);
  const [storage, setStorage] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getSeo()
      .then(({ settings, storage }) => {
        setSettings(settings);
        setSaved(settings);
        setStorage(storage);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) onLogout();
        else setStatus({ kind: "error", text: err instanceof Error ? err.message : "Gagal memuat" });
      });
  }, [onLogout]);

  if (!settings) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        {status ? <p className="text-sm text-red-600">{status.text}</p> : <Loader2 className="h-6 w-6 animate-spin text-slate-400" />}
      </div>
    );
  }

  const set = <K extends keyof SeoSettings>(key: K, value: SeoSettings[K]) => {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const { settings: next } = await api.saveSeo(settings);
      setSettings(next);
      setSaved(next);
      setErrors({});
      setStatus({ kind: "ok", text: "Tersimpan. Perubahan langsung aktif di halaman utama." });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) return onLogout();
        setErrors(err.errors ?? {});
      }
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  };

  const base = settings.siteUrl;
  const lastSaved = saved && saved.updatedAt > new Date(0).toISOString() ? new Date(saved.updatedAt).toLocaleString("id-ID") : null;

  return (
    <form onSubmit={save} className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1.15fr_0.85fr]">
      {!storage && (
        <p className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 lg:col-span-2">
          <TriangleAlert className="h-4 w-4 shrink-0" /> Penyimpanan Vercel Blob belum tersambung, jadi perubahan belum bisa disimpan.
        </p>
      )}
      <div className="space-y-6">
        <Card icon={<Search className="h-4 w-4" />} title="Meta halaman">
          <Field label="URL situs (domain utama)" error={errors.siteUrl} hint="Dipakai untuk canonical, sitemap, dan Open Graph.">
            <input className={inputClass} value={settings.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} placeholder="https://www.njm-advertising.com" />
          </Field>
          <Field label="Judul (title tag)" error={errors.title} count={{ value: settings.title.length, ideal: SEO_LIMITS.title.ideal, max: SEO_LIMITS.title.max }}>
            <input className={inputClass} value={settings.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field
            label="Deskripsi (meta description)"
            error={errors.description}
            count={{ value: settings.description.length, ideal: SEO_LIMITS.description.ideal, max: SEO_LIMITS.description.max }}
          >
            <textarea rows={4} className={cn(inputClass, "resize-none")} value={settings.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Kata kunci" error={errors.keywords} hint="Pisahkan dengan koma. Google tidak lagi memakai meta keywords untuk peringkat, tapi mesin pencari lain masih membacanya.">
            <textarea rows={3} className={cn(inputClass, "resize-none")} value={settings.keywords} onChange={(e) => set("keywords", e.target.value)} />
          </Field>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <span>
              <span className="block text-[13px] font-semibold text-slate-900">Gambar share (Open Graph)</span>
              <span className="block text-xs text-slate-500">Diunggah dan diganti dari tab Foto, bersama foto lainnya.</span>
            </span>
            <button type="button" onClick={onOpenImages} className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white">
              Buka tab Foto
            </button>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <input type="checkbox" checked={settings.robotsIndex} onChange={(e) => set("robotsIndex", e.target.checked)} className="mt-0.5 h-4 w-4 accent-red-600" />
            <span>
              <span className="block text-[13px] font-semibold text-slate-900">Izinkan mesin pencari mengindeks situs</span>
              <span className="block text-xs text-slate-500">Matikan hanya saat situs masih tahap uji coba. Bila mati, situs tidak akan muncul di Google.</span>
            </span>
          </label>
        </Card>

        <Card icon={<ShieldCheck className="h-4 w-4" />} title="Google Search Console & verifikasi">
          <Field
            label="Kode verifikasi Google (metode tag HTML)"
            error={errors.googleVerification}
            hint={'Boleh tempel seluruh tag <meta name="google-site-verification" content="...">, nilai content-nya akan diambil otomatis.'}
          >
            <input className={cn(inputClass, "font-mono text-[13px]")} value={settings.googleVerification} onChange={(e) => set("googleVerification", e.target.value)} placeholder="AbC123..." />
          </Field>
          <Field
            label="Nama file verifikasi HTML (opsional)"
            error={errors.googleVerificationFile}
            hint="Bila memilih metode File HTML di Search Console, cukup isi nama filenya. Server akan menyajikannya otomatis."
          >
            <input className={cn(inputClass, "font-mono text-[13px]")} value={settings.googleVerificationFile} onChange={(e) => set("googleVerificationFile", e.target.value)} placeholder="google1a2b3c4d5e6f7a8b.html" />
          </Field>
          <Field label="Kode verifikasi Bing Webmaster (opsional)" error={errors.bingVerification}>
            <input className={cn(inputClass, "font-mono text-[13px]")} value={settings.bingVerification} onChange={(e) => set("bingVerification", e.target.value)} />
          </Field>
        </Card>

        <Card icon={<BarChart3 className="h-4 w-4" />} title="Analytics">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Google Analytics 4" error={errors.gaMeasurementId} hint="Format G-XXXXXXXXXX">
              <input className={cn(inputClass, "font-mono text-[13px]")} value={settings.gaMeasurementId} onChange={(e) => set("gaMeasurementId", e.target.value)} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Google Tag Manager" error={errors.gtmId} hint="Format GTM-XXXXXXX">
              <input className={cn(inputClass, "font-mono text-[13px]")} value={settings.gtmId} onChange={(e) => set("gtmId", e.target.value)} placeholder="GTM-XXXXXXX" />
            </Field>
          </div>
          <p className="text-xs text-slate-400">Isi salah satu saja. Bila GA4 sudah dipasang lewat Tag Manager, kosongkan kolom GA4 agar data tidak tercatat dua kali.</p>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <SerpPreview s={settings} mark={resolveImage(overrides, "favicon")} />
        <SocialPreview s={settings} img={overrides["og-image"] ?? settings.ogImage} />

        <section className="rounded-3xl bg-slate-950 p-6 text-white">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Globe className="h-4 w-4 text-red-400" /> Cara verifikasi di Search Console
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[13px] leading-relaxed text-white/70">
            <li>
              Buka{" "}
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-red-300 underline">
                search.google.com/search-console
              </a>{" "}
              lalu tambahkan properti <b>Awalan URL</b>: <span className="font-mono">{base}</span>
            </li>
            <li>Pilih metode <b>Tag HTML</b>, salin kodenya, tempel di kolom verifikasi Google, lalu simpan.</li>
            <li>Kembali ke Search Console dan klik <b>Verifikasi</b>.</li>
            <li>
              Setelah terverifikasi, buka menu <b>Peta Situs</b> dan kirim: <span className="font-mono">sitemap.xml</span>
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
              /sitemap.xml
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
              /robots.txt
            </a>
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 z-10 lg:col-span-2">
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 pl-5 shadow-xl backdrop-blur sm:flex-row">
          {status ? (
            <p className={cn("flex items-center gap-2 text-sm font-medium", status.kind === "ok" ? "text-emerald-600" : "text-red-600")}>
              {status.kind === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
              {status.text}
            </p>
          ) : (
            <p className="text-sm text-slate-500">{dirty ? "Ada perubahan yang belum disimpan." : lastSaved ? `Tersimpan · terakhir ${lastSaved}` : "Belum ada perubahan yang disimpan."}</p>
          )}
          <button
            type="submit"
            disabled={saving || !dirty}
            className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition-opacity hover:bg-red-700 disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan perubahan
          </button>
        </div>
      </div>
    </form>
  );
}

type Tab = "stats" | "seo" | "images";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("stats");
  const [overrides, setOverrides] = useState<ImageOverrides>({});

  useEffect(() => {
    api
      .getImages()
      .then((r) => setOverrides(r.overrides))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) onLogout();
      });
  }, [onLogout]);

  const logout = async () => {
    await api.logout().catch(() => undefined);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveImage(overrides, "brand-logo")} alt="" className="h-9 w-auto max-w-[120px] object-contain" />
            <p className="hidden text-sm font-bold text-slate-900 sm:block">Panel Situs</p>
          </div>
          <nav className="flex gap-1 rounded-full bg-slate-100 p-1" aria-label="Bagian panel">
            {(
              [
                { id: "stats", label: "Dashboard", icon: LayoutDashboard },
                { id: "seo", label: "SEO", icon: Search },
                { id: "images", label: "Foto", icon: ImageIcon },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-label={t.label}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  tab === t.id ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-900",
                )}
              >
                <t.icon className="h-4 w-4" />
                {/* Di layar sempit hanya tab aktif yang menampilkan nama */}
                <span className={tab === t.id ? "inline" : "hidden sm:inline"}>{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 md:flex">
              <ExternalLink className="h-4 w-4" /> Lihat situs
            </a>
            <button type="button" onClick={logout} className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:px-4">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {tab === "stats" ? (
        <StatsPanel onLogout={onLogout} />
      ) : tab === "seo" ? (
        <SeoPanel onLogout={onLogout} overrides={overrides} onOpenImages={() => setTab("images")} />
      ) : (
        <ImagesPanel overrides={overrides} onChange={setOverrides} onLogout={onLogout} />
      )}
    </div>
  );
}

export function AdminApp() {
  const [state, setState] = useState<"loading" | "login" | "editor">("loading");

  useEffect(() => {
    api
      .session()
      .then((s) => setState(s.authenticated ? "editor" : "login"))
      .catch(() => setState("login"));
  }, []);

  const toLogin = useCallback(() => setState("login"), []);

  if (state === "loading") return <div className="min-h-screen bg-slate-950" />;
  if (state === "login") return <Login onDone={() => setState("editor")} />;
  return <Dashboard onLogout={toLogin} />;
}
