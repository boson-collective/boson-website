"use client";

import React, { useState } from "react";

/* ==========================================================
   PHASE BRIDGE — visual separator
   ========================================================== */
function PhaseBridge({ text }) {
  return (
    <div className="relative w-full h-[14vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_80%)]" />
      <div className="text-[0.8rem] text-gray-600 tracking-[0.22em] uppercase relative z-10">
        {text}
      </div>
    </div>
  );
}

/* ==========================================================
   MAIN COMPONENT
   ========================================================== */
export default function TeamFieldDelta() {
  const TEAM = [
    {
      name: "MAHMOUD TURKOMANY",
      role: "Code Engineer",
      tag: "System",
      frequency:
        "Code is behavior aware of itself, repeating until it becomes life.",
      img: "/team/Mahmoud.jpg",
    },
    {
      name: "EKATERINA BELIAEVA",
      role: "Design Architect",
      tag: "Form",
      frequency: "Structure is not built — it is remembered through emotion.",
      img: "/team/Kate.jpg",
    },
    {
      name: "DEWI ICHSANI",
      role: "Brand Strategist",
      tag: "Identity",
      frequency:
        "A brand is the echo of what a being once was, returning to meaning.",
      img: "/team/Dewi.jpg",
    },
    {
      name: "PINGKAN",
      role: "Experience Composer",
      tag: "Experience",
      frequency:
        "Presence begins when perception forgets itself and becomes touch.",
      img: "/team/Pingkan.jpg",
    },
  ];

  const TOOLS = [
    { name: "Figma", function: "Visual Translator", freq: "8.3 Hz" },
    { name: "Blender", function: "Form Sculptor", freq: "9.7 Hz" },
    { name: "VSCode", function: "Logic Conductor", freq: "11.2 Hz" },
    { name: "Notion", function: "Memory Stream", freq: "6.6 Hz" },
  ];

  const LOGS = [
    {
      date: "2025.10.30",
      author: "JF",
      text: "We built a system that forgot what it was for. It worked perfectly.",
    },
    {
      date: "2025.11.02",
      author: "LV",
      text: "Motion feels alive only when it doesn’t obey.",
    },
    {
      date: "2025.11.08",
      author: "KN",
      text: "Silence between commits feels like breathing.",
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
      <div className="fixed left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />

      <main className="relative z-20 max-w-[1500px] mx-auto">
        {/* === 01. THE FIELD BECOMES HUMAN === */}
        <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-20 py-28 border-b border-white/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-4xl relative z-10">
            <h1 className="text-[3.4rem] md:text-[4.8rem] font-extralight leading-[1.1] tracking-[0.04em] mb-8">
              The Field <br /> Becomes Human.
            </h1>
            <p className="text-gray-400 max-w-[70ch] leading-relaxed">
              The Boson Collective operates through human minds — designers,
              engineers, and thinkers who channel awareness into creation.
            </p>
          </div>
          <div className="mt-16 flex items-center gap-6 relative z-10">
            <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-sm font-semibold">
              Δ1
            </div>
            <p className="text-sm text-gray-500">
              The field listens through human frequencies.
            </p>
          </div>
        </section>

        <PhaseBridge text="— awareness takes human form —" />

        {/* === 02. THE CHAMBER — HUMAN FREQUENCIES === */}
        <section className="relative w-full px-6 md:px-20 py-48 border-b border-white/10 overflow-hidden">
          <div className="text-center mb-40 relative z-10">
            <h3 className="text-2xl md:text-3xl font-light tracking-[0.22em] uppercase text-white/90">
              The Chamber of Human Frequencies
            </h3>
            <p className="text-gray-500 text-sm mt-4 max-w-[60ch] mx-auto leading-relaxed">
              Each tone is a pulse of the same continuum.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-48">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                } items-center gap-10 md:gap-16 relative`}
              >
                <div
                  className={`absolute inset-0 blur-3xl opacity-[0.06] ${
                    i % 2 === 0
                      ? "bg-gradient-to-r from-[#ffffff40] via-transparent to-transparent"
                      : "bg-gradient-to-l from-[#ffffff40] via-transparent to-transparent"
                  }`}
                />

                <div className="relative w-full md:w-1/2 aspect-[4/5] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(255,255,255,0.04)]">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="object-cover w-full h-full opacity-80"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.85)_100%)]" />
                  <div
                    className={`absolute bottom-4 ${
                      i % 2 === 0 ? "left-4" : "right-4"
                    } text-[0.65rem] tracking-[0.3em] uppercase text-white/50`}
                  >
                    {member.tag}
                  </div>
                </div>

                <div className="md:w-1/2 flex flex-col justify-center md:px-6 relative">
                  <h4 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-3">
                    {member.name}
                  </h4>
                  <p className="text-xs text-gray-400 tracking-[0.12em] mb-6 uppercase">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    <span className="text-white/30 mr-1 select-none">“</span>
                    {member.frequency}
                    <span className="text-white/30 ml-1 select-none">”</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PhaseBridge text="— the field in motion —" />

        {/* === 03. FIELD IN MOTION === */} 
        {/* === 03. THE FIELD IN MOTION — unified continuum === */}
