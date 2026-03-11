"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function useLenis() {
  useEffect(() => {

    // disable lenis on mobile
    if (window.innerWidth <= 768) return;

    const lenis = new Lenis({
      smooth: true,

      // 👉 inertia terasa, tapi tetap ringan
      lerp: 0.085,

      // 👉 jarak scroll tetap natural
      wheelMultiplier: 0.9,
      touchMultiplier: 0.85,

      // 👉 nahan dikit di awal, tapi cepat settle
      easing: (t) => 1 - Math.pow(1 - t, 2.4),

      normalizeWheel: true,
    });

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };

  }, []);
}