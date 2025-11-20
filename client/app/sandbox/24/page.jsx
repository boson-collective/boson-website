"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BOSON — WHAT WE DO V1
 * - Full page React component (paste-ready for Next.js + Tailwind)
 * - Layer 1 = Boson editorial overview (structural, calm)
 * - Layer 2 = Expandable service blocks (boss-provided content)
 * - VisualSamples support image or short video clip (10s)
 *
 * Guidelines applied:
 * - Dark, editorial, calm aesthetic (#050505)
 * - Large spacing, editorial typography
 * - Motion = subtle, non-dopamine (fade, slow height transitions)
 * - CTA = "Start a Project" (calm & conversion-focused)
 *
 * Copy / assets are placeholders — replace paths with real assets.
 */

/* ===========================
   Sample assets & data
   =========================== */
const SERVICE_DATA = [
  {
    id: "social",
    title: "Social Media Marketing",
    intro:
      "Strategy-first social media: content systems, editorial calendars, performance loops, and paid amplification that compound over time.",
    bullets: [
      "Strategy & positioning",
      "Content creation (static + motion)",
      "Copywriting & tone systems",
      "Paid campaigns & optimization",
    ],
    visuals: [
      { type: "img", src: "/samples/social-1.jpg", alt: "Social sample 1" },
      { type: "img", src: "/samples/social-2.jpg", alt: "Social sample 2" },
      // optional 10s clip:
      { type: "video", src: "/samples/social-clip.mp4", alt: "10s reel" },
    ],
  },
  {
    id: "branding",
    title: "Branding & Design",
    intro:
      "Identity systems that scale — logo, core system, rollout guidelines and assets that keep your brand coherent at every touchpoint.",
    bullets: [
      "Logo & system design",
      "Visual language & palette",
      "Guidelines & rollout playbooks",
    ],
    visuals: [
      { type: "img", src: "/samples/branding-1.jpg", alt: "Branding sample" },
      { type: "img", src: "/samples/branding-2.jpg", alt: "Branding sample 2" },
    ],
  },
  {
    id: "photo-video",
    title: "Photo & Video Production",
    intro:
      "Production engines for content: commercial, lifestyle, aerial. Scaled production pipelines with clear shot-lists and reuse frameworks.",
    bullets: ["Aerial", "Commercial", "Lifestyle", "Short-form reels"],
    visuals: [
      {
        type: "video",
        src: "/samples/production-clip.mp4",
        alt: "Production reel",
      },
      {
        type: "img",
        src: "/samples/production-1.jpg",
        alt: "Production still",
      },
    ],
  },
  {
    id: "web",
    title: "Web Design & Development",
    intro:
      "Interfaces built for behavior and conversion: UX, e-commerce, accessibility and performance optimization as standard.",
    bullets: [
      "UX strategy",
      "E-commerce",
      "Performance & SEO",
      "Component system",
    ],
    visuals: [
      { type: "img", src: "/samples/web-1.jpg", alt: "Web sample" },
      { type: "img", src: "/samples/web-2.jpg", alt: "Web sample 2" },
    ],
  },
];

/* ===========================
   Utilities
   =========================== */
function useLockBodyScroll(enabled) {
  useEffect(() => {
    const original = document.body.style.overflow;
    if (enabled) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [enabled]);
}

/* ===========================
   Layer 1 — Boson Overview
   =========================== */
function LayerOneOverview() {
  return (
    <section
      aria-labelledby="what-we-do-title"
      className="w-full text-white py-28 px-6 md:px-20 border-t border-white/6"
    >
      {" "}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 items-start">
        {" "}
        {/* left editorial */}{" "}
        <div className="col-span-12 lg:col-span-8">
          {" "}
          <h2
            id="what-we-do-title"
            className="text-[2.6rem] md:text-[3.6rem] leading-[1.02] font-extralight tracking-[-0.015em] text-white mb-6"
          >
            {" "}
            Let brands live longer than campaigns{" "}
          </h2>{" "}
          <p className="text-white/70 max-w-[56ch] leading-relaxed">
            {" "}
            Boson is about structure first. We map the machine — then we build
            the outputs that live on it. Strategy, design, production and
            platform engineering connected into repeatable processes that scale.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}

/* ===========================
   Visual Sample — image or 10s video
   =========================== */
function VisualSample({ item }) {
  if (!item) return null;

  // Small, editorial framed sample
  return (
    <div className="w-full md:w-[240px] h-[140px] md:h-[160px] rounded-sm overflow-hidden border border-white/[0.04] bg-white/[0.02]">
      {item.type === "video" ? (
        <video
          src={item.src}
          controls
          muted
          playsInline
          loop
          preload="metadata"
          className="w-full h-full object-cover"
          title={item.alt}
        />
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

/* ===========================
   Service Item (expandable)
   =========================== */
function ServiceItem({ data, isOpen, onToggle }) {
  const contentRef = useRef(null);

  // compute height for smooth animate
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setHeight(isOpen ? el.scrollHeight : 0);
  }, [isOpen, data]);

  return (
    <div className="border-t border-white/6 py-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <button
            onClick={() => onToggle(data.id)}
            aria-expanded={isOpen}
            className="text-left w-full"
          >
            <div className="flex items-center gap-6">
              <div className="text-[1.25rem] md:text-[1.6rem] font-extralight text-white">
                {data.title}
              </div>
              <div className="text-sm text-white/60 hidden md:block">
                {isOpen ? "" : ""}
              </div>
            </div>
          </button>
        </div>

        <div>
          <a
            href="/contact"
            className="inline-flex items-center px-4 py-2 border border-white/10 text-sm tracking-[0.12em] text-white/90 hover:bg-white/6 transition"
          >
            Start a Project
          </a>
        </div>
      </div>

      {/* Animated expand area */}
      <div
        aria-hidden={!isOpen}
        className="overflow-hidden transition-all duration-500"
        style={{ height: `${height}px` }}
      >
        <div
          ref={contentRef}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Left: intro + bullets */}
          <div className="md:col-span-2 text-white/80">
            <p className="mb-4 max-w-[60ch] leading-relaxed">{data.intro}</p>

            <ul className="space-y-2 list-none">
              {data.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-3 text-white/70">
                  <span className="mt-1 text-white/40">—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: visual samples (stacked) */}
          <div className="md:col-span-1 flex flex-col gap-4">
            {data.visuals.slice(0, 3).map((v, i) => (
              <VisualSample key={i} item={v} />
            ))}
          </div>
        </div>

        {/* Optional extended proof strip */}
        <div className="mt-8">
          <div className="text-sm text-white/60 mb-3">Selected samples</div>

          <div className="flex gap-4 overflow-x-auto py-2">
            {data.visuals.map((v, i) => (
              <div
                key={i}
                className="min-w-[220px] h-[120px] rounded-sm overflow-hidden border border-white/[0.04] bg-white/[0.02] flex-shrink-0"
              >
                {v.type === "video" ? (
                  <video
                    src={v.src}
                    playsInline
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={v.src}
                    alt={v.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   Layer 2 — Services List (accordion)
   =========================== */
function ServicesList({ services }) {
  const [openId, setOpenId] = useState(null);

  // optional: lock body scroll when any expanded on small screens
  useLockBodyScroll(!!openId);

  const toggle = (id) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <section
      id="services"
      className="w-full  text-white py-20 px-6 md:px-20 border-t border-white/6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/60 mb-4">
              Our Services
            </div>
            <h2 className="text-3xl md:text-[2.5rem] font-extralight tracking-[-0.015em] text-white mb-3">
              Direct, measurable, built to repeat.
            </h2>
            <p className="text-white/55 max-w-[56ch] text-sm leading-relaxed">
              Each service is a module in a larger system. You can start with
              one, or connect multiple into a full operating stack.
            </p>
          </div>
        </div>
        <div className="divide-y divide-white/6">
          {services.map((s) => (
            <ServiceItem
              key={s.id}
              data={s}
              isOpen={openId === s.id}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   MAIN PAGE EXPORT
   =========================== */
export default function WhatWeDoPage() {
  return (
    <main className="min-h-screen antialiased text-white">
      {/* Layer 1 — Boson overview */}
      <LayerOneOverview />

      {/* Layer 2 — Services (boss-provided content as expandable blocks) */}
      <ServicesList services={SERVICE_DATA} />
    </main>
  );
}
