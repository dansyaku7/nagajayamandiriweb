"use client";

import { useEffect } from "react";
import { ENGAGED_AFTER_MS, TRACKED_SECTIONS } from "@/config/analytics";
import { flush, trackDuration, trackEngaged, trackingDisabled, trackPageview, trackSection } from "@/lib/analytics";

/**
 * Pencatat kunjungan untuk dashboard panel: page view, lama dilihat, dan section yang dilihat.
 * Tanpa cookie; identitas pengunjung hanya hash harian di server.
 */
export function Tracker() {
  useEffect(() => {
    if (trackingDisabled()) return;
    trackPageview();

    // Lama dilihat hanya dihitung saat tab terlihat, bukan saat ditinggal di belakang.
    let visibleMs = 0;
    let visibleSince = document.visibilityState === "visible" ? Date.now() : 0;
    let reportedMs = 0;
    const total = () => visibleMs + (visibleSince ? Date.now() - visibleSince : 0);

    const engagedCheck = setInterval(() => {
      if (total() < ENGAGED_AFTER_MS) return;
      trackEngaged();
      clearInterval(engagedCheck);
    }, 1000);

    const report = () => {
      const seconds = Math.floor((total() - reportedMs) / 1000);
      if (seconds > 0) {
        reportedMs += seconds * 1000;
        trackDuration(seconds);
      }
      flush();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (visibleSince) visibleMs += Date.now() - visibleSince;
        visibleSince = 0;
        report();
      } else if (!visibleSince) {
        visibleSince = Date.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", report);

    // Section dihitung dilihat bila mengisi separuh layar (section panjang) atau 60% isinya terlihat (section pendek).
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const seen = entry.intersectionRatio >= 0.6 || entry.intersectionRect.height >= window.innerHeight * 0.5;
          if (!seen) continue;
          const section = TRACKED_SECTIONS.find((s) => s.id === entry.target.id);
          if (section) trackSection(section.id);
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] },
    );
    for (const { id } of TRACKED_SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      clearInterval(engagedCheck);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", report);
      observer.disconnect();
    };
  }, []);

  return null;
}
