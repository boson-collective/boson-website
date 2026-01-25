'use client';
import React, { useEffect, useContext, useRef, useLayoutEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, useSpring, useScroll, useTransform, useAnimationFrame, useAnimation, useReducedMotion, useMotionValue, animate} from "framer-motion";
import GradientBg from '../../components/organisms/GradientBg'
import { createPortal } from "react-dom";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

import Image from 'next/image' 
import SectionWrapper from '../../components/molecules/SectionWrapper';
import Heading from '../../components/atoms/Heading';
import Paragraph from '../../components/atoms/Paragraph';
import Button from '../../components/atoms/Button';
import Card from '../../components/molecules/Card';

/* =========================
   WEBGL BACKGROUND
========================== */
function Webglbg() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const webgl = new GradientBg({
      rendererEl: containerRef.current,
      background: {
        color1: [0.82, 0.78, 0.74],   // warm off-white / ash
        color2: [0.46, 0.22, 0.18],   // burnt umber / deep warm red
        color3: [0.08, 0.07, 0.07],   // near-black charcoal
        colorAccent: new THREE.Color(0.62, 0.28, 0.18), // muted ember orange-red
        uLinesBlur: 0.36,
        uNoise: 0.025,
        uOffsetX: 0.04,
        uOffsetY: -2.4,
        uLinesAmount: 1.3,
      }
      
    });

    return () => webgl.destroy();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
    />
  );
}

/* =========================
   HERO
========================== */
function Hero() {
  return (
    <section className="relative w-full h-[65vh] overflow-hidden bg-black">
      {/* WEBGL BACKGROUND */}
      <Webglbg />

      {/* LOGO TOP CENTER */}
      <div className="absolute  -top-5 left-1/2 -translate-x-1/2 z-30">
        <Image
          src="/png/boson-white.png"
          alt="Boson Logo"
          width={120}
          height={40}
          priority
          className="opacity-90"
        />
      </div>

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div
          className="
            mx-4 sm:mx-6
            mb-4 sm:mb-6
            flex items-center justify-between
            rounded-2xl
            px-12 py-2
          "
        >
          <div className="max-w-5xl">
            <h1
              className="font-sans text-white font-medium tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(18px, 3.8vw, 58px)" }}
            >
              <span
                className="
                  hidden lg:inline-block
                  mr-80
                  text-xs uppercase tracking-widest opacity-70
                  align-top relative
                "
              >
                let's talk
              </span>

              You've got it! Lay out all the juicy details for us. Let's see what we can dream up together
            </h1>
          </div>

          <div className="w-14 h-14 rounded-full border border-white text-white text-sm font-medium flex flex-col items-center justify-center leading-none">
            <span>20</span>
            <span>25</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   FAQ
