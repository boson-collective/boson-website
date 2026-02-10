"use client"

import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

function Footer() {
  const emailRef = useRef(null);
  const charsRef = useRef([]);

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

  const email = "boson.sma@gmail.com";

  return (
    <footer
      id="top"
      className="relative w-full bg-neutral-950 text-white overflow-hidden"
    >
      {/* SIGNAL BAR */}
      <div
        className="
          px-[6vw] py-4 sm:py-5
          flex flex-wrap items-center justify-between
          tracking-wide border-b border-white/10 gap-y-2
          text-[clamp(10px,0.7vw,12px)]
        "
      >
        <div className="opacity-50 uppercase">
          GMT +7 · Operating globally
        </div>

        <div className="flex gap-5 sm:gap-6">
          <div className="opacity-80">Our Social</div>
          {["Instagram", "LinkedIn"].map((item) => (
            <a
              key={item}
              href="#"
              className="opacity-50 hover:opacity-100 transition"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative px-[6vw] py-20 sm:py-28">
        <div className="grid grid-cols-12 gap-y-12 sm:gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <p
              className="
                text-neutral-500 leading-relaxed
                max-w-[520px]
                text-[clamp(14px,1.1vw,17px)]
              "
            >
              We work with teams building thoughtful digital products
              <br />
              If you have a project in mind, we would{" "}
              <span className="italic">looove</span> to hear about it
            </p>
          </div>

          <div className="col-span-12 lg:col-span-6 flex lg:justify-end items-start lg:items-end">
            <a
              ref={emailRef}
              href="mailto:boson.sma@gmail.com"
              className="
                inline-block font-light tracking-tight text-white cursor-pointer
                text-[clamp(26px,4.5vw,44px)]
              "
            >
              <span className="inline-flex overflow-hidden">
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
              <span className="block h-[1px] w-full bg-white/30 mt-2" />
            </a>
          </div>
        </div>
      </div>

      {/* BRAND MASS */}
      <div className="relative px-[6vw] pt-12 pb-20 sm:pb-24 border-t border-neutral-800">
        <div className="grid grid-cols-12 gap-y-10 sm:gap-y-12 items-end">
          {/* META */}
          <div
            className="
              col-span-12 lg:col-span-5
              flex flex-col lg:items-end gap-5 sm:gap-6
              order-1 lg:order-2
              text-neutral-500
              text-[clamp(11px,0.9vw,13px)]
            "
          >
            <div className="space-y-1 lg:text-right">
              <div>+62 877 6777 7720</div>
              <div>Bali · Indonesia</div>
            </div>

            <span>Copyright © {new Date().getFullYear()}</span>

            <div className="flex gap-6 sm:gap-8">
              <a href="/imprint" className="hover:text-white">
                Imprint
              </a>
              <a href="#top" className="hover:text-white">
                Back to top ↑
              </a>
            </div>
          </div>

          {/* LOGO */}
          <div className="col-span-12 lg:col-span-7 order-2 lg:order-1">
            <img
              src="/png/boson-white3.png"
              alt="Boson"
              className="
                w-full
                object-contain
                max-h-[55vh]
                sm:max-h-[50vh]
                lg:max-h-[45vh]
              "
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