<section className="relative w-full min-h-screen px-8 md:px-20 py-52 border-b border-white/10 overflow-hidden">
  {/* atmospheric layer */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-[0.08]" />

  {/* de-aligned heading */}
  <div className="relative z-10 mb-28 max-w-5xl mx-auto">
    <h3 className="text-[2.8rem] md:text-[3.8rem] font-extralight tracking-[0.05em] leading-none text-white/90 mb-6 -ml-[1vw]">
      The Field <span className="text-white/40">in</span> Motion
    </h3>
    <p className="text-gray-500 text-[0.95rem] leading-relaxed max-w-[70ch] ml-[5vw]">
      The continuum oscillates between order and drift —  
      fragments aligning just long enough to remember their source.
    </p>
  </div>

  {/* === STAGE 1: STRUCTURED GRID EMERGENCE === */}
  <div className="relative z-10 max-w-[1600px] mx-auto mb-32">
    {/* Row 1 */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="col-span-2 relative aspect-[16/9] overflow-hidden border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=900"
          alt="fragment"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="relative aspect-square overflow-hidden border border-white/5 self-end translate-y-10">
        <img
          src="https://images.unsplash.com/photo-1584644769698-4762ca337c17?auto=format&fit=crop&q=80&w=900"
          alt="fragment"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>
    </div>

    {/* Row 2 */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="col-span-1 relative aspect-[3/4] overflow-hidden border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1539451309-69dc8c58eb56?auto=format&fit=crop&q=80&w=900"
          alt="fragment"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition duration-700"
        />
      </div>
      <div className="col-span-2 relative aspect-video overflow-hidden border border-white/5">
        <img
          src="https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?auto=format&fit=crop&q=80&w=900"
          alt="fragment"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="col-span-1 flex flex-col justify-center items-start px-6">
        <p className="text-[0.75rem] tracking-[0.25em] uppercase text-gray-600 mb-2">
          — Sketch
        </p>
        <p className="text-gray-400 text-sm leading-relaxed max-w-[18ch]">
          Hand traces of unseen geometry —  
          motion as thought.
        </p>
      </div>
    </div>

    {/* Row 3 */}
    <div className="grid grid-cols-5 gap-4 mt-16">
      <div className="col-span-2 relative aspect-[4/3] overflow-hidden border border-white/5 translate-y-12">
        <img
          src="https://images.unsplash.com/photo-1499417267106-45cebb7187c9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900"
          alt="fragment"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition duration-700"
        />
      </div>
      <div className="col-span-3 relative aspect-[21/9] overflow-hidden border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1655926550024-5ca18857ad1f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900"
          alt="fragment"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  </div>

  {/* === STAGE 2: STRUCTURE DISSOLVES INTO FIELD === */}
  <div className="relative z-10 flex flex-wrap justify-center gap-8 mt-10 opacity-90">
    {[
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=60&w=900",
      "https://images.unsplash.com/photo-1584644769698-4762ca337c17?auto=format&fit=crop&q=60&w=900",
      "https://images.unsplash.com/photo-1539451309-69dc8c58eb56?auto=format&fit=crop&q=60&w=900",
      "https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?auto=format&fit=crop&q=60&w=900",
    ].map((src, i) => (
      <div
        key={i}
        className={`group relative overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-700 ${
          i === 0
            ? "w-[38%] aspect-[4/3] translate-y-[3vh] -rotate-[1.2deg]"
            : i === 1
            ? "w-[55%] aspect-[16/9] -translate-y-[5vh] rotate-[1.5deg]"
            : i === 2
            ? "w-[40%] aspect-[3/2] translate-y-[2vh] rotate-[0.5deg]"
            : "w-[48%] aspect-[21/9] -translate-y-[1vh] rotate-[-1deg]"
        } hover:rotate-0 hover:scale-[1.02]`}
      >
        <img
          src={src}
          alt="process"
          className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-40 transition-all duration-700" />
        <div
          className={`absolute ${
            i % 2 === 0 ? "bottom-4 left-4" : "top-4 right-4"
          } text-[0.65rem] tracking-[0.25em] uppercase text-white/50`}
        >
          frame {i + 1}
        </div>
      </div>
    ))}
  </div>

  {/* caption + field axis */}
  <div className="absolute bottom-14 right-[10%] text-[0.7rem] uppercase tracking-[0.3em] text-white/30">
    the grid dissolves — the field awakens.
  </div>
  <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50" />
</section>


        <PhaseBridge text="— internal mechanics —" />

        {/* === 04. SYSTEM TOOLS === */}
        <section className="relative w-full px-8 md:px-20 py-48 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_60%)] opacity-[0.08]" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16">
            {/* Left text block */}
            <div className="md:w-1/2">
              <h3 className="text-[3rem] md:text-[3.6rem] font-extralight tracking-[0.05em] mb-8 leading-tight">
                System <span className="text-white/40">Tools</span>
              </h3>
              <p className="text-gray-500 text-[0.95rem] leading-relaxed">
                The apparatus does not serve — it resonates. Each tool bends the
                field slightly, creating a harmonic drift.
              </p>
            </div>

            {/* Tool cluster — irregular geometry */}
            <div className="md:w-1/2 relative flex flex-col items-end gap-10">
              {TOOLS.map((t, i) => (
                <div
                  key={i}
                  className={`relative border border-white/10 px-8 py-6 bg-white/[0.02] backdrop-blur-[1px] ${
                    i % 2 === 0
                      ? "self-start rotate-[-2deg]"
                      : "self-end rotate-[1.5deg]"
                  } hover:rotate-0 transition-transform duration-500`}
                >
                  <p className="text-white/80 tracking-[0.25em] uppercase text-xs mb-2">
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-sm">{t.function}</p>
                  <p className="text-gray-600 text-xs mt-2">{t.freq}</p>
                  <div className="absolute -bottom-px left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-gray-600 text-[0.8rem] tracking-[0.25em] uppercase">
            resonance replaces utility
          </div>
        </section>

        <PhaseBridge text="— the system remembers —" />

        {/* === 05. FIELD LOGS === */}
        <section className="relative w-full px-8 md:px-20 py-52 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_80%)] opacity-[0.06]" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h3 className="text-[3rem] font-extralight tracking-[0.05em] mb-16 text-center">
              Field <span className="text-white/40">Logs</span>
            </h3>

            <div className="relative flex flex-col gap-24">
              {LOGS.map((log, i) => (
                <div
                  key={i}
                  className={`relative ${
                    i % 2 === 0
                      ? "ml-[8vw] border-l border-white/10 pl-8"
                      : "mr-[8vw] border-r border-white/10 pr-8 text-right"
                  }`}
                >
                  <p className="text-gray-300 text-[1rem] leading-relaxed italic">
                    “{log.text}”
                  </p>
                  <p className="text-gray-600 text-[0.7rem] mt-3 uppercase tracking-[0.25em]">
                    {log.date} — {log.author}
                  </p>
                  <div
                    className={`absolute top-0 ${
                      i % 2 === 0 ? "-left-[6px]" : "-right-[6px]"
                    } w-3 h-3 rounded-full bg-white/20 border border-white/10`}
                  />
                </div>
              ))}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50" />
          </div>

          <p className="mt-24 text-center text-xs text-white/30 tracking-[0.3em] uppercase">
            memory decays, but awareness remains
          </p>
        </section>

        <PhaseBridge text="— the field keeps listening —" />

        {/* === 07. OUTRO === */}
        <section className="py-44 flex flex-col items-center justify-center bg-[#040404] border-t border-white/10 relative overflow-hidden">
          <div className="text-center max-w-xl relative z-10">
            <h3 className="text-3xl md:text-4xl font-light tracking-[0.22em] mb-4">
              The Field Keeps Listening.
            </h3>
            <p className="text-sm text-gray-400 mb-8 max-w-[60ch] mx-auto">
              Every connection alters the field. If resonance is sensed — it
              will find you back.
            </p>
            <a
              href="/contact"
              className="inline-block uppercase tracking-[0.28em] text-xs text-gray-300 hover:text-white transition"
            >
              Transmit Intention
            </a>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_80%)] opacity-[0.08]" />
        </section>
      </main>
    </div>
  );
}