========================== */
function FAQ() {
  const faqs = [
    {
      q: "What kind of clients do you usually work with?",
      a: "We mostly work with brands connected to Bali — villas, hotels, cafés, restaurants, wellness businesses, and lifestyle brands. We also collaborate with international brands targeting the Bali market.",
    },
    {
      q: "Do you handle content creation or only social media management?",
      a: "Both. We handle strategy, content direction, copywriting, posting, reporting, and can include photo or video production when needed.",
    },
    {
      q: "Can you help us reach tourists and international audiences?",
      a: "Yes. Our strategies are built around visual storytelling and culturally aware messaging that resonates with travelers and expats.",
    },
    {
      q: "Do you work with new or small businesses?",
      a: "Yes — as long as there is clarity, commitment, and realistic expectations. We prefer building things right from the start.",
    },
    {
      q: "How does the collaboration usually start?",
      a: "After reviewing your submission, we’ll suggest the next step — usually a short call or a clear proposal outlining scope and direction.",
    },
    {
      q: "Are you based in Bali and available for on-site work?",
      a: "Yes. We are Bali-based and can work on-site for selected projects, especially in hospitality and lifestyle sectors.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="px-6 lg:px-20 pb-40 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        
        {/* LEFT — BIG STATEMENT */}
        <div className="relative"> 

          <h1 className="text-[48px] sm:text-[64px] lg:text-[84px] leading-[1.05] font-normal tracking-tight">
            We
            <br />
            would
            <br />
            love
            <br />
            to hear
            <br />
            from
            <br />
            <span className="inline-flex items-center gap-4">
              <span className="text-[0.9em]">→</span>
              you.
            </span>
          </h1>
        </div>

        {/* RIGHT — FAQ */}
        <div className="max-w-2xl ml-auto">
          <h2 className="text-sm text-black/40 mb-12">
            FAQ
          </h2>

          <div className="space-y-6">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="border-b border-black/10 pb-6"
                >
                  {/* QUESTION */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between text-left text-lg font-medium group"
                  >
                    <span>{item.q}</span>

                    {/* ICON */}
                    <span
                      className={`
                        text-black/40 text-xl
                        transition-transform duration-200 ease-out
                        ${isOpen ? "rotate-45" : "rotate-0"}
                      `}
                    >
                      +
                    </span>
                  </button>

                  {/* ANSWER */}
                  <div
                    className={`
                      grid transition-all duration-300 ease-out
                      ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                    `}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`
                          mt-4 text-sm text-black/60 max-w-prose
                          transition-all duration-300 ease-out
                          ${isOpen ? "translate-y-0" : "-translate-y-2"}
                        `}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================
   FOOTER (AS IS – IGNORED IN AUDIT)
========================== */
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

  const email = "hello@studio.com";

  return (
    <footer
      id="top"
      className="relative bg-neutral-950 text-white overflow-hidden"
    >
      {/* SIGNAL BAR */}
      <div className="px-[6vw] py-4 sm:py-5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] tracking-wide border-b border-white/10 gap-y-2">
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
      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-12 gap-y-12 sm:gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <p className="text-neutral-500 max-w-md leading-relaxed text-sm sm:text-base">
              We work with teams building thoughtful digital products
              <br />
              <span className="hidden sm:inline mr-10"></span>
              If you have a project in mind, we would{" "}
              <span className="italic">looove</span> to hear about it
            </p>
          </div>

          <div className="col-span-12 lg:col-span-6 flex lg:justify-end items-start lg:items-end">
            <a
              ref={emailRef}
              href="mailto:hello@studio.com"
              className="
                inline-block
                font-light
                tracking-tight
                text-white
                cursor-pointer
                text-[clamp(24px,7vw,42px)]
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
              <span className="block h-[1px] w-full bg-white/30 mt-1" />
            </a>
          </div>
        </div>
      </div>

      {/* BRAND MASS */}
      <div className="relative px-6 lg:px-12 pt-12 pb-20 sm:pb-24 border-t border-neutral-800">
        <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-y-10 sm:gap-y-12 items-end">
          
          {/* META — MOBILE FIRST */}
          <div className="col-span-12 lg:col-span-5 flex flex-col lg:items-end gap-5 sm:gap-6 text-[11px] sm:text-xs text-neutral-500 order-1 lg:order-2">
            <div className="space-y-1 lg:text-right">
              <div>+62 812 3456 789</div>
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

          {/* BRAND LOGO — PINDAH KE PALING BAWAH DI MOBILE */}
          <div className="col-span-12 lg:col-span-7 order-2 lg:order-1">
            <img
              src="/png/boson-white3.png"
              alt="Boson"
              className="w-full max-w-[900px]"
            />
          </div>

        </div>
      </div>
    </footer>
  );
}
 

const DOT_MODES = {
  IDLE: "idle",
  SCROLL: "scroll",
  SELECTED: "selected",
  FOCUS: "focus",
};
  
/* =====================
   PRIMITIVES
===================== */

function Field({ label, children }) {
  return (
    <div className="py-20 border-b border-black/10">
      <div className="mb-6 text-[11px] uppercase tracking-wide text-black/75">
        {label}
      </div>
      {children}
    </div>
  );
}

function TextInput({ placeholder, onFocus, onBlur, anchorRefs }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      ref={(el) => el && anchorRefs.current.push(el)}
      onFocus={(e) => onFocus(e.currentTarget)}
      onBlur={onBlur}
      className="
        w-full
        bg-transparent
        outline-none
        text-[28px]
        leading-tight
        font-light
        text-black/80
        placeholder:text-black/25
      "
    />
  );
}

function TextArea({ placeholder, onFocus, onBlur, anchorRefs }) {
  return (
    <textarea
      rows={4}
      placeholder={placeholder}
      ref={(el) => el && anchorRefs.current.push(el)}
      onFocus={(e) => onFocus(e.currentTarget)}
      onBlur={onBlur}
      className="
        w-full
        bg-transparent
        outline-none
        resize-none
        text-[28px]
        leading-snug
        font-light
        text-black/80
        placeholder:text-black/25
      "
    />
  );
}

/* =====================
   TOP INFO
===================== */

function TopInfo({ baliTime, blink }) {
  return (
    <div className="w-full border-b border-black/10 text-[10px] uppercase tracking-wide">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-3 grid sm:grid-cols-3 gap-y-2">
        <div className="opacity-50">
          Bali · {baliTime.hour}
          <span className={blink ? "opacity-100" : "opacity-0"}>:</span>
          {baliTime.minute} (UTC+8)
        </div>
        <div className="sm:text-center text-black/60">
          WhatsApp · +62 812 3456 789
        </div>
        <div className="sm:text-right text-black/50">
          Replies in 1–2 working days
        </div>
      </div>
    </div>
  );
}

/* =====================
   FORM
===================== */

function ContactForm({ anchorRefs, onFocus, onBlur }) {
  return (
    <div className="mt-5">
      <Field label="Your Name">
        <TextInput
          placeholder="Your autograph, please"
          anchorRefs={anchorRefs}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>

      <Field label="Your Company">
        <TextInput
          placeholder="Company name"
          anchorRefs={anchorRefs}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>

      <Field label="Your E-mail">
        <TextInput
          placeholder="@"
          anchorRefs={anchorRefs}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>

      <Field label="Project Details">
        <TextArea
          placeholder="What's on your mind..."
          anchorRefs={anchorRefs}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>
    </div>
  );
}

/* =====================
   ACTION
===================== */

function FormAction({ anchorRefs, submitButtonRef, onHover }) {
  return (
    <div className="pt-32 flex flex-col items-end gap-6">
      <button
        ref={(el) => {
          submitButtonRef.current = el;
          if (el) anchorRefs.current.push(el);
        }}
        onMouseEnter={onHover}
        type="submit"
        className="
          text-[20px]
          font-normal
          tracking-tight
          group
        "
      >
        <span>Send Request</span>
        <span className="inline-block ml-3 transition-transform duration-300 group-hover:translate-x-3">
          →
        </span>
      </button>

      <p className="text-[11px] text-black/40 max-w-xs text-right">
        Submitted information is used for communication related to this request.
      </p>

      <p className="text-[11px] text-black/35 text-right">
        By submitting, you agree to our{" "}
        <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
}

/* =====================
   PAGE
===================== */

function ContactPage() {
  const [baliTime, setBaliTime] = useState({ hour: "--", minute: "--" });
  const [blink, setBlink] = useState(true);

  const dotRef = useRef(null);
  const anchorRefs = useRef([]);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const [hour, minute] = formatter.format(now).split(":");
      setBaliTime({ hour, minute });
    };

    updateTime();
    const t = setInterval(updateTime, 60000);
    const b = setInterval(() => setBlink((v) => !v), 1000);

    return () => {
      clearInterval(t);
      clearInterval(b);
    };
  }, []);

  const moveDotToEl = (el) => {
    if (!dotRef.current || !el) return;
    const r = el.getBoundingClientRect();
    dotRef.current.style.left = `${r.right + 12}px`;
    dotRef.current.style.top = `${r.top + r.height / 2}px`;
    dotRef.current.style.opacity = "1";
    dotRef.current.style.transform = "translate(-50%, -50%) scale(1)";
  };

  const handleFocus = (el) => moveDotToEl(el);
  const handleBlur = () => {
    dotRef.current.style.opacity = "0.2";
    dotRef.current.style.transform =
      "translate(-50%, -50%) scale(0.8)";
  };

  const handleSubmitHover = () => {
    if (submitButtonRef.current) {
      moveDotToEl(submitButtonRef.current);
    }
  };

  return (
    <main className="min-h-screen bg-[#d7d3da] text-black">
      {/* DOT */}
      <span
        ref={dotRef}
        className="
          fixed
          w-2
          h-2
          rounded-full
          bg-black
          pointer-events-none
          z-50
          transition-all
          duration-300
          ease-out
        "
        style={{
          left: 0,
          top: 0,
          opacity: 0.2,
          transform: "translate(-50%, -50%) scale(0.8)",
        }}
      />

      <TopInfo baliTime={baliTime} blink={blink} />

      <section className="max-w-7xl mx-auto px-6 lg:px-20 pb-48">
        <div className="pt-32 pb-16 text-center text-[22px] text-black/80">
          Let’s see what we can dream up together.
        </div>

        <form>
          <ContactForm
            anchorRefs={anchorRefs}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <FormAction
            anchorRefs={anchorRefs}
            submitButtonRef={submitButtonRef}
            onHover={handleSubmitHover}
          />
        </form>
      </section>
    </main>
  );
}







export default  function Page() {
  const [baliTime, setBaliTime] = useState({ hour: "--", minute: "--" });
  const [blink, setBlink] = useState(true);
  const [dotMode, setDotMode] = useState(DOT_MODES.IDLE);

  const dotRef = useRef(null);
  const anchorRefs = useRef([]);
  const submitButtonRef = useRef(null);

  const dotLocked = useRef(false);
  const idleTimer = useRef(null);
  const raf = useRef(null);
  const mounted = useRef(false);

  /* =====================
     SAFE DOM ACCESS
  ===================== */
  const withDot = useCallback(fn => {
    const dot = dotRef.current;
    if (!mounted.current || !dot) return;
    fn(dot);
  }, []);

  /* =====================
     TIME
  ===================== */
  useEffect(() => {
    mounted.current = true;

    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const [hour, minute] = formatter.format(now).split(":");
      setBaliTime({ hour, minute });
    };

    updateTime();

    const t = setInterval(updateTime, 60000);
    const b = setInterval(() => setBlink(v => !v), 1000);

    return () => {
      mounted.current = false;
      clearInterval(t);
      clearInterval(b);
    };
  }, []);

  /* =====================
     DOT CORE
  ===================== */
  const moveDotToEl = useCallback((el, lock = false) => {
    if (!el || dotLocked.current) return;

    withDot(dot => {
      const r = el.getBoundingClientRect();
      const x = r.right + 12;
      const y = r.top + r.height / 2;

      const distance = Math.hypot(x, y);
      const duration = Math.min(Math.max(distance * 0.6, 180), 700);

      Object.assign(dot.style, {
        transitionDuration: `${duration}ms`,
        left: `${x}px`,
        top: `${y}px`,
        opacity: "1",
        transform: "translate(-50%, -50%) scale(1)",
      });

      if (lock) {
        dotLocked.current = true;
        setDotMode(DOT_MODES.SELECTED);
      }
    });
  }, [withDot]);

  /* =====================
     SCROLL
  ===================== */
  useEffect(() => {
    if (!mounted.current) return;

    const onScroll = () => {
      if (
        dotLocked.current ||
        [DOT_MODES.SELECTED, DOT_MODES.FOCUS].includes(dotMode)
      )
        return;

      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }

      setDotMode(DOT_MODES.SCROLL);

      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }

      raf.current = requestAnimationFrame(() => {
        if (!mounted.current) return;

        const centerY = window.innerHeight / 2;
        let closest = null;
        let minDist = Infinity;

        anchorRefs.current.forEach(el => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const y = r.top + r.height / 2;
          const dist = Math.abs(centerY - y);
          if (dist < minDist) {
            minDist = dist;
            closest = el;
          }
        });

        if (closest) moveDotToEl(closest);
      });

      idleTimer.current = setTimeout(() => {
        if (dotLocked.current) return;

        setDotMode(DOT_MODES.IDLE);

        withDot(dot => {
          dot.style.opacity = "0.2";
          dot.style.transform = "translate(-50%, -50%) scale(0.8)";
        });
      }, 1200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }

      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
    };
  }, [dotMode, moveDotToEl, withDot]);

  /* =====================
     HANDLERS
  ===================== */
  const handleFocus = el => {
    if (dotLocked.current) return;
    setDotMode(DOT_MODES.FOCUS);
    moveDotToEl(el);
  };

  const handleBlur = () => {
    if (dotLocked.current) return;
    setDotMode(DOT_MODES.IDLE);
  };

  const handleSubmitHover = () => {
    if (!submitButtonRef.current) return;
    moveDotToEl(submitButtonRef.current, true);
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <main className="min-h-screen bg-white text-black">
      {/* DOT */}
      <span
        ref={dotRef}
        className="fixed hidden w-2 h-2 rounded-full bg-black pointer-events-none z-50 transition-all ease-[cubic-bezier(.22,1,.36,1)]"
        style={{
          left: 0,
          top: 0,
          opacity: 0.2,
          transform: "translate(-50%, -50%) scale(0.8)",
        }}
      />

      <Hero />
      <TopInfo baliTime={baliTime} blink={blink} />

      <section className="px-6 lg:px-20 max-w-7xl mx-auto pb-40">
        <form className="border-t border-black/20">
          <ContactForm
            anchorRefs={anchorRefs}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <FormAction
            anchorRefs={anchorRefs}
            submitButtonRef={submitButtonRef}
            onHover={handleSubmitHover}
          />
        </form>
      </section>

      <FAQ />
      <Footer />
    </main>
  );
}