"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";

function Footer() {
  const emailRef = useRef(null);
  const charsRef = useRef([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    const el = emailRef.current;
    if (!el) return;

    charsRef.current = charsRef.current.filter(Boolean);
    if (!charsRef.current.length) return;

    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) return;

    gsap.set(charsRef.current, { y: 0, opacity: 1 });

    const tl = gsap.timeline({ paused: true });

    tl.to(charsRef.current, {
      y: -36,
      opacity: 0,
      duration: 0.55,
      ease: "power4.in",
      stagger: { amount: 0.22 },
    })
      .set(charsRef.current, { y: 36 })
      .to(charsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "back.out(2.6)",
        stagger: { amount: 0.22 },
      });

    const onPointerEnter = (e) => {
      if (e.pointerType !== "mouse") return;
      tl.restart();
    };

    el.addEventListener("pointerenter", onPointerEnter);

    return () => {
      el.removeEventListener("pointerenter", onPointerEnter);
      tl.kill();
    };
  }, []);

  // 🔥 REAL TIME CLOCK (BALI / WITA)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Makassar",
      });
      setTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const email = "info@boson.agency";

  return (
    <footer
      id="top"
      className="relative w-full text-white overflow-hidden bg-neutral-950"
    >
      {/* subtle depth background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />

      {/* SIGNAL BAR */}
      <div
        className="
          relative
          px-[6vw] py-4 sm:py-5
          flex flex-wrap items-center justify-between
          tracking-wide border-b border-white/10 gap-y-2
          text-[clamp(10px,0.7vw,12px)]
          bg-white/[0.02] backdrop-blur-[6px]
        "
      >
        {/* LEFT (LIVE TIME - FIXED TO BALI) */}
        <div className="opacity-50 uppercase tabular-nums">
          {time} · GMT +8 · Operating globally
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="opacity-80">Our Social</div>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/boson.collective/"
            className="flex items-center gap-2 opacity-50 hover:opacity-100 transition"
            target="_blank" rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-[14px] h-[14px] opacity-70"
            >
              <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5C19.322 22 22 19.322 22 16.25v-8.5C22 4.678 19.322 2 16.25 2h-8.5zm0 2h8.5C18.216 4 20 5.784 20 7.75v8.5c0 1.966-1.784 3.75-3.75 3.75h-8.5C5.784 20 4 18.216 4 16.25v-8.5C4 5.784 5.784 4 7.75 4zm9.5 1.75a.75.75 0 100 1.5.75.75 0 000-1.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
            <span>Instagram</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/boson-collective/"
            className="flex items-center gap-2 opacity-50 hover:opacity-100 transition"
            target="_blank" rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-[14px] h-[14px] opacity-70"
            >
              <path d="M6.94 6.5a1.94 1.94 0 11-.001-3.881A1.94 1.94 0 016.94 6.5zM4.75 8.75h4.38V20h-4.38V8.75zM10.88 8.75h4.2v1.54h.06c.58-1.1 2-2.26 4.12-2.26 4.4 0 5.21 2.9 5.21 6.67V20h-4.38v-5.22c0-1.25-.02-2.86-1.74-2.86-1.74 0-2.01 1.36-2.01 2.77V20h-4.38V8.75z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="relative px-[6vw] py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 sm:gap-y-14">
          <div className="lg:col-span-6">
            <p className="text-neutral-500 leading-relaxed max-w-[520px] text-[clamp(14px,1.1vw,17px)]">
              We work with teams building thoughtful digital products
              <br />
              If you have a project in mind, we would{" "}
              <span className="italic">looove</span> to hear about it
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-start lg:justify-end items-start lg:items-end">
            <a
              ref={emailRef}
              href="mailto:info@boson.agency"
              className="inline-block font-light text-white cursor-pointer text-[clamp(26px,4.5vw,44px)] break-words tracking-[-0.04em] transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="inline-flex overflow-hidden flex-wrap">
                {email.split("").map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => (charsRef.current[i] = el)}
                    className="inline-block will-change-transform"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>

              <span className="block h-[2px] w-full bg-white/60 mt-2" />
            </a>
          </div>
        </div>
      </div>

      {/* BRAND MASS */}
      <div className="relative px-[6vw] pt-12 pb-20 sm:pb-24 border-t border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 sm:gap-y-12 items-end">
          <div className="lg:col-span-7">
            <img
              src="/png/boson-white3.png"
              alt="Boson"
              className="w-full object-contain max-h-[45vh] opacity-70 scale-[1.05]"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-7 sm:gap-8 text-[clamp(12px,0.9vw,14px)] lg:items-end">
  
  {/* CONTACT */}
  <div className="space-y-1.5 lg:text-right text-white/80 leading-relaxed">
    <div className="text-white/90">
      +62 877 6777 7720
    </div>

    <div className="opacity-80">
      Jl Pantai Batu Mejan
    </div>

    <div className="opacity-60">
      Canggu 80351
    </div>

    <div className="opacity-40">
      Bali · Indonesia
    </div>
  </div>

  {/* LINK */}
  <div className="flex gap-6 lg:justify-end text-white/50">
    <a href="#top" className="hover:text-white transition">
      Back to top ↑
    </a>
  </div>

  {/* COPYRIGHT */}
  <span className="text-white/30">
    © {new Date().getFullYear()} BOSON COLLECTIVE
  </span>

</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;