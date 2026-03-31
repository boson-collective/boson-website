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
import Footer from '../../components/organisms/Footer';

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
    <section className="relative w-full min-h-[85svh] md:h-[65vh] bg-black overflow-hidden">

      {/* WEBGL */}
      <div className="absolute inset-0">
        <Webglbg />
      </div>

      {/* NAVBAR */}
      <div className="absolute top-0 left-0 w-full z-30 font-[Code_Pro]">
        <div className="relative mx-auto px-6 md:px-20 min-h-[64px] md:min-h-[72px] flex items-center text-white">

          {/* MOBILE NAV */}
          <div className="flex md:hidden w-full items-center justify-between text-xs font-medium tracking-wide">

            <a
              href="/about"
              className="transition-opacity hover:opacity-70"
            >
              About
            </a>

            <a href="/" className="block">
              <Image
                src="/png/boson-white.png"
                alt="Boson"
                width={90}
                height={32}
                priority
                className="transition-opacity hover:opacity-70"
              />
            </a>

            <a
              href="/contact"
              className="transition-opacity hover:opacity-70"
            >
              Contact
            </a>

          </div>


          {/* DESKTOP NAV */}
          <div className="hidden md:flex w-full items-center">

            <nav className="flex items-center gap-6 flex-1 text-xs font-medium tracking-wide">
              <a
                href="/about"
                className="transition-opacity hover:opacity-70"
              >
                About
              </a>
            </nav>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <a href="/" className="pointer-events-auto block">
                <Image
                  src="/png/boson-white.png"
                  alt="Boson"
                  width={120}
                  height={40}
                  priority
                  className="transition-opacity hover:opacity-70"
                />
              </a>
            </div>

            <div className="flex items-center justify-end flex-1 text-xs font-medium tracking-wide">
              <a
                href="/contact"
                className="transition-opacity hover:opacity-70"
              >
                Contact
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="mx-6 md:mx-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-0 md:px-12">

          <div className="max-w-3xl">

            <h1
              className="font-[Code_Pro] text-white font-light tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(22px,5vw,58px)" }}
            >

              <span className="hidden lg:inline-block mr-16 text-xs uppercase tracking-widest opacity-70 font-medium">
                let's talk
              </span>

              Let's see <span className="font-normal">
                what we can dream up together
              </span>

            </h1>

          </div>

        </div>
      </div>

    </section>
  )
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
    <section className="px-6 lg:px-20 pb-32 max-w-7xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* LEFT */}
        <div className="flex justify-center lg:justify-start">

          <h1
            className="
              max-w-[14ch]
              text-center lg:text-left
              text-[34px] sm:text-[48px] lg:text-[84px]
              font-[Code_Pro]
              leading-[1.05]
              font-medium
              tracking-tight
            "
          >
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
            <span className="inline-flex items-center justify-center lg:justify-start gap-3">
              <span className="text-[0.9em]">→</span>
              you.
            </span>
          </h1>

        </div>

        {/* RIGHT */}
        <div className="max-w-2xl">

          <h2 className="text-sm text-black/40 mb-10">
            FAQ
          </h2>

          <div className="space-y-5">

            {faqs.map((item, index) => {

              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="border-b border-black/10 pb-5"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full flex items-start justify-between text-left text-[16px] lg:text-lg font-medium"
                  >

                    <span className="pr-6">
                      {item.q}
                    </span>

                    <span
                      className={`
                        text-lg text-black/40
                        transition-transform duration-200 ease-out
                        ${isOpen ? "rotate-45" : "rotate-0"}
                      `}
                    >
                      +
                    </span>

                  </button>

                  <div
                    className={`
                      grid transition-all duration-200 ease-out
                      ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                    `}
                  >

                    <div className="overflow-hidden">

                      <p
                        className={`
                          mt-4 text-sm text-black/60 max-w-prose
                          transition-all duration-200 ease-out
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
    <div className="w-full border-b border-black/10 text-[11px] uppercase tracking-[0.08em]">
      <div className="mx-auto px-6 md:px-20 py-3 grid gap-y-3 sm:grid-cols-3 items-center">

        <div className="text-black/60 text-center sm:text-left">
          Bali · {baliTime.hour}
          <span className={`inline-block w-[0.5ch] ${blink ? "opacity-100" : "opacity-30"}`}>
            :
          </span>
          {baliTime.minute} (UTC+8)
        </div>

        <div className="text-black/70 text-center">
          WhatsApp · +62 877 6777 7720
        </div>

        <div className="text-black/50 text-center sm:text-right">
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
    <div className="pt-24 lg:pt-32 flex flex-col items-center lg:items-end gap-6 text-center lg:text-right">

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

      <p className="text-[11px] text-black/40 max-w-xs">
        Submitted information is used for communication related to this request.
      </p>

      <p className="text-[11px] text-black/35">
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