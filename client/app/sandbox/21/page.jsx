"use client";
import React, { useEffect, useRef } from "react";

/* ============================================================================
   V4.3.7 — FULL PAGE (Calm Editorial Mobile)
   - Mobile-first: Calm editorial (A)
   - Fixed mobile stability: responsive Tailwind utilities (no tailwind overrides)
   - Collage stream collapses to single column on mobile (grid-cols-1 md:grid-cols-3)
   - Portrait / Hero heights responsive (mobile small, desktop large)
   - Offsets collapse on mobile via responsive classes (md:mt-[60px] mt-0)
   - Collage item heights responsive via class mapping (mobile small, desktop tall)
   - Subtle eased micro-motion using requestAnimationFrame + easeOutQuad
   - IntersectionObserver reveal for cs-item
   ============================================================================ */

/* ------------------------
   Helpers
   ------------------------ */
function easeOutQuad(t) {
  return t * (2 - t);
}

function distributeUneven(imgs) {
  const n = imgs.length;
  const base = Math.floor(n / 3);
  const rem = n % 3;
  const order = rem === 1 ? [0, 1, 2] : rem === 2 ? [1, 2, 0] : [2, 0, 1];
  const counts = [base, base, base];
  for (let i = 0; i < rem; i++) counts[order[i]]++;
  const cols = [[], [], []];
  let idx = 0;
  for (let c = 0; c < 3; c++) {
    for (let k = 0; k < counts[c]; k++) {
      cols[c].push(imgs[idx++] ?? imgs[imgs.length - 1]);
    }
  }
  return cols;
}

/* ------------------------
   Data (sample assets)
   ------------------------ */
const WORKS = [
  {
    id: "tender-touch",
    hero: true,
    title: "Tender Touch",
    subtitle: "Digital brand renewal & social media system.",
    location: "Bali",
    year: "2025",
    category: "Brand Identity / Motion / Photography",
    img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899599/tender-touch-main.jpg",
    collage: [
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899598/tender-touch-2.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899598/tender-touch-3.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899597/tender-touch-4.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899597/tender-touch-5.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899597/tender-touch-6.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899597/tender-touch-7.jpg",
    ],
  },
  {
    id: "marrosh",
    hero: false,
    title: "Marrosh",
    subtitle: "Brand identity & packaging rollout.",
    location: "Riyadh",
    year: "2024",
    category: "Brand Identity / System Design",
    img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898518/marroosh-main.jpg",
    collage: [
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898520/marroosh-9.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898520/marroosh-3.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898519/marroosh-4.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898519/marroosh-2.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898519/marroosh-6.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768898519/marroosh-8.jpg",
    ],
  },
  {
    id: "dwm",
    hero: false,
    title: "Dream Wealth Management",
    subtitle: "Campaign visual system & content production.",
    location: "Bali",
    year: "2024",
    category: "Campaign / Art Direction",
    img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900188/dwm-main.jpg",
    collage: [
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900186/dwm-3.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900188/dwm-4.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900187/dwm-2.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900187/dwm-7.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900186/dwm-5.jpg",
      "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768900186/dwm-8.jpg",
    ],
  },
];

const CLIENT_LOGOS = [
  "arabian-bronze.png",
  "chi.png",
  "dwm.png",
  "equilibrium.png",
  "marrosh.png",
  "milos.png",
  "tender-touch.png",
  "stylish-kitchen.png",
  "sunny-village.png",
  "psr.png",
  "isbt.png",
  "linea.png",
];

/* ============================================================================
   Phase divider
   ============================================================================ */
function PhaseBridge({ text }) {
  return (
    <div className="relative w-full h-[10vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_80%)]" />
      <div className="text-[0.7rem] text-gray-500 tracking-[0.18em] uppercase relative z-10">
        {text}
      </div>
    </div>
  );
}

/* ============================================================================
   Main component V4.3.7
   ============================================================================ */
