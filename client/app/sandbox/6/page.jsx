"use client";

import React, { useRef, useEffect } from "react";

/* ===========================
BOSON — Motion Utilities
=========================== */

function useMicroDrift(ref, amplitude = 1.2, speed = 9000) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = null;
    let start = performance.now();

    const loop = (t) => {
      const dt = (t - start) % speed;
      const phase = Math.sin((dt / speed) * Math.PI * 2);
      const y = phase * amplitude;

      el.style.transform = `translateY(${y.toFixed(2)}px)`;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ref, amplitude, speed]);
}

/* ===========================
Mock Data (isi sesuai klien real)
=========================== */

const SOCIAL_WORKS = [
  {
    id: "marrosh-social",
    client: "Marrosh",
    category: "Social Media System",
    img: "/clients/marrosh/main.jpg",
    instagram: "https://instagram.com/marrosh", // ganti ke real IG
  },
  {
    id: "tender-touch-social",
    client: "Tender Touch",
    category: "Social Content Ops",
    img: "/clients/tender-touch/main.jpg",
    instagram: "https://instagram.com/tendertouch", // ganti
  },
  {
    id: "dwm-social",
    client: "DWM",
    category: "Social Campaign Ops",
    img: "/clients/dwm/main.jpg",
    instagram: "https://instagram.com/dwm", // ganti
  },
];

/* ===========================
Card — Boson IG Work Card
=========================== */

function BosonIGCard({ w, offset }) {
  const ref = useRef(null);
  useMicroDrift(ref, 0.8, 10000);

  return (
    <a
      href={w.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div
        ref={ref}
        className="w-full h-[380px] md:h-[480px] rounded-[10px] overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-700"
      >
        <img
          src={w.img}
          alt={w.client}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100"
        />
      </div>

      <div className="mt-4">
        <div className="text-white/90 text-lg font-light uppercase tracking-[0.08em]">
          {w.client}
        </div>
        <div className="text-white/50 text-sm mt-1">{w.category}</div>

        <div className="text-gray-300 text-sm mt-3 underline group-hover:text-white transition">
          View Instagram →
        </div>
      </div>
    </a>
  );
}

/* ===========================
PAGE — FULL PAGE
=========================== */

export default function SocialMediaWorksPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white antialiased pb-40">
      {/* Hero */}
      <section className="w-full px-6 md:px-20 pt-32 pb-20 border-b border-white/[0.06]">
        <div className="max-w-5xl">
          <h1 className="text-[2.8rem] md:text-[4rem] font-extralight tracking-[-0.02em] leading-[1]">
            Social Media <br /> Marketing Works
          </h1>

          <p className="mt-6 text-gray-400 max-w-[60ch] text-lg leading-relaxed">
            Operational evidence — direct links to the ecosystems we build and
            maintain. No mockups, no staging — just living systems in motion.
          </p>
        </div>
      </section>

      {/* IG WORKS GRID */}
      <section className="w-full px-6 md:px-20 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {SOCIAL_WORKS.map((w, i) => (
            <BosonIGCard
              key={w.id}
              w={w}
              offset={i === 1 ? 20 : i === 2 ? -10 : 0} // editorial offset
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-6 md:px-20 mt-32">
        <div className="max-w-4xl text-center mx-auto">
          <div className="text-3xl font-extralight text-white/90">
            Build a Social System
          </div>
          <p className="text-gray-400 mt-4">
            Let’s build a repeatable engine — not just content.
          </p>

          <a
            href="/contact"
            className="inline-block mt-8 px-6 py-3 border border-white/20 uppercase tracking-[0.18em] text-sm hover:bg-white/10 transition"
          >
            Start a Conversation
          </a>
        </div>
      </section>
    </div>
  );
}
