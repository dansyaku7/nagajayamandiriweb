"use client";

import {
  CheckCircle2,
  CircleDashed,
  Clock,
  Copy,
  Eye,
  Globe,
  Images,
  Instagram,
  LayoutList,
  Loader2,
  MapPin,
  MessageCircle,
  Monitor,
  MousePointerClick,
  Smartphone,
  Tablet,
  TrendingUp,
  TriangleAlert,
  Undo2,
  Unplug,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  buttonLabel,
  RANGES,
  TRACKED_SECTIONS,
  type GaReport,
  type GaStatus,
  type RangeDays,
  type StatRow,
  type StatsReport,
} from "@/config/analytics";
import { NO_TRACK_KEY } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { api, ApiError } from "./api";

/* ---------- Format ---------- */

const nf = new Intl.NumberFormat("id-ID");
const num = (n: number) => nf.format(Math.round(n));
const pct = (part: number, whole: number) => (whole > 0 ? `${((part / whole) * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%` : "–");

function duration(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s} dtk`;
  return `${Math.floor(s / 60)} mnt ${s % 60} dtk`;
}

const dateLabel = (iso: string, withYear = false) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: withYear ? "numeric" : undefined, timeZone: "UTC" });

const RANGE_LABELS: Record<RangeDays, string> = { 7: "7 Hari", 30: "30 Hari", 90: "90 Hari", 365: "1 Tahun" };

/* ---------- Komponen dasar ---------- */

function Panel({ icon, title, note, children, className }: { icon: ReactNode; title: string; note?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-3xl border border-slate-200 bg-white p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">{icon}</span>
          {title}
        </h3>
        {note && <span className="pt-2 text-right text-[11px] text-slate-400">{note}</span>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Tile({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600">{icon}</span>
      <p className="mt-4 text-[12px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-[11.5px] leading-snug text-slate-400">{sub}</p>}
    </div>
  );
}

function Empty({ children = "Belum ada data di rentang ini." }: { children?: ReactNode }) {
  return <p className="py-6 text-center text-[13px] text-slate-400">{children}</p>;
}

/** Daftar dengan batang horizontal. Persentase relatif terhadap `total` (bila ada), panjang batang relatif terhadap nilai terbesar. */
function BarList({ rows, total, label = (k) => k, icon }: { rows: StatRow[]; total?: number; label?: (key: string) => string; icon?: (key: string) => ReactNode }) {
  if (!rows.length) return <Empty />;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3.5">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2 text-slate-700">
              {icon?.(r.key)}
              <span className="truncate">{label(r.key)}</span>
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-semibold text-slate-900">{num(r.value)}</span>
              {total !== undefined && <span className="ml-2 inline-block w-12 text-right text-slate-400">{pct(r.value, total)}</span>}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-red-600" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const DEVICE_ICONS: Record<string, ReactNode> = {
  HP: <Smartphone className="h-4 w-4 text-slate-400" />,
  Desktop: <Monitor className="h-4 w-4 text-slate-400" />,
  Tablet: <Tablet className="h-4 w-4 text-slate-400" />,
  mobile: <Smartphone className="h-4 w-4 text-slate-400" />,
  desktop: <Monitor className="h-4 w-4 text-slate-400" />,
  tablet: <Tablet className="h-4 w-4 text-slate-400" />,
};

/* ---------- Grafik kolom ---------- */

interface ChartPoint {
  date: string;
  value: number;
}

const niceMax = (max: number) => {
  if (max <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / step) * step;
};

/** Grafik kolom satu seri dengan tooltip per kolom (hover & fokus keyboard). */
function ColumnChart({ points, metric, weekly }: { points: ChartPoint[]; metric: string; weekly: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const top = niceMax(Math.max(...points.map((p) => p.value), 0));
  const ticks = [top, top / 2, 0];
  const labelIdx = new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]);
  const current = active === null ? null : points[active];

  return (
    <div className="flex gap-3" onPointerLeave={() => setActive(null)}>
      <div className="flex h-56 flex-col justify-between pb-6 text-right text-[11px] tabular-nums text-slate-400">
        {ticks.map((t) => (
          <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
            {num(t)}
          </span>
        ))}
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px]">
          {[0, 50, 100].map((y) => (
            <div key={y} className="absolute inset-x-0 border-t border-slate-100" style={{ top: `${y}%` }} />
          ))}
        </div>
        <div className="relative flex h-[200px] items-end gap-[2px]">
          {points.map((p, i) => (
            <button
              key={p.date}
              type="button"
              aria-label={`${weekly ? "Minggu " : ""}${dateLabel(p.date, true)}: ${num(p.value)} ${metric}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group flex h-full min-w-0 flex-1 items-end justify-center outline-none"
            >
              <span
                className={cn(
                  "block w-full max-w-6 rounded-t-[4px] transition-colors",
                  p.value ? "bg-red-600 group-hover:bg-red-400 group-focus-visible:bg-red-400" : "bg-transparent",
                  active === i && "bg-red-400",
                )}
                style={{ height: p.value ? `max(${(p.value / top) * 100}%, 2px)` : 0 }}
              />
            </button>
          ))}
        </div>
        <div className="relative mt-2 h-4 text-[11px] text-slate-400">
          {points.map((p, i) =>
            labelIdx.has(i) ? (
              <span
                key={p.date}
                className={cn("absolute whitespace-nowrap", i === 0 ? "left-0" : i === points.length - 1 ? "right-0" : "-translate-x-1/2")}
                style={i === 0 || i === points.length - 1 ? undefined : { left: `${((i + 0.5) / points.length) * 100}%` }}
              >
                {dateLabel(p.date)}
              </span>
            ) : null,
          )}
        </div>
        {current && active !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 rounded-xl bg-slate-950 px-3 py-2 text-white shadow-lg"
            style={{
              left: `${((active + 0.5) / points.length) * 100}%`,
              transform: `translate(${active < points.length / 3 ? "-10%" : active > (points.length * 2) / 3 ? "-90%" : "-50%"}, -100%)`,
            }}
          >
            <p className="text-[15px] font-bold tabular-nums">{num(current.value)}</p>
            <p className="whitespace-nowrap text-[11px] text-white/60">
              {metric} · {weekly ? "minggu " : ""}
              {dateLabel(current.date, true)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full bg-slate-100 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
            value === o.id ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-900",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Statistik situs ---------- */

type Metric = "visitors" | "sessions" | "pageviews" | "wa";
const METRICS: { id: Metric; label: string; unit: string }[] = [
  { id: "visitors", label: "Pengunjung", unit: "pengunjung" },
  { id: "sessions", label: "Kunjungan", unit: "kunjungan" },
  { id: "pageviews", label: "Page views", unit: "page views" },
  { id: "wa", label: "Klik WhatsApp", unit: "klik WhatsApp" },
];

function TrendPanel({ report }: { report: StatsReport }) {
  const [metric, setMetric] = useState<Metric>("visitors");
  const info = METRICS.find((m) => m.id === metric)!;
  const weekly = report.bucket === "week";
  const points = report.series.map((p) => ({ date: p.date, value: p[metric] }));

  return (
    <Panel icon={<TrendingUp className="h-4 w-4" />} title={weekly ? "Tren per minggu" : "Tren per hari"}>
      <Segmented value={metric} options={METRICS} onChange={setMetric} />
      <div className="mt-8">
        <ColumnChart points={points} metric={info.unit} weekly={weekly} />
      </div>
      <details className="mt-4 text-[13px]">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-900">Lihat sebagai tabel</summary>
        <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-slate-200">
          <table className="w-full text-left tabular-nums">
            <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">{weekly ? "Minggu mulai" : "Tanggal"}</th>
                {METRICS.map((m) => (
                  <th key={m.id} className="px-3 py-2 text-right font-semibold">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...report.series].reverse().map((p) => (
                <tr key={p.date} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 text-slate-600">{dateLabel(p.date, true)}</td>
                  {METRICS.map((m) => (
                    <td key={m.id} className="px-3 py-1.5 text-right text-slate-900">
                      {num(p[m.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Panel>
  );
}

function SiteStats({ report }: { report: StatsReport }) {
  const t = report.totals;
  const sectionLabel = (id: string) => TRACKED_SECTIONS.find((s) => s.id === id)?.label ?? id;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Tile icon={<Users className="h-5 w-5" />} label="Pengunjung" value={num(t.visitors)} sub={`${num(t.sessions)} kunjungan`} />
        <Tile icon={<Eye className="h-5 w-5" />} label="Page views" value={num(t.pageviews)} />
        <Tile icon={<MessageCircle className="h-5 w-5" />} label="Klik WhatsApp" value={num(t.wa)} sub={t.sessions ? `${pct(t.wa, t.sessions)} dari kunjungan` : undefined} />
        <Tile icon={<Clock className="h-5 w-5" />} label="Rata-rata lama dilihat" value={t.sessions ? duration(t.duration / t.sessions) : "–"} sub="per kunjungan" />
        <Tile
          icon={<Undo2 className="h-5 w-5" />}
          label="Bounce rate"
          value={t.sessions ? pct(t.sessions - Math.min(t.engaged, t.sessions), t.sessions) : "–"}
          sub="pergi < 10 detik tanpa klik"
        />
      </div>

      <TrendPanel report={report} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel icon={<MessageCircle className="h-4 w-4" />} title="Klik WhatsApp per tombol" note={`${num(t.wa)} klik`}>
          <BarList rows={report.waButtons} total={t.wa} label={buttonLabel} />
        </Panel>
        <Panel icon={<Globe className="h-4 w-4" />} title="Sumber trafik" note="per kunjungan">
          <BarList rows={report.sources} total={t.sessions} />
        </Panel>
        <Panel icon={<LayoutList className="h-4 w-4" />} title="Section yang dilihat" note="% dari kunjungan">
          {t.sessions ? <BarList rows={report.sections} total={t.sessions} label={sectionLabel} /> : <Empty />}
        </Panel>
        <Panel icon={<Images className="h-4 w-4" />} title="Portofolio paling sering dibuka">
          <BarList rows={report.portfolio} />
        </Panel>
        <Panel icon={<Smartphone className="h-4 w-4" />} title="Perangkat">
          <BarList rows={report.devices} total={t.sessions} icon={(k) => DEVICE_ICONS[k]} />
        </Panel>
        <Panel icon={<MapPin className="h-4 w-4" />} title="Kota pengunjung" note="perkiraan dari jaringan">
          <BarList rows={report.cities} total={t.sessions} />
        </Panel>
        <Panel icon={<Monitor className="h-4 w-4" />} title="Browser">
          <BarList rows={report.browsers} total={t.sessions} />
        </Panel>
        <Panel icon={<Instagram className="h-4 w-4" />} title="Klik Instagram per tombol" note={`${num(t.ig)} klik`}>
          <BarList rows={report.igButtons} total={t.ig} label={buttonLabel} />
        </Panel>
      </div>
    </>
  );
}

/* ---------- Google Analytics ---------- */

const GA_SOURCE_LABELS: Record<string, string> = { "(direct)": "Langsung" };
const GA_DEVICE_LABELS: Record<string, string> = { mobile: "HP", desktop: "Desktop", tablet: "Tablet" };

function GaStats({ report, days }: { report: GaReport; days: RangeDays }) {
  const t = report.totals;
  const weekly = days > 90;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Tile icon={<Users className="h-5 w-5" />} label="Pengguna" value={num(t.users)} sub={`${num(t.sessions)} sesi`} />
        <Tile icon={<Eye className="h-5 w-5" />} label="Page views" value={num(t.pageviews)} />
        <Tile icon={<MousePointerClick className="h-5 w-5" />} label="Klik WhatsApp (generate_lead)" value={num(t.leads)} />
        <Tile icon={<Clock className="h-5 w-5" />} label="Rata-rata durasi sesi" value={t.sessions ? duration(t.avgDuration) : "–"} />
        <Tile icon={<Undo2 className="h-5 w-5" />} label="Bounce rate" value={t.sessions ? pct(t.bounceRate, 1) : "–"} />
      </div>
      <Panel icon={<TrendingUp className="h-4 w-4" />} title={weekly ? "Pengguna per minggu (GA4)" : "Pengguna per hari (GA4)"}>
        {report.series.length ? <ColumnChart points={report.series.map((p) => ({ date: p.date, value: p.users }))} metric="pengguna" weekly={weekly} /> : <Empty />}
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel icon={<Globe className="h-4 w-4" />} title="Sumber trafik (GA4)" note="per sesi">
          <BarList rows={report.sources} total={t.sessions} label={(k) => GA_SOURCE_LABELS[k] ?? k} />
        </Panel>
        <Panel icon={<Smartphone className="h-4 w-4" />} title="Perangkat (GA4)">
          <BarList rows={report.devices} total={t.sessions} label={(k) => GA_DEVICE_LABELS[k] ?? k} icon={(k) => DEVICE_ICONS[k]} />
        </Panel>
      </div>
    </div>
  );
}

function Step({ n, done, title, children }: { n: number; done?: boolean; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", done ? "bg-emerald-500 text-white" : "bg-slate-950 text-white")}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : n}
      </span>
      <div className="min-w-0 flex-1 pb-1">
        <p className="text-[14px] font-semibold text-slate-900">{title}</p>
        <div className="mt-1.5 space-y-2 text-[13px] leading-relaxed text-slate-600">{children}</div>
      </div>
    </li>
  );
}

function GaSetup({ status, error, onStatus, onLogout }: { status: GaStatus; error: string | null; onStatus: (s: GaStatus) => void; onLogout: () => void }) {
  const [propertyId, setPropertyId] = useState(status.propertyId ?? "");
  const [busy, setBusy] = useState<"key" | "property" | "remove" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const run = async (kind: typeof busy, action: () => Promise<{ status: GaStatus }>) => {
    setBusy(kind);
    setMessage(null);
    try {
      onStatus((await action()).status);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onLogout();
      setMessage(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setBusy(null);
    }
  };

  const uploadKey = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    await run("key", () => api.saveGa({ key: text }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const request = status.email
    ? `Halo, untuk dashboard situs NJM tolong tambahkan email ini sebagai Viewer di properti GA4 njm-advertising.com:\n\n${status.email}\n\nCaranya: Google Analytics > Admin > Akses properti (Property access management) > tombol + > Tambahkan pengguna > isi email di atas > peran Viewer > matikan "Beri tahu pengguna baru melalui email" > Tambahkan.\n\nLalu kirimkan juga Property ID-nya (Admin > Detail properti, berupa angka). Terima kasih!`
    : "";

  const copy = async () => {
    await navigator.clipboard.writeText(request).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!status.storage) {
    return <p className="text-[13px] text-slate-500">Database statistik perlu tersambung dulu sebelum Google Analytics bisa dihubungkan.</p>;
  }

  return (
    <div className="space-y-5">
      {error && status.propertyId && (
        <p className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}
      <ol className="space-y-6">
        <Step n={1} done={Boolean(status.email)} title="Buat service account di Google Cloud (gratis, cukup sekali)">
          <p>Boleh dengan akun Google siapa saja, tidak harus pemilik GA:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Buka{" "}
              <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 underline">
                console.cloud.google.com
              </a>{" "}
              dan buat project baru, misalnya <b>njm-dashboard</b>.
            </li>
            <li>
              Aktifkan{" "}
              <a href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com" target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 underline">
                Google Analytics Data API
              </a>{" "}
              (klik <b>Enable</b>).
            </li>
            <li>
              Buka{" "}
              <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 underline">
                IAM &amp; Admin › Service Accounts
              </a>
              , klik <b>Create service account</b>, beri nama bebas, lalu <b>Done</b> (peran tidak perlu diisi).
            </li>
            <li>
              Klik service account tersebut › tab <b>Keys</b> › <b>Add key</b> › <b>Create new key</b> › <b>JSON</b>. File akan terunduh.
            </li>
          </ol>
        </Step>
        <Step n={2} done={Boolean(status.email)} title="Unggah file JSON-nya di sini">
          <p>Kunci disimpan terenkripsi di database statistik, tidak masuk ke repo maupun pengaturan Vercel.</p>
          <div className="flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void uploadKey(e.target.files?.[0])} />
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-[13px] font-semibold text-white disabled:opacity-50"
            >
              {busy === "key" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {status.email ? "Ganti file JSON" : "Pilih file JSON"}
            </button>
            {status.email && <span className="break-all font-mono text-[12px] text-slate-500">{status.email}</span>}
          </div>
        </Step>
        <Step n={3} title="Minta pemegang Google Analytics menambahkan email service account">
          {status.email ? (
            <>
              <p>Salin pesan ini dan kirim ke pemegang akun GA (misalnya lewat WhatsApp):</p>
              <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-[12.5px] text-slate-700">{request}</pre>
              <button type="button" onClick={copy} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50">
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? "Tersalin" : "Salin pesan"}
              </button>
            </>
          ) : (
            <p className="text-slate-400">Pesan siap-kirim akan muncul setelah file JSON diunggah.</p>
          )}
        </Step>
        <Step n={4} done={Boolean(status.propertyId) && !error} title="Isi Property ID dari pemegang GA">
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void run("property", () => api.saveGa({ propertyId }));
            }}
          >
            <input
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              inputMode="numeric"
              placeholder="contoh: 412345678"
              disabled={!status.email}
              className="h-10 w-52 rounded-xl border border-slate-200 bg-white px-3 font-mono text-[13px] outline-none focus:border-red-500 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!status.email || !propertyId.trim() || busy !== null}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-[13px] font-semibold text-white hover:bg-red-700 disabled:opacity-40"
            >
              {busy === "property" && <Loader2 className="h-4 w-4 animate-spin" />} Simpan &amp; uji koneksi
            </button>
          </form>
          <p className="text-[12px] text-slate-400">Bukan kode G-2T3N94DB2Y, tapi angka di GA4 › Admin › Detail properti.</p>
        </Step>
      </ol>
      {message && <p className="text-[13px] text-red-600">{message}</p>}
      {status.email && (
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void run("remove", () => api.removeGa())}
          className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-400 hover:text-red-600"
        >
          <Unplug className="h-3.5 w-3.5" /> Hapus kunci & putuskan Google Analytics
        </button>
      )}
    </div>
  );
}

/* ---------- Halaman dashboard ---------- */

interface GaState {
  status: GaStatus;
  report: GaReport | null;
  error: string | null;
}

function Badge({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold",
        ok ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
      )}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

/** Panel hanya dirender di browser (setelah cek sesi), jadi localStorage aman dibaca saat inisialisasi. */
function useNoTrack(): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState(() => {
    try {
      // Browser pengelola otomatis dikecualikan saat panel pertama kali dibuka.
      if (localStorage.getItem(NO_TRACK_KEY) === null) localStorage.setItem(NO_TRACK_KEY, "1");
      return localStorage.getItem(NO_TRACK_KEY) === "1";
    } catch {
      return false;
    }
  });
  const update = (v: boolean) => {
    setValue(v);
    try {
      localStorage.setItem(NO_TRACK_KEY, v ? "1" : "0");
    } catch {
      /* penyimpanan browser diblokir */
    }
  };
  return [value, update];
}

export function StatsPanel({ onLogout }: { onLogout: () => void }) {
  const [days, setDays] = useState<RangeDays>(7);
  const [stats, setStats] = useState<{ enabled: boolean; report: StatsReport | null } | null>(null);
  const [ga, setGa] = useState<GaState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noTrack, setNoTrack] = useNoTrack();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fail = (err: unknown) => {
      if (cancelled) return;
      if (err instanceof ApiError && err.status === 401) onLogout();
      else setError(err instanceof Error ? err.message : "Gagal memuat statistik");
    };
    const site = api.getStats(days).then((r) => !cancelled && setStats(r), fail);
    const google = api.getGa(days).then((r) => !cancelled && setGa(r), fail);
    void Promise.all([site, google]).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [days, version, onLogout]);

  /** Data lama tetap tampil (redup) selama data baru dimuat. */
  const reload = (range = days) => {
    setLoading(true);
    setError(null);
    setDays(range);
    setVersion((v) => v + 1);
  };

  const report = stats?.report;
  const gaConnected = Boolean(ga?.report);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Statistik situs</h2>
          <p className="mt-1 text-sm text-slate-500">Pengunjung, klik WhatsApp, dan perilaku pengunjung di njm-advertising.com.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge ok={Boolean(stats?.enabled)}>{stats?.enabled === false ? "Database statistik belum tersambung" : "Pencatatan situs aktif"}</Badge>
            <Badge ok={gaConnected}>{gaConnected ? "Google Analytics terhubung" : "Google Analytics belum terhubung"}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          <Segmented value={days} options={RANGES.map((d) => ({ id: d, label: RANGE_LABELS[d] }))} onChange={(d) => reload(d)} />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <TriangleAlert className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {stats?.enabled === false && (
        <p className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <TriangleAlert className="h-4 w-4 shrink-0" /> Database Upstash Redis belum tersambung ke project Vercel, jadi kunjungan belum tercatat.
        </p>
      )}

      {report && (
        <div className={cn("space-y-6 transition-opacity", loading && "opacity-60")}>
          {report.since && report.since > report.series[0]?.date && (
            <p className="text-[13px] text-slate-500">
              Pencatatan dimulai {dateLabel(report.since, true)}; hari sebelumnya kosong. Riwayat lebih lama ada di bagian Google Analytics di bawah.
            </p>
          )}
          {!report.since && <p className="text-[13px] text-slate-500">Belum ada kunjungan tercatat. Data akan muncul begitu ada pengunjung membuka situs.</p>}
          <SiteStats report={report} />
        </div>
      )}

      {!stats && !error && (
        <div className="grid min-h-[40vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )}

      {ga && (
        <section className={cn("space-y-6 border-t border-slate-200 pt-8 transition-opacity", loading && "opacity-60")}>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Riwayat Google Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              {gaConnected
                ? `Properti ${ga.status.propertyId} · ${ga.status.email}. Angka GA bisa terlambat hingga 1–2 hari dan dihitung dengan cara Google, jadi wajar sedikit berbeda dari statistik di atas.`
                : "Data GA4 sudah terkumpul sejak tag G-2T3N94DB2Y terpasang. Hubungkan untuk melihat riwayatnya di sini."}
            </p>
          </div>
          {ga.report ? (
            <>
              <GaStats report={ga.report} days={days} />
              <details className="rounded-3xl border border-slate-200 bg-white p-5 text-sm">
                <summary className="cursor-pointer font-semibold text-slate-700">Pengaturan koneksi Google Analytics</summary>
                <div className="mt-5">
                  <GaSetup status={ga.status} error={ga.error} onStatus={() => reload()} onLogout={onLogout} />
                </div>
              </details>
            </>
          ) : (
            <Panel icon={<Globe className="h-4 w-4" />} title="Hubungkan Google Analytics 4">
              <GaSetup status={ga.status} error={ga.error} onStatus={() => reload()} onLogout={onLogout} />
            </Panel>
          )}
        </section>
      )}

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <input type="checkbox" checked={noTrack} onChange={(e) => setNoTrack(e.target.checked)} className="mt-0.5 h-4 w-4 accent-red-600" />
        <span>
          <span className="block text-[13px] font-semibold text-slate-900">Jangan hitung kunjungan dari browser ini</span>
          <span className="block text-xs text-slate-500">
            Aktif otomatis di browser yang pernah membuka panel, supaya kunjungan pengelola tidak menambah angka. Ponsel atau browser lain tetap terhitung sampai panel dibuka di sana.
          </span>
        </span>
      </label>
    </div>
  );
}
