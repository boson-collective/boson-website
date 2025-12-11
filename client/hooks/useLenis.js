"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useLenis() {
  useEffect(() => {
    // ======================================================
    //  INIT LENIS (HEAVY CONFIG)
    // ======================================================
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.065,
      duration: 1.25,
      smoothWheel: true,
      wheelMultiplier: 0.66,
      smoothTouch: true,
      touchMultiplier: 1.35,
    });

    // ======================================================
    //  SYNC LENIS → SCROLLTRIGGER
    // ======================================================
    lenis.on("scroll", ScrollTrigger.update);

    // ======================================================
    //  RAF LOOP — WAJIB
    // ======================================================
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ======================================================
    //  CLEANUP
    // ======================================================
    return () => {
      lenis.destroy();
    };
  }, []);
}
