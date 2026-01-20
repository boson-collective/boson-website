"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
const WhoWeAre = dynamic(() => import('../../../components/organisms/WhoWeAre'), { ssr: false });

/* ==========================================================
   PHASE BRIDGE — visual separator
   ========================================================== */
function PhaseBridge({ text = "" }) {
  return (
    <div className="relative w-full h-[12vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_80%)]" />
      <div className="text-[0.7rem] text-white/30 tracking-[0.22em] uppercase relative z-10">
        {text}
      </div>
    </div>
  );
}

/* ==========================================================
   Helper styles (inline for clarity)
   ========================================================== */
// Note: using inline style objects for a couple of tuned gradients/filters
const photoOverlay = {
  backgroundImage:
    "linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.70) 10%,rgba(0,0,0,0.45) 20%,rgba(0,0,0,0.22) 30%,rgba(0,0,0,0.10) 40%,rgba(0,0,0,0.03) 55%,rgba(0,0,0,0) 70%)",
};

const imgNormalizeStyle = {
  filter: "brightness(0.95) contrast(1.04) saturate(0.98)",
  transformOrigin: "center center",
};

/* ==========================================================
   MAIN COMPONENT — Team V6.5 (Refined)
   ========================================================== */
export default function TeamFieldDelta() {
  /* ====================== CORE TEAM (4 people) ====================== */
  const CORE = [
    {
      name: "MAHMOUD TURKOMANY",
      role: "Founder",
      tag: "System",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896205/Mahmoud.png",
    },
    {
      name: "EKATERINA BELIAEVA",
      role: "CHIEF EXECUTIVE OFFICER",
      tag: "Form",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896204/Kate.png",
    },
    {
      name: "BRAHMA SATYA CARYA",
      role: "ACCOUNT MANAGER",
      tag: "Identity",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896209/Brahma.png",
    },
    {
      name: "PINGKAN",
      role: "PRODUCTION AND CREATIVE DIRECTOR",
      tag: "Experience",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896204/PIngkan.png",
    },
  ];
  

  /* ====================== EXTENDED TEAM (9 people) ====================== */
  const EXTENDED = [
    {
      name: "DEWI ICHSANI",
      role: "HUMAN RELATION AND GENERAL AFFAIRS",
      tag: "Content",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896203/Dewi.png",
    },
    {
      name: "DIPSY",
      role: "VIDEOGRAPHER",
      tag: "Video",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896203/Dipsy.png",
    },
    {
      name: "RAHMAT",
      role: "VIDEO EDITOR",
      tag: "Edit",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896206/Rahmat.png",
    },
    {
      name: "LINTANG",
      role: "WEB DEVELOPER",
      tag: "Web",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896208/Lintang.png",
    },
    {
      name: "BAGAS",
      role: "VIDEOGRAPHER",
      tag: "Video",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896202/Arli.png",
    },
    {
      name: "FLAOUDIA",
      role: "SOCIAL MEDIA MANAGER",
      tag: "Social",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896201/Flaudia.png",
    },
    {
      name: "DIMAS",
      role: "GRAPHIC DESIGNER",
      tag: "Design",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896211/Dimas.png",
    },
    {
      name: "BAGAS",
      role: "SOCIAL MEDIA MANAGER",
      tag: "Ops",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896207/Bagas.png",
    },
    {
      name: "FAUZI",
      role: "VIDEO EDITOR",
      tag: "Edit",
      img: "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896204/Fauzi.png",
    },
  ];
  

  const [echo, setEcho] = useState("");
  const [sentEchoes, setSentEchoes] = useState([]);

  const handleEchoSubmit = (e) => {
    e.preventDefault();
    if (echo.trim().length === 0) return;
    setSentEchoes((prev) => [
      ...prev,
      { id: Date.now(), text: echo.trim(), life: 1 },
    ]);
    setEcho("");
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-x-hidden border-t border-white/10">

      {/* BACKGROUND GRID */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "140px 140px",
        }}
      />
      {/* subtle center axis */}
      <div className="fixed left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/8 to-transparent opacity-50 pointer-events-none" />

      <main className="relative z-20 max-w-[1500px] mx-auto">

        {/* === 01. HERO ====================================================== */}
        <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-20 py-20 border-b border-white/8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.028)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-4xl relative z-10">
            <h1 className="text-[3.2rem] md:text-[4.4rem] font-extralight leading-[1.08] tracking-[0.03em] mb-6">
              The Continuum <br /> Becomes Human.
            </h1>
            <p className="text-gray-400 max-w-[70ch] leading-relaxed text-[0.98rem]">
              Founded in 2021 as a response to noise-driven social media, Boson operates through human intention. Our team blends clarity, structure, and emotional intelligence to create systems that perform, resonate, and convert.
            </p>
          </div>
        </section>

        <PhaseBridge text="— the humans behind the system —" />

        {/* ==========================================================
            02. CORE TEAM — zigzag spotlight (4 people) [tightened]
        ========================================================== */}
        <section className="relative w-full px-8 md:px-20 py-36 border-b border-white/8">
          <div className="relative z-10 flex flex-col gap-28">
            {CORE.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                } items-center gap-8 md:gap-12 relative`}
              >
                {/* soft directional glow */}
                <div
                  className={`absolute inset-0 blur-3xl opacity-[0.035] pointer-events-none ${
                    i % 2 === 0
                      ? "bg-gradient-to-r from-[#ffffff26] to-transparent"
                      : "bg-gradient-to-l from-[#ffffff26] to-transparent"
                  }`}
                />

                {/* photo block */}
                <div className="relative w-full md:w-1/2 aspect-[4/5] overflow-hidden border border-white/6 shadow-[0_0_60px_rgba(255,255,255,0.03)]">
                  <img
                    src={m.img}
                    alt={m.name}
                    style={imgNormalizeStyle}
                    className="object-cover w-full h-full opacity-90 transition-transform duration-700 group-hover:scale-[1.01]"
                  />

                  {/* tuned overlay */}
                  <div style={photoOverlay} className="absolute inset-0 pointer-events-none" />

                  {/* tag */}
                  <div
                    className={`absolute bottom-5 ${i % 2 === 0 ? "left-5" : "right-5"} text-[0.65rem] tracking-[0.28em] uppercase text-white/40`}
                  >
                    {m.tag}
                  </div>
                </div>

                {/* text block (tighter proximity) */}
                <div className="md:w-1/2 max-w-[48ch] pl-0 md:pl-8">
                  <h4 className="text-[1.05rem] md:text-xl font-light tracking-[0.14em] uppercase mb-1">
                    {m.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400 tracking-[0.11em] uppercase mb-4">
                    {m.role}
                  </p>
                  {/* optional micro-copy area (commented out for purity) */}
                  {/* <p className="text-[0.9rem] text-gray-400 leading-relaxed">{m.clarity}</p> */}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* subtle separator with reduced prominence */}

        {/* ==========================================================
            03. EXTENDED TEAM — 3×grid layout [calibrated]
        ========================================================== */}
        <section className="relative w-full px-8 md:px-20 py-36 border-b border-white/8">
          <div className="relative z-10 max-w-[1200px] mx-auto">
            {/* subtle section label (very understated) */}
            <div className="text-center mb-10">
              <div className="text-[0.75rem] uppercase tracking-[0.22em] text-white/25">
                the collective
              </div>
            </div>

            {/* grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {EXTENDED.map((m, i) => (
                <div key={i} className="flex flex-col group relative">

                  {/* photo */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/6 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                    <img
                      src={m.img}
                      alt={m.name}
                      style={imgNormalizeStyle}
                      className="object-cover w-full h-full opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div style={photoOverlay} className="absolute inset-0 pointer-events-none" />

                    <div className="absolute bottom-4 left-4 text-[0.6rem] tracking-[0.28em] uppercase text-white/36">
                      {m.tag}
                    </div>
                  </div>

                  {/* text */}
                  <div className="mt-5">
                    <h4 className="text-[1rem] font-light tracking-[0.14em] uppercase mb-1">
                      {m.name}
                    </h4>
                    <p className="text-[0.72rem] text-gray-400 tracking-[0.11em] uppercase">
                      {m.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* slight PhaseBridge for breathing (empty) */}
        <PhaseBridge text="" />

        {/* === 04. OUTRO ====================================================== */}
        <section className="py-36 flex flex-col items-center justify-center bg-[#040404] border-t border-white/10 relative overflow-hidden">
          <div className="text-center max-w-xl relative z-10">
            <h3 className="text-3xl md:text-4xl font-light tracking-[0.22em] mb-3">
              The Continuum Keeps Listening
            </h3>
            <p className="text-sm text-gray-400 mb-8 max-w-[60ch] mx-auto">
              Every dialogue reshapes the system. If resonance is sensed — it will find you back.
            </p>
            <a
              href="/contact"
              className="inline-block uppercase tracking-[0.28em] text-xs text-gray-300 hover:text-white transition"
            >
              Transmit Intention
            </a>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_80%)] opacity-[0.06]" />
        </section>
      </main>
    </div>
  );
}