export default function WorksV437() {
  const streamMap = useRef(new Map());
  const ticking = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-inview");
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".cs-item").forEach((it) => obs.observe(it));

    document.querySelectorAll(".collage-stream").forEach((c) => {
      const cols = c.querySelectorAll(".cs-col");
      streamMap.current.set(c, { cols, bounds: null });
    });

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          streamMap.current.forEach((value, container) => {
            const rect = container.getBoundingClientRect();
            value.bounds = rect;
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const raw =
                (window.innerHeight - rect.top) /
                (window.innerHeight + rect.height);
              const clamped = Math.min(Math.max(raw, 0), 1);
              const p = easeOutQuad(clamped);
              const base = 0.14;
              value.cols.forEach((col, idx) => {
                const colFactor = idx === 0 ? 1.02 : idx === 1 ? 0.78 : 1.12;
                const translateY = Math.round(
                  (p - 0.5) * -60 * base * colFactor
                );
                col.style.transform = `translateY(${translateY}px)`;
              });
            }
          });
          ticking.current = false;
        });
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      streamMap.current.clear();
    };
  }, []);

  /* responsive height classes for collage items — mobile first (calm editorial) */
  const heightClassPattern = [
    "h-[150px] md:h-[340px]", // Tall on desktop, small on mobile
    "h-[140px] md:h-[220px]",
    "h-[160px] md:h-[280px]",
    "h-[160px] md:h-[280px]",
    "h-[150px] md:h-[340px]",
    "h-[140px] md:h-[220px]",
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-x-hidden border-t border-white/10">
      {/* subtle grid */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "140px 140px",
        }}
      />

      {/* axis */}
      <div className="fixed left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />

      <main className="relative z-20 max-w-[1500px] mx-auto">
        {/* HERO INTRO */}
        <section className="min-h-[92vh] flex flex-col justify-center items-start px-6 sm:px-8 md:px-20 py-20 border-b border-white/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.028)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-4xl relative z-10">
            <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[4.6rem] font-extralight leading-[1.06] tracking-[0.02em] mb-4">
              Works.
              <br /> Structured for Clarity.
            </h1>
            <p className="text-gray-400 max-w-[70ch] leading-relaxed text-[0.95rem]">
              Every project is a system with intention — designed, executed, and
              maintained with clarity. Not noise. Each work reinforces how Boson
              operates: calm, precise, and conversion-driven.
            </p>
          </div>
        </section>

        <PhaseBridge text="Systemic Workflows — Visible in Output" />


        {/* WORKS HEADER */}
        <section className="relative w-full px-6 sm:px-8 md:px-24 pt-[12vh] pb-[8vh] border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)] opacity-36 pointer-events-none" />
          <div className="text-center mb-[7vh] relative z-10">
            <h2 className="text-[2rem] sm:text-[2.7rem] md:text-[3rem] font-light tracking-[0.12em] uppercase text-white/90">
              Selected Works
            </h2>
            <p className="text-gray-500 text-sm mt-4 max-w-[60ch] mx-auto leading-relaxed">
              Evidence of Boson’s clarity-driven workflows across identity,
              social media, and digital experience.
            </p>
          </div>

          {/* HERO PROJECT — responsive heights mobile-first */}
          <div className="max-w-[1440px] mx-auto px-4 mb-20">
            <article className="relative flex flex-col gap-6">
              <div className="relative border border-white/[0.08] bg-white/[0.02] rounded-[6px] overflow-hidden">
                <div className="w-full h-[520px] md:h-[920px] bg-black">
                  <img
                    src={WORKS[0].img}
                    alt={WORKS[0].title}
                    className="object-cover w-full h-full opacity-96 transition-opacity duration-700"
                    draggable={false}
                    loading="eager"
                  />
                </div>
              </div>

              {/* hero collage: restrained 3 cards */}
              <div className="flex gap-8 mt-4">
                {WORKS[0].collage.slice(0, 3).map((s, i) => (
                  <div
                    key={i}
                    className="w-[170px] sm:w-[200px] md:w-[240px] h-[210px] sm:h-[260px] md:h-[320px] rounded-[5px] overflow-hidden bg-white/5 border border-white/[0.06]"
                  >
                    <img
                      src={s}
                      alt={`hero-collage-${i}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <div className="max-w-[880px] mt-4">
                <h3 className="text-[1.55rem] sm:text-[1.8rem] md:text-[1.95rem] font-light tracking-[0.03em] uppercase">
                  {WORKS[0].title}
                </h3>
                <p className="text-[1rem] sm:text-[1.05rem] text-white/85 leading-relaxed mt-3">
                  {WORKS[0].subtitle}
                </p>
                <div className="flex items-center gap-3 text-[0.85rem] text-white/50 uppercase mt-4 tracking-[0.04em]">
                  <div>{WORKS[0].location}</div>
                  <div className="opacity-40">—</div>
                  <div>{WORKS[0].year}</div>
                  <div className="ml-3 text-[0.75rem] text-white/45 tracking-[0.3em]">
                    {WORKS[0].category}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* EDITORIAL STACK (portrait reduced, description close, calm breathing) */}
          <div className="relative z-20 max-w-[900px] mx-auto flex flex-col gap-[22vh]">
            {WORKS.slice(1).map((work, idx) => (
              <article
                key={work.id}
                className={`relative flex flex-col gap-6 ${
                  idx % 2 === 1 ? "md:pl-[6vw] pl-0" : "md:pr-[4vw] pr-0"
                }`}
              >
                {/* portrait responsive: mobile 420, desktop 580 */}
                <div className="relative border border-white/[0.08] bg-white/[0.02] rounded-[6px] overflow-hidden">
                  <div className="w-full h-[420px] md:h-[580px] bg-black">
                    <img
                      src={work.img}
                      alt={work.title}
                      className="object-cover w-full h-full opacity-85 transition-opacity duration-900"
                      draggable={false}
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Description CLOSE to portrait */}
                <div className="max-w-[720px] mt-3">
                  <h3 className="text-[1.25rem] sm:text-[1.4rem] md:text-[1.5rem] font-light tracking-[0.04em] uppercase">
                    {work.title}
                  </h3>
                  <p className="text-[0.98rem] text-white/80 leading-relaxed mt-2">
                    {work.subtitle}
                  </p>
                  <div className="text-[0.82rem] text-white/50 uppercase mt-3 tracking-[0.04em]">
                    {work.location}, {work.year}
                  </div>
                  <div className="text-[0.7rem] uppercase tracking-[0.28em] text-white/45 mt-2">
                    {work.category}
                  </div>
                </div>

                {/* breathing tiny spacer */}
                <div style={{ height: 18 }} />

                {/* COLLAGE STREAM — MOBILE-FIRST (grid-cols-1 md:grid-cols-3) */}
                <div
                  className="collage-stream relative w-full mt-2 px-1"
                  role="list"
                  aria-label={`${work.title} collage stream`}
                >
                  <div
                    className="cs-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
                    style={{
                      alignItems: "start",
                      paddingTop: 40,
                      paddingBottom: 56,
                    }}
                  >
                    {(() => {
                      const cols = distributeUneven(work.collage);
                      const colOffsets = ["0px", "60px", "25px"]; // md offsets — mobile will ignore translate via classes
                      return cols.map((colImgs, colIndex) => (
                        <div
                          key={colIndex}
                          className="cs-col relative md:mt-[0px]"
                          style={{
                            marginTop: colOffsets[colIndex],
                            transition:
                              "transform 420ms cubic-bezier(.22,.9,.32,1)",
                            willChange: "transform",
                          }}
                        >
                          {colImgs.map((src, i2) => {
                            const patternClass =
                              heightClassPattern[
                                i2 % heightClassPattern.length
                              ] || "h-[150px] md:h-[220px]";
                            return (
                              <div
                                key={i2}
                                className={`cs-item overflow-hidden rounded-[4px] bg-white/5 border border-white/[0.05] mb-6 ${patternClass}`}
                                style={{
                                  transition:
                                    "opacity 720ms ease, transform 720ms ease-out",
                                  transform: "translateY(18px)",
                                  willChange: "transform, opacity",
                                }}
                                role="listitem"
                              >
                                <img
                                  src={src}
                                  alt={`${work.title} collage ${i2 + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* small bottom spacer */}
                <div style={{ height: 22 }} />
              </article>
            ))}
          </div>
        </section>

        {/* soft landing divider */}
        <div className="h-[12vh] w-full bg-[#050505] flex items-center justify-center">
          <div className="w-full h-px bg-white/[0.06]" />
        </div>

        {/* ============================================================================
   TRUST GRID — V4.3.8.1 Balanced Wave Grid (FIXED OFFSETS)
   ============================================================================ */}
        <section className="relative w-full px-8 md:px-24 py-48 border-b border-white/10 overflow-hidden">
          {/* Subtle radial background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)] opacity-[0.20] pointer-events-none" />

          {/* Section Header */}
          <div className="text-center mb-24 relative z-10">
            <h3 className="text-[2.6rem] sm:text-[3rem] md:text-[3.4rem] font-extralight tracking-[0.02em] leading-tight text-white/90 mb-3">
              Brands We Work With
            </h3>
            <p className="text-gray-500 text-[0.9rem] max-w-[60ch] mx-auto leading-relaxed">
              A curated selection of partners aligned with Boson’s
              clarity-driven approach — long-term systems, structured identity,
              and calm brand presence.
            </p>
          </div>

          {/* Balanced Wave Grid (8 curated logos) */}
          <div className="relative z-20 max-w-[1100px] mx-auto flex flex-col items-center ">
            {/* ROW 1 — crest */}
            <div className="flex justify-center items-center gap-20 md:gap-28 translate-y-[0px]">
              {["marrosh.png", "tender-touch.png", "chi.png"].map((logo, i) => (
                <div
                  key={i}
                  className="relative group w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[170px] flex items-center justify-center"
                >
                  <div className="absolute inset-0 blur-2xl bg-white/[0.08] rounded-full scale-150 opacity-20 group-hover:opacity-40 transition duration-700" />
                  <img
                    src={`/clients/${logo}`}
                    alt={logo}
                    className="object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-700"
                  />
                </div>
              ))}
            </div>

            {/* ROW 2 — trough */}
            <div className="flex justify-center items-center gap-28 md:gap-36 ">
              {["equilibrium.png", "psr.png"].map((logo, i) => (
                <div
                  key={i}
                  className="relative group w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[170px] flex items-center justify-center"
                >
                  <div className="absolute inset-0 blur-2xl bg-white/[0.08] rounded-full scale-150 opacity-20 group-hover:opacity-40 transition duration-700" />
                  <img
                    src={`/clients/${logo}`}
                    alt={logo}
                    className="object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-700"
                  />
                </div>
              ))}
            </div>

            {/* ROW 3 — crest' mirror */}
            <div className="flex justify-center items-center gap-20 md:gap-28">
              {["dwm.png", "stylish-kitchen.png", "sunny-village.png"].map(
                (logo, i) => (
                  <div
                    key={i}
                    className="relative group w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[170px] flex items-center justify-center"
                  >
                    <div className="absolute inset-0 blur-2xl bg-white/[0.08] rounded-full scale-150 opacity-20 group-hover:opacity-40 transition duration-700" />
                    <img
                      src={`/clients/${logo}`}
                      alt={logo}
                      className="object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-700"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </section>  

        {/* CTA */}
        <section className="py-36 flex flex-col items-center justify-center bg-[#040404] border-t border-white/10 relative overflow-hidden text-center">
          <div className="h-px w-28 bg-white/10 mb-12" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.18em] mb-6">
            Begin a Project.
          </h3>
          <p className="text-sm text-gray-400 mb-8 max-w-[60ch] mx-auto leading-relaxed">
            Share your objectives. Boson will transform them into a structured,
            clear, and scalable system.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/contact"
              className="border border-white/20 px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-white/10 transition"
            >
              Start a Conversation
            </a>
            <a
              href="/method"
              className="text-xs uppercase tracking-[0.25em] text-gray-400 hover:text-white transition"
            >
              View Method →
            </a>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_80%)] opacity-[0.06]" />
        </section>
 
      </main>

      {/* minimal global styles for reveal; responsive handled with Tailwind classes above */}
      <style jsx>{`
        .cs-item {
          opacity: 0;
          transform: translateY(18px);
        }
        .cs-item.is-inview {
          opacity: 1;
          transform: translateY(0);
        }
        /* ensure images never overflow container */
        img {
          display: block;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
