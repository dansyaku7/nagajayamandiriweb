"use client";

import { CheckCircle2, ExternalLink, Link2, Loader2, MapPin, RotateCcw, TriangleAlert, Upload } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { IMAGE_GROUPS, IMAGE_SLOTS, isValidImageUrl, resolveImage, type ImageOverrides, type ImageSlot } from "@/config/images";
import { cn } from "@/lib/utils";
import { api, ApiError } from "./api";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIDE = 2200;
/** Batas unggahan server (Vercel menolak body di atas 4,5 MB). */
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Perkecil foto besar di browser sebelum diunggah (sisi terpanjang maks. 2200 px, WebP).
 * Unggahan jadi cepat dan halaman tetap ringan walau foto aslinya dari kamera belasan MB.
 */
async function prepareImage(file: File): Promise<Blob> {
  if (!ACCEPT.includes(file.type)) throw new Error("Format harus JPG, PNG, atau WebP.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= 1_500_000) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) throw new Error("Gagal memproses gambar.");
  if (blob.size > MAX_BYTES) throw new Error("Foto masih terlalu besar setelah diperkecil (maks. 4 MB).");
  return blob;
}

type Status = { kind: "busy" } | { kind: "ok"; text: string } | { kind: "error"; text: string } | null;

function SlotCard({
  slot,
  overrides,
  onChange,
  onLogout,
}: {
  slot: ImageSlot;
  overrides: ImageOverrides;
  onChange: (next: ImageOverrides) => void;
  onLogout: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const src = resolveImage(overrides, slot.id);
  const changed = Boolean(overrides[slot.id]);
  const contain = slot.group === "Brand" && slot.id !== "og-image";

  const run = async (action: () => Promise<{ overrides: ImageOverrides }>, okText: string) => {
    setStatus({ kind: "busy" });
    try {
      const res = await action();
      onChange(res.overrides);
      setStatus({ kind: "ok", text: okText });
      window.setTimeout(() => setStatus((s) => (s?.kind === "ok" ? null : s)), 3500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onLogout();
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Gagal menyimpan" });
    }
  };

  const upload = (file: File | undefined) => {
    if (!file) return;
    void run(async () => api.uploadImage(slot.id, await prepareImage(file)), "Foto baru tersimpan dan langsung tampil di situs.");
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files[0]);
  };

  const submitUrl = () => {
    const value = url.trim();
    if (!isValidImageUrl(value)) {
      setStatus({ kind: "error", text: "URL harus diawali https://" });
      return;
    }
    void run(() => api.setImageUrl(slot.id, value), "Foto dari URL tersimpan.");
    setUrlMode(false);
    setUrl("");
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="relative overflow-hidden bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f8fafc_0%_50%)] bg-[length:20px_20px]"
        style={{ aspectRatio: slot.aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau harus menampilkan URL apa pun apa adanya */}
        <img
          key={src}
          src={src}
          alt={slot.label}
          className={cn("absolute inset-0 h-full w-full", contain ? "object-contain p-8" : "object-cover")}
          loading="lazy"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase",
            changed ? "bg-red-600 text-white" : "bg-white/90 text-slate-500",
          )}
        >
          {changed ? "Diganti" : "Default"}
        </span>
        {(dragging || status?.kind === "busy") && (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/70 text-sm font-semibold text-white">
            {status?.kind === "busy" ? <Loader2 className="h-7 w-7 animate-spin" /> : "Lepaskan untuk mengganti"}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-bold text-slate-900">{slot.label}</h3>
        <p className="mt-1.5 flex gap-1.5 text-[12.5px] leading-snug text-slate-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
          {slot.where}
        </p>
        <p className="mt-1 text-[11.5px] text-slate-400">Saran: {slot.recommended}</p>

        {urlMode && (
          <div className="mt-3 flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitUrl()}
              placeholder="https://…"
              autoFocus
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-red-500"
            />
            <button type="button" onClick={submitUrl} className="rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white">
              Simpan
            </button>
          </div>
        )}

        {status && status.kind !== "busy" && (
          <p className={cn("mt-3 flex items-start gap-1.5 text-xs font-medium", status.kind === "ok" ? "text-emerald-600" : "text-red-600")}>
            {status.kind === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <TriangleAlert className="h-4 w-4 shrink-0" />}
            {status.text}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <input ref={fileRef} type="file" accept={ACCEPT.join(",")} className="hidden" onChange={(e) => (upload(e.target.files?.[0]), (e.target.value = ""))} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={status?.kind === "busy"}
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> Ganti foto
          </button>
          <button
            type="button"
            onClick={() => setUrlMode((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Link2 className="h-3.5 w-3.5" /> URL
          </button>
          {changed && (
            <button
              type="button"
              onClick={() => void run(() => api.resetImage(slot.id), "Dikembalikan ke foto default.")}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Default
            </button>
          )}
          <a
            href={slot.anchor ? `/#${slot.anchor}` : "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 px-1 py-2 text-xs font-semibold text-red-600 hover:underline"
          >
            Lihat di situs <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

const groupAnchor = (group: string) => `foto-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export function ImagesPanel({
  overrides,
  onChange,
  onLogout,
}: {
  overrides: ImageOverrides;
  onChange: (next: ImageOverrides) => void;
  onLogout: () => void;
}) {
  const changedCount = Object.keys(overrides).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Foto situs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
          Klik <b className="text-white">Ganti foto</b> atau seret file ke pratinjau. Setiap kartu menunjukkan letak foto di halaman, jadi
          tidak tertukar. Foto besar otomatis diperkecil sebelum diunggah. Perubahan langsung aktif setelah halaman situs dimuat ulang.
        </p>
        <p className="mt-4 text-xs text-white/45">
          {changedCount} dari {IMAGE_SLOTS.length} foto sudah diganti
        </p>
      </div>

      <nav className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5" aria-label="Kelompok foto">
        {IMAGE_GROUPS.map((g) => (
          <a key={g} href={`#${groupAnchor(g)}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
            {g}
          </a>
        ))}
      </nav>

      {IMAGE_GROUPS.map((group) => (
        <section key={group} id={groupAnchor(group)} className="scroll-mt-24 pt-10">
          <h2 className="text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">{group}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {IMAGE_SLOTS.filter((s) => s.group === group).map((slot) => (
              <SlotCard key={slot.id} slot={slot} overrides={overrides} onChange={onChange} onLogout={onLogout} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
