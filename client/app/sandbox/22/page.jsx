"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import cn from "classnames";

gsap.registerPlugin(ScrollTrigger);

// =========================
//  CONFIG — EASY TWEAK
// =========================
const COLUMNS = 5; // jumlah kolom masonry

// Tailwind-safe columns class
const COLUMN_CLASS = {
  1: "columns-1",
  2: "columns-2",
  3: "columns-3",
  4: "columns-4",
  5: "columns-5",
  6: "columns-6",
}[COLUMNS];

// =========================
//  PROJECT LIST
// =========================
const PROJECT = [
  { src: "/clients/dwm/main.mp4", ratio: "4/5" },
  { src: "/clients/tender-touch/8.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/2.mp4", ratio: "4/5" },
  { src: "/clients/tender-touch/2.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/6.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/7.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/5.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/10.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/11.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/3.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/4.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/2.jpg", ratio: "4/5" },
  
  { src: "/clients/marrosh/main.mp4", ratio: "4/5" },
  { src: "/clients/tender-touch/5.jpg", ratio: "4/5" },
  { src: "/clients/tender-touch/main.mp4", ratio: "4/5" },
  
];

export default function BosonMasonryV1() {
  const maskRefs = useRef([]);
  const rafRefs = useRef({});
  const snapRefs = useRef({});
  const resizeObserver = useRef(null);
  const state = useRef({});

  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const lenisRef = useRef(null);
  const rafScrollRef = useRef(null);

  // =============================
  // UTILITIES
  // =============================
  function debounce(fn, wait = 120) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function computeFinalSize(rect) {
    const diag = Math.sqrt(rect.width ** 2 + rect.height ** 2);
    return Math.ceil(diag * 2);
  }

  function prepareItem(idx, container) {
    const el = maskRefs.current[idx];
    if (!el || !container) return;

    if (!state.current[idx]) state.current[idx] = {};
    const st = state.current[idx];

    st.quickPos = (xPct, yPct) => {
      const s = `${xPct}% ${yPct}%`;
      el.style.maskPosition = s;
      el.style.webkitMaskPosition = s;
    };

    const rect = container.getBoundingClientRect();
    st.finalSize = computeFinalSize(rect);

    el.style.willChange = "mask-size, mask-position, opacity";
    el.style.maskRepeat = "no-repeat";
    el.style.webkitMaskRepeat = "no-repeat";
    el.style.opacity = 0;
    el.style.maskSize = "0px 0px";
  }

  // =============================
  // CLEANUP
  // =============================
  useEffect(() => {
    return () => {
      Object.values(rafRefs.current).forEach((id) => id && cancelAnimationFrame(id));
      if (resizeObserver.current) resizeObserver.current.disconnect();
      gsap.killTweensOf("*");
    };
  }, []);

  // =============================
  // RESIZE OBSERVER
  // =============================
  useEffect(() => {
    const handleResize = debounce(() => {
      Object.keys(state.current).forEach((k) => {
        const idx = Number(k);
        const el = maskRefs.current[idx];
        if (!el) return;
        const rect = el.parentElement.getBoundingClientRect();
        state.current[idx].finalSize = computeFinalSize(rect);
      });
    });

    window.addEventListener("resize", handleResize);

    try {
      resizeObserver.current = new ResizeObserver(handleResize);
      maskRefs.current.forEach((el) => el && resizeObserver.current.observe(el.parentElement));
    } catch {}

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.current?.disconnect();
    };
  }, []);

  // =============================
  // POINTER MASK
  // =============================
  function onPointerMove(e, idx) {
    const el = maskRefs.current[idx];
    if (!el) return;

    if (!state.current[idx]) prepareItem(idx, el.parentElement);

    const rect = e.currentTarget.getBoundingClientRect();

    snapRefs.current[idx] = {
      clientX: e.clientX,
      clientY: e.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    if (rafRefs.current[idx]) return;

    rafRefs.current[idx] = requestAnimationFrame(() => {
      rafRefs.current[idx] = null;

      const snap = snapRefs.current[idx];
      const st = state.current[idx];
      if (!snap || !st) return;

      const cx = Math.max(0, Math.min(snap.width, snap.clientX - snap.left));
      const cy = Math.max(0, Math.min(snap.height, snap.clientY - snap.top));

      st.quickPos((cx / snap.width) * 100, (cy / snap.height) * 100);
    });
  }

  function onPointerEnter(e, idx) {
    const el = maskRefs.current[idx];
    if (!el || !state.current[idx]) prepareItem(idx, el.parentElement);

    const st = state.current[idx];
    const rect = e.currentTarget.getBoundingClientRect();

    st.quickPos(
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100
    );

    gsap.set(el, { opacity: 1 });

    st.finalSize = computeFinalSize(rect);
    const sizePx = `${st.finalSize}px ${st.finalSize}px`;

    gsap.fromTo(
      el,
      { maskSize: "0px 0px" },
      {
        maskSize: sizePx,
        duration: 0.62,
        ease: "power3.out",
      }
    );
  }

  function onPointerLeave(_, idx) {
    const el = maskRefs.current[idx];
    if (!el) return;

    gsap.to(el, {
      maskSize: "0px 0px",
      opacity: 0,
      duration: 0.42,
      ease: "power3.inOut",
    });
  }

// =============================
// PARALLAX — ORIGINAL BOSON 4-LANE PATTERN APPLIED TO MASONRY
// =============================
useEffect(() => {
  if (!gridRef.current) return;

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
  });
  lenisRef.current = lenis;

  function raf(time) {
    lenis.raf(time);
    rafScrollRef.current = requestAnimationFrame(raf);
  }
  rafScrollRef.current = requestAnimationFrame(raf);

  const items = Array.from(gridRef.current.querySelectorAll(".parallax-item"));

  // 1. DETECT REAL MASONRY COLUMNS VIA offsetLeft
  const columnMap = {};
  items.forEach((el) => {
    const x = el.offsetLeft;
    if (!columnMap[x]) columnMap[x] = [];
    columnMap[x].push(el);
  });

  // 2. SORT LEFT → RIGHT
  const colKeys = Object.keys(columnMap).sort((a, b) => a - b);

  // 3. TRUE BOSON PARALLAX PATTERN (4-step loop)
  // EXACT pattern:
  // 0: -250
  // 1:  20
  // 2: -250
  // 3:  20
  const pattern = [-250, 20, -250, 20];

  // 4. APPLY TO EVERY COLUMN
  colKeys.forEach((colX, laneIndex) => {
    const colEls = columnMap[colX];

    const parallax = pattern[laneIndex % 4];

    // set initial offset
    gsap.set(colEls, { y: parallax * -0.28 });

    // animate to final offset
    gsap.to(colEls, {
      y: parallax,
      ease: "none",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top bottom+=25%",
        end: "bottom top-=25%",
        scrub: 2.8,
      },
    });
  });

  return () => {
    cancelAnimationFrame(rafScrollRef.current);
    lenis.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}, []);


  // =============================
  // RENDER
  // =============================
  return (
    <div ref={rootRef} className="min-h-screen  text-white pt-20  pb-10">
      <div
        ref={gridRef}
        className={cn(
          "w-full gap-8 pt-10",
          COLUMN_CLASS,
          "masonry-parent"
        )}
      >
        {PROJECT.map((item, idx) => {
          const isVideo = item.src.endsWith(".mp4");

          return (
            <div key={idx} className="mb-8 break-inside-avoid parallax-item">
              <article
                className="relative overflow-hidden rounded-sm bg-neutral-900 w-full"
                style={{ aspectRatio: item.ratio }}
              >
                <div
                  className="relative w-full h-full"
                  onPointerMove={(e) => onPointerMove(e, idx)}
                  onPointerEnter={(e) => onPointerEnter(e, idx)}
                  onPointerLeave={(e) => onPointerLeave(e, idx)}
                  onPointerCancel={(e) => onPointerLeave(e, idx)}
                >
                  {isVideo ? (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <img
                      src={item.src}
                      className="w-full h-full object-cover grayscale"
                      draggable={false}
                    />
                  )}

                  <div
                    ref={(el) => (maskRefs.current[idx] = el)}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
                      opacity: 0,
                    }}
                  >
                    <img
                      src={item.src}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
