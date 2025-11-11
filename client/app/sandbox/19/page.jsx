"use client";

import React from "react";

/**
 * VARIANT Ω//RESONANT — THE HARMONIZED FIELD
 *
 * Essence:
 * - Refined to align fully with Boson’s energetic philosophy.
 * - Services become frequencies, not items.
 * - Introduces "whisper lines" — micro-conscious statements.
 * - No motion: the stillness *is* the motion.
 */

function SignalButton({ label = "Transmit Intention", href = "/contact" }) {
  return (
    <a
      href={href}
      className="inline-block uppercase tracking-[0.28em] text-xs text-gray-300 hover:text-white transition"
    >
      {label}
    </a>
  );
}

function LiminalBridge({ text }) {
  return (
    <div className="w-full h-[14vh] flex items-center justify-center">
      <div className="text-[0.8rem] text-gray-600 tracking-[0.22em] uppercase">
        {text}
      </div>
    </div>
  );
}

export default function VariantOmegaFinal() {
  const FIELDS = [
    {
      title: "Brand Composition",
      desc: "Structure that allows emotion to exist in form — geometry built to hold feeling without collapse.",
      whisper: "We listen before we touch the grid.",
      tag: "Foundation",
    },
    {
      title: "Spatial Identity",
      desc: "Designing awareness across dimensions — from the object to the atmosphere that receives it.",
      whisper: "Every space remembers who enters it.",
      tag: "Geometry",
    },
    {
      title: "Narrative Photography",
      desc: "Tracing how light remembers presence — every frame a vibration of time, not a capture of it.",
      whisper: "The image finds you when you stop looking.",
      tag: "Light",
    },
    {
      title: "Campaign Architecture",
      desc: "Translating motion into meaning — orchestrating attention so that ideas evolve, not repeat.",
      whisper: "Movement is only alive when it listens back.",
      tag: "Rhythm",
    },
    {
      title: "Conscious Media",
      desc: "Each post is a pulse — a moment of collective rhythm between silence and response.",
      whisper: "The feed is not noise — it’s a modern heartbeat.",
      tag: "Frequency",
    },
    {
      title: "Sonic Branding",
      desc: "Composing frequency that lingers in absence — sound that knows when to stop speaking.",
      whisper: "Silence is the loudest tone.",
      tag: "Resonance",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-x-hidden">
      {/* === STATIC BACKGROUND === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "160px 160px",
        }}
      />
      <div
        aria-hidden
        className="fixed left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
      />

      {/* === MAIN FIELD === */}
      <main className="relative z-20 max-w-[1500px] mx-auto">
        {/* === 01: AWARENESS === */}
        <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-20 py-24 border-b border-white/10">
          <div className="max-w-4xl">
            <h1 className="text-[3.6rem] md:text-[5rem] font-extralight leading-[1.1] tracking-[0.04em]">
              Awareness <br /> is the first light.
            </h1>
            <p className="mt-6 text-gray-400 max-w-[70ch] leading-relaxed">
              Creation begins where attention stops being passive. We design
              frameworks that give that attention coherence — form, cadence, and
              proportion that make a field legible across time and medium.
            </p>
          </div>
          <div className="mt-16 flex items-center gap-6">
            <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-sm font-semibold">
              01
            </div>
            <p className="text-sm text-gray-500">
              Listening precedes making. Form follows stillness.
            </p>
          </div>
        </section>

        <LiminalBridge text="— from stillness, tone emerges —" />

        {/* === 02: RESONANCE === */}
        <section className="grid grid-cols-12 border-b border-white/10">
          <div className="col-span-12 md:col-span-7 px-8 md:px-20 py-32 flex flex-col justify-center">
            <h2 className="text-4xl font-light tracking-[0.18em] mb-4">
              Design as Resonance
            </h2>
            <p className="text-gray-400 max-w-[65ch] mb-8 leading-relaxed">
              Design is not decoration. It is tuning — geometry, proportion,
              texture, and tone aligned until the field recognizes itself.
            </p>
            <SignalButton />
          </div>
          <div className="col-span-12 md:col-span-5 bg-[#080808] grid grid-rows-3">
            <div className="row-span-1 border-b border-white/10 flex items-center justify-center">
              <div className="text-6xl opacity-10 font-extrabold">R</div>
            </div>
            <div className="row-span-1 border-b border-white/10 flex items-center justify-center">
              <div className="text-6xl opacity-10 font-extrabold">E</div>
            </div>
            <div className="row-span-1 flex items-center justify-center">
              <div className="text-6xl opacity-10 font-extrabold">S</div>
            </div>
          </div>
        </section>

        <LiminalBridge text="— the field takes pattern —" />

        {/* === 03: FIELDS OF PRACTICE (refined) === */}
        <section className="w-full px-6 md:px-12 py-24">
          <div className="max-w-[1200px] mx-auto">
            <h3 className="text-2xl font-light tracking-[0.18em] mb-10">
              Fields of Practice
            </h3>

            <div className="relative">
              {/* vertical connector line left */}
              <div className="hidden md:block absolute left-6 top-0 bottom-0 w-px bg-white/6" />

              <div className="space-y-12 md:space-y-16">
                {FIELDS.map((f, i) => (
                  <div
                    key={i}
                    className="pl-12 md:pl-20 flex flex-col md:flex-row md:items-start gap-6"
                  >
                    <div className="w-12 flex-shrink-0">
                      <div className="text-4xl font-black opacity-8 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex-1 border-l border-white/6 pl-6">
                      <h4 className="text-lg font-medium mb-2 tracking-wide">
                        {f.title}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-[70ch] mb-3">
                        {f.desc}
                      </p>
                      <p className="text-xs italic text-gray-600">
                        {f.whisper}
                      </p>
                    </div>

                    <div className="w-[80px] text-right text-[0.7rem] tracking-[0.2em] uppercase text-gray-500 mt-1 md:mt-0">
                      {f.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <LiminalBridge text="— from tools, process arises —" />

        {/* === 04: PROCESS (unchanged) === */}
        <section className="relative w-full min-h-[100vh] px-6 md:px-20 py-40 bg-[#050505] border-t border-white/10 flex flex-col items-center justify-center overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-light tracking-[0.22em] mb-24 text-center uppercase text-white/90">
            The Four Motions — Internal Sequence
          </h3>

          <div className="relative w-[420px] h-[420px] md:w-[620px] md:h-[620px] select-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full border border-white/10 flex items-center justify-center">
                <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">
                  The Stillpoint
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-full border border-white/[0.05]" />
            <div className="absolute inset-10 rounded-full border border-white/[0.04] opacity-40" />
            <div className="absolute inset-20 rounded-full border border-white/[0.03] opacity-20" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white/[0.04] to-transparent" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full bg-gradient-to-r from-white/[0.04] to-transparent" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 flex flex-col items-center text-center">
              <h4 className="text-lg md:text-xl font-medium tracking-[0.15em] uppercase text-white">
                Observe
              </h4>
              <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-[20ch] leading-relaxed">
                See the pattern beneath behavior.
              </p>
              <div className="text-[10px] text-gray-600 mt-1">Phase 1</div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex flex-col items-center text-center">
              <h4 className="text-lg md:text-xl font-medium tracking-[0.15em] uppercase text-white">
                Define
              </h4>
              <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-[20ch] leading-relaxed">
                Distill intent into constraint.
              </p>
              <div className="text-[10px] text-gray-600 mt-1">Phase 2</div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 flex flex-col items-center text-center">
              <h4 className="text-lg md:text-xl font-medium tracking-[0.15em] uppercase text-white">
                Compose
              </h4>
              <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-[20ch] leading-relaxed">
                Give shape to the invisible.
              </p>
              <div className="text-[10px] text-gray-600 mt-1">Phase 3</div>
            </div>

            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex flex-col items-center text-center">
              <h4 className="text-lg md:text-xl font-medium tracking-[0.15em] uppercase text-white">
                Refine
              </h4>
              <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-[20ch] leading-relaxed">
                Polish until silence remains.
              </p>
              <div className="text-[10px] text-gray-600 mt-1">Phase 4</div>
            </div>
          </div>

          <p className="mt-24 text-sm md:text-base text-gray-500 max-w-[70ch] text-center leading-relaxed">
            Each motion is not a task but a posture — a rotation of awareness
            around a still center. We design structures that allow motion to
            become memory, and memory to become rhythm.
          </p>
        </section>

        <LiminalBridge text="— resonance becomes record —" />

        {/* === 05: ECHO / TESTIMONIALS === */}
        <section className="py-32 px-8 md:px-20 bg-gradient-to-t from-[#070707] to-black border-b border-white/10">
          <h3 className="text-2xl font-light tracking-[0.2em] mb-10 text-center">
            Echoes of the Field
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "Boson made our story breathe — design that feels like remembering something ancient.",
                author: "Lucent Atelier",
              },
              {
                quote:
                  "They don’t decorate — they tune. The result felt inevitable, not invented.",
                author: "Nomad Collective",
              },
            ].map((q, i) => (
              <figure
                key={i}
                className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-10 flex flex-col justify-between"
              >
                <blockquote className="italic text-gray-200 leading-relaxed">
                  “{q.quote}”
                </blockquote>
                <figcaption className="text-sm text-gray-500 mt-6 text-right">
                  — {q.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <LiminalBridge text="— the field closes —" />

        {/* === 06: CTA === */}
        <section className="w-full py-40 flex flex-col items-center justify-center bg-[#040404] border-t border-white/10">
          <div className="text-center max-w-xl">
            <h3 className="text-3xl md:text-4xl font-light tracking-[0.22em] mb-4">
              Speak your field into existence.
            </h3>
            <p className="text-sm text-gray-400 mb-8">
              Intention precedes manifestation — but form seals the act.
            </p>
            <SignalButton />
          </div>
        </section>
      </main>
    </div>
  );
}
