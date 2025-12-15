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
  { src: "/clients/tender-touch/10.jpg", ratio: "4/5" },
  { src: "https://cdn.dribbble.com/userupload/9455447/file/original-e200109bf9f22ddeb35587d6cf5c1437.mp4", ratio: "4/5" },
  { src: "https://cdn.dribbble.com/userupload/13311994/file/original-1b3e2a914e7aacef47d981ec6622517c.jpg?resize=2048x1536&vertical=center", ratio: "4/5" },
  { src: "/clients/tender-touch/6.jpg", ratio: "4/5" },
  { src: "https://cdn.dribbble.com/userupload/46029274/file/35dc49f9cb7ffa2053cc997a2af8c02e.jpg?resize=2048x1536&vertical=center", ratio: "4/5" },
  { src: "/clients/tender-touch/5.jpg", ratio: "4/5" },
  { src: "https://img.freepik.com/premium-psd/customized-notepad-mockup_206274-547.jpg?ga=GA1.1.1925110224.1765286355&semt=ais_hybrid&w=740&q=80", ratio: "4/5" },
  { src: "https://cdn.dribbble.com/userupload/45827471/file/f180fcb3a2be0f98acf90fd05829cda4.jpg?resize=1504x1128&vertical=center", ratio: "4/5" },
  { src: "/clients/tender-touch/3.jpg", ratio: "4/5" },
  { src: "https://cdn.dribbble.com/userupload/38792503/file/original-9bf97d8735da91ce194ba9bc15733b1f.png?resize=2048x1536&vertical=center", ratio: "4/5" },
  { src: "/clients/dwm/2.jpg", ratio: "4/5" },
  { src: "/clients/marrosh/main.mp4", ratio: "4/5" },
  { src: "https://cdn.dribbble.com/userupload/45119801/file/aee8f3c47fe2aec531b71ba1e1de78ff.jpg?resize=2048x1152&vertical=center", ratio: "4/5" },
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
  // PARALLAX
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
    const columnMap = {};

    items.forEach((el) => {
      const x = el.offsetLeft;
      if (!columnMap[x]) columnMap[x] = [];
      columnMap[x].push(el);
    });

    const colKeys = Object.keys(columnMap).sort((a, b) => a - b);
    const pattern = [-250, 20, -250, 20];

    colKeys.forEach((colX, laneIndex) => {
      const colEls = columnMap[colX];
      const parallax = pattern[laneIndex % 4];

      gsap.set(colEls, { y: parallax * -0.28 });

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
    <div
      ref={rootRef}
      className="relative min-h-screen text-white pt-20 pb-10 overflow-hidden"
    >
      {/* TOP WHITE FADE */}
      <div
  className="pointer-events-none absolute top-0 left-0 w-full h-[200px] z-30"
  style={{
    background:
      "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.0) 100%)",
  }}
/>



      {/* BOTTOM WHITE FADE */}
      <div
  className="pointer-events-none absolute bottom-0 left-0 w-full h-[360px] z-30"
  style={{
    background:
      "linear-gradient(to top, #F3F4F5 0%, #F3F4F5 40%, rgba(243,244,245,0.9) 60%, rgba(243,244,245,0.0) 100%)",
  }}
/>


      <div
        ref={gridRef}
        className={cn(
          "w-full gap-8 pt-10 relative z-10",
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
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.src}
                      className="w-full h-full object-cover"
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
