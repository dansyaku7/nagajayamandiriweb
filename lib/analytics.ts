import { SESSION_TIMEOUT_MS, type SectionId, type TrackEvent } from "@/config/analytics";

type GtagFunction = (...args: unknown[]) => void;

/* ---------- Google Analytics ---------- */

const gtagEvent = (name: string, params: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  const win = window as unknown as { gtag?: GtagFunction };
  if (typeof win.gtag === "function") win.gtag("event", name, { ...params, transport_type: "beacon" });
};

/* ---------- Statistik sendiri (dashboard panel) ---------- */

/** Panel menandai browser pengelola supaya kunjungannya sendiri tidak ikut terhitung. */
export const NO_TRACK_KEY = "njm_no_track";
const VISIT_KEY = "njm_visit";

interface Visit {
  /** Waktu aktivitas terakhir (ms). */
  last: number;
  eng?: 1;
  /** Section & project yang sudah tercatat di kunjungan ini, supaya tidak dihitung dua kali. */
  seen: string[];
}

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function trackingDisabled(): boolean {
  if (typeof window === "undefined" || navigator.webdriver) return true;
  return storage()?.getItem(NO_TRACK_KEY) === "1";
}

function readVisit(): Visit | null {
  try {
    const visit = JSON.parse(storage()?.getItem(VISIT_KEY) ?? "null") as Visit | null;
    return visit && Date.now() - visit.last < SESSION_TIMEOUT_MS ? visit : null;
  } catch {
    return null;
  }
}

function writeVisit(visit: Visit): void {
  try {
    storage()?.setItem(VISIT_KEY, JSON.stringify({ ...visit, last: Date.now() }));
  } catch {
    /* Mode privat: kunjungan tetap dicatat, hanya tanpa penghapus duplikat. */
  }
}

let queue: TrackEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;

/** Kirim antrean sekarang. sendBeacon tetap terkirim walau halaman sedang ditutup atau pindah ke WhatsApp. */
export function flush(): void {
  clearTimeout(timer);
  if (!queue.length) return;
  const body = JSON.stringify({ e: queue });
  queue = [];
  const sent = navigator.sendBeacon?.("/api/t", new Blob([body], { type: "text/plain" }));
  if (!sent) void fetch("/api/t", { method: "POST", body, keepalive: true }).catch(() => undefined);
}

/** Event digabung beberapa detik supaya satu kunjungan tidak memicu banyak permintaan. */
function send(event: TrackEvent, now = false): void {
  if (trackingDisabled()) return;
  queue.push(event);
  if (now) flush();
  else {
    clearTimeout(timer);
    timer = setTimeout(flush, 2000);
  }
}

/** Catat sekali per kunjungan: dipakai untuk section, project, dan status terlibat. */
function once(id: string, event: TrackEvent, now = false): void {
  const visit = readVisit() ?? { last: Date.now(), seen: [] };
  if (visit.seen.includes(id)) return writeVisit(visit);
  writeVisit({ ...visit, seen: [...visit.seen, id] });
  send(event, now);
}

export function trackPageview(): void {
  if (trackingDisabled()) return;
  const visit = readVisit();
  if (visit) {
    writeVisit(visit);
    return send({ t: "pv" }, true);
  }
  writeVisit({ last: Date.now(), seen: [] });
  const event: TrackEvent = { t: "pv", s: 1 };
  if (document.referrer) event.r = document.referrer.slice(0, 300);
  const utm = new URLSearchParams(location.search).get("utm_source");
  if (utm) event.u = utm.slice(0, 60);
  // iPadOS mengaku sebagai Mac; layar sentuh membedakannya dari laptop.
  if (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) event.m = 1;
  send(event, true);
}

export const trackEngaged = (): void => once("eng", { t: "eng" });
export const trackDuration = (seconds: number): void => send({ t: "dur", n: seconds }, true);
export const trackSection = (id: SectionId): void => once(`sec:${id}`, { t: "sec", k: id });
export const trackPortfolioView = (title: string): void => once(`pf:${title}`, { t: "pf", k: title });

/* ---------- Klik tombol ---------- */

export const trackWhatsAppClick = (source: string) => {
  gtagEvent("generate_lead", { event_category: "contact", event_label: source });
  trackEngaged();
  // Pengunjung langsung berpindah ke WhatsApp, jadi kirim saat itu juga.
  send({ t: "wa", k: source }, true);
};

export const trackInstagramClick = (source: string) => {
  gtagEvent("click_instagram", { event_category: "social", event_label: source });
  trackEngaged();
  send({ t: "ig", k: source }, true);
};
