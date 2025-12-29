"use client";

import React, { Fragment, useLayoutEffect, useRef, useContext, useState, useEffect, useMemo, useId } from "react";
import gsap from "gsap";
import { LoaderContext } from "../../../components/atoms/LoaderGate";
import ScrollTrigger from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText";;
import SplitType from "split-type";
import Image from "next/image";
import { motion, useSpring, useScroll, useTransform, useAnimationFrame, useAnimation, useReducedMotion, useMotionValue, animate} from "framer-motion";
import Carousel from '../1/page';
import GradientBg from '../../../components/organisms/GradientBg'
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger,SplitText);


function Webglbg() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const webgl = new GradientBg({ rendererEl: containerRef.current });
    return () => webgl.destroy();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      id="webgl"
      className="absolute inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
    />
  );
}

/* ==========================================
   HERO (PERSIS PUNYA LO)
   ========================================== */
 
   function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 80]);
  
    const BOSON_DELAY = 2.8;
    const TEXT_DELAY = BOSON_DELAY + 1.5;
  
    return (
      <div className="relative w-full h-screen overflow-hidden flex justify-center items-center text-gray/80">
        <Webglbg />
  
        {/* NAV */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ delay: TEXT_DELAY, duration: 0.6, ease: "easeOut" }}
          className="absolute top-6 text-white sm:top-10 w-full px-6 sm:px-20 flex justify-between text-xs sm:text-sm z-20 tracking-wide"
        >
          <div className="flex gap-4 sm:gap-8">
            <span>About</span>
            <span>Services</span>
          </div>
          <div className="flex gap-4 sm:gap-8">
            <span>Works</span>
            <span>Contact</span>
          </div>
        </motion.div>
  
        {/* SIDE LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: TEXT_DELAY, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-[28%] text-white sm:bottom-[22%] left-1/2 sm:left-20 
          -translate-x-1/2 sm:translate-x-0 text-[11px] sm:text-sm leading-relaxed 
          max-w-[240px] text-center sm:text-start z-20"
        >
          A system-driven studio
          <br />
          for modern identity & engineering
        </motion.div>
  
        {/* SIDE RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: TEXT_DELAY, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-[20%] text-white sm:bottom-[22%] right-1/2 sm:right-20 
          translate-x-1/2 sm:translate-x-0 text-[11px] sm:text-sm leading-relaxed 
          max-w-[240px] text-center sm:text-right z-20"
        >
          Focused on how to shape
          <br />
          the future, driving it forward
        </motion.div>
  
        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ delay: TEXT_DELAY, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-6 text-white sm:bottom-10 w-full px-6 sm:px-20 
          flex justify-between text-[10px] sm:text-xs tracking-wide z-20"
        >
          <span>06°10&apos;00&quot;S</span>
          <span>Bali, Indonesia</span>
          <span>106°49&apos;00&quot;E</span>
        </motion.div>
  
        {/* BOSON CHROME — ANIMASI DOANG */}
        <motion.div
          initial={{ opacity: 0, scale: 1.9, filter: "blur(100px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: BOSON_DELAY, duration: 2.3, ease: "easeOut" }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="boson-chrome-v4" />
        </motion.div>
  
        {/* CHROME CSS — VISUAL ASLI BALIK */}
        <style jsx>{`
          .boson-chrome-v4 {
            position: absolute;
            inset: 0;
            margin: auto;
            width: min(90vw, 1250px);
            height: min(90vw, 1250px);
  
            mask-image: url("/boson-white.png");
            -webkit-mask-image: url("/boson-white.png");
            mask-size: contain;
            mask-position: center;
            mask-repeat: no-repeat;
  
            background: 
          #000000;
          /* 
          linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 40%, rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.4) 100%),
          radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0.35) 80%, rgba(0, 0, 0, 0.55) 100%), */

        background-blend-mode: screen, multiply;

        filter: blur(0.6px);
        opacity: 0.3;
          }
        `}</style>
      </div>
    );
  }

  
  /* ==========================================
   INTRO FRAME OVERLAY (SLIDES + PORTAL)
   ========================================== */ 
function IntroOverlay() {
const IMAGES = [
  "/clients/tender-touch/5.jpg",
  "/clients/dwm/3.jpg",
  "/clients/tender-touch/4.jpg",
  "/clients/dwm/5.jpg",
  "/clients/tender-touch/3.jpg",
  "/clients/dwm/4.jpg",
  "/clients/tender-touch/7.jpg",
  "/clients/dwm/6.jpg",
  "/clients/dwm/2.jpg",
];
const [phase, setPhase] = useState("slides");
const [visible, setVisible] = useState(Array(IMAGES.length).fill("start"));
const [topIndex, setTopIndex] = useState(0);

useEffect(() => {
  const revealDuration = 250; 
  const overlapStart = 150;
  const delayPer = revealDuration;

  IMAGES.forEach((_, i) => {
    const openTime = i * delayPer;
    const overlapTime = openTime + overlapStart;
    const closeTime = openTime + revealDuration;

    // OPEN slide i
    setTimeout(() => {
      setVisible((prev) => {
        const arr = [...prev];
        arr[i] = "open";
        return arr;
      });
      setTopIndex(i);
    }, openTime);

    // Bring next slide above before this closes
    if (i < IMAGES.length - 1) {
      setTimeout(() => {
        setTopIndex(i + 1);
      }, overlapTime);
    }

    // CLOSE this slide
    setTimeout(() => {
      setVisible((prev) => {
        const arr = [...prev];
        arr[i] = "close";
        return arr;
      });
    }, closeTime);
  });

  const total = (IMAGES.length - 1) * delayPer + revealDuration;

  setTimeout(() => setPhase("hole"), total + 20);
  setTimeout(() => setPhase("expand"), total + 700);
  setTimeout(() => setPhase("done"), total + 2200);
}, []);

if (phase === "done") return null;

return (
  <motion.div
    className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none"
    animate={
      phase === "expand"
        ? { scaleX: 26, scaleY: 6 }
        : { scaleX: 1, scaleY: 1 }
    }
    transition={{ duration: 1.6, ease: "easeInOut" }}
    
  >
    <div className="relative" style={{ width: 260, height: 400 }}>
      <div className="absolute inset-0">
        {IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            draggable="false"
            className={`absolute w-full h-full object-cover transition-all duration-[250ms] ${
              visible[i] === "open"
                ? "reveal"
                : visible[i] === "close"
                ? "reveal-end"
                : "reveal-start"
            }`}
            style={{ zIndex: i === topIndex ? 1000 : i }}
          />
        ))}
      </div>
      <div className="absolute inset-0 spotlight pointer-events-none" />
    </div>

    <style jsx>{`
      .spotlight {
        box-shadow: 0 0 0 9999px white;
      }
      .reveal-start {
        clip-path: inset(100% 0% 0% 0%);
      }
      .reveal {
        clip-path: inset(0% 0% 0% 0%);
      }
      .reveal-end {
        clip-path: inset(0% 0% 100% 0%);
      }
    `}</style>
  </motion.div>
);
}
  
  
function HeroJoin() { 
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 800], [0, -80]);
 

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          zIndex: 1,
          background: "white",
        }}
      >
        {/* HERO FULLSCREEN DI BELAKANG */}
        <Hero />

        {/* TITLE PALING DEPAN + PARALLAX + SCALE ANIMATION */}
        <motion.div
          style={{ y: titleY }}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 3, duration: 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[65] flex flex-col items-center text-center select-none pointer-events-none"
        >
          <img
            src="/png/boson-white.png"
            alt="Boson Collective"
            className="w-[250px] object-contain"
            draggable="false"
          />
        </motion.div>

        {/* INTRO OVERLAY DI DEPAN HERO TAPI DI BELAKANG TITLE */}
        <IntroOverlay />
      </div>

      <style jsx global>{`
        body {
          background: white;
        }
      `}</style>
    </div>
  );
}


function BosonNarrative() {
  const wrap = useRef(null);

  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const targetPos = useRef({ x: -9999, y: -9999 });

  const [isMobile, setIsMobile] = useState(false);

  /* =========================
     RESPONSIVE CHECK
  ========================= */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(mq);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  /* =========================
     SMOOTH MOUSE FOLLOW
  ========================= */
  useEffect(() => {
    if (isMobile) {
      setPos({ x: -9999, y: -9999 });
      targetPos.current = { x: -9999, y: -9999 };
      return;
    }

    let frame;
    const animate = () => {
      setPos((prev) => {
        const dx = targetPos.current.x - prev.x;
        const dy = targetPos.current.y - prev.y;
        const speed = 0.06;
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  /* =========================
     MOUSE MOVE
  ========================= */
  const handleMove = (e) => {
    if (!wrap.current || isMobile) return;
    const rect = wrap.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const text = `In the beginning, there is only possibility — a space where uncertainty sharpens into clarity, and the first contours of meaning begin to form, tracing the subtle forces that shape everything that follows`;

  /* =========================
     SHARED TEXT STYLE
     (CRITICAL: BASE & MASK IDENTICAL)
  ========================= */
  const textStyle = {
    width: "100%",
    whiteSpace: "pre-wrap",
    fontSize: "clamp(28px, 6vw, 74px)",
    lineHeight: 1.25,
    wordSpacing: -5,
    fontWeight: 400,
    textAlign: "justify",
    textAlignLast: "left",
    textIndent: "4rem",
    hyphens: "auto",
  };

  return (
    <div
      ref={wrap}
      onMouseMove={handleMove}
      className="boson-narrative-container w-full min-h-screen relative overflow-hidden flex items-center"
      style={{ padding: "120px 6vw" }}
    >
      {/* =========================
          BASE TEXT (DIM)
      ========================= */}
      <div
        style={{
          position: "relative",
          color: isMobile
            ? "rgba(255,255,255,0.96)"
            : "rgba(255,255,255,0.085)",
          ...textStyle,
        }}
      >
        {text}

        {/* =========================
            MASKED TEXT (BRIGHT)
        ========================= */}
        {!isMobile && (
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              color: "rgba(255,255,255,0.96)",
              ...textStyle,
              WebkitMaskImage: `
                radial-gradient(
                  900px circle at ${pos.x}px ${pos.y}px,
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.10) 30%,
                  rgba(255,255,255,0.02) 55%,
                  rgba(255,255,255,0) 100%
                )
              `,
              maskImage: `
                radial-gradient(
                  900px circle at ${pos.x}px ${pos.y}px,
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.10) 30%,
                  rgba(255,255,255,0.02) 55%,
                  rgba(255,255,255,0) 100%
                )
              `,
            }}
          >
            {text}
          </div>
        )}
      </div>

      {/* =========================
          MOBILE FIX
      ========================= */}
      <style>{`
        @media (max-width: 768px) {
          .boson-narrative-container {
            min-height: auto !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}


function IndustryItem({ title, logos }) {
  const [hovered, setHovered] = React.useState(false);

  const trackRef = React.useRef(null);
  const x = useMotionValue(0);
  const segmentWidthRef = React.useRef(0);

  const itemHeight = "clamp(36px, 6vw, 70px)";
  const expandedHeight = "150px";

  // ====== BUILD SEGMENTS ======
  const baseImages = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < 2; i++) out.push(...logos);
    return out;
  }, [logos]);

  const segmentImages = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < 3; i++) out.push(...baseImages);
    return out;
  }, [baseImages]);

  // ====== MEASURE WIDTH ======
  React.useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const total = el.scrollWidth;
      if (!total) return;
      segmentWidthRef.current = total / 2;
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // ====== INFINITE MARQUEE ENGINE ======
  useAnimationFrame((t, delta) => {
    const segmentWidth = segmentWidthRef.current;
    if (!segmentWidth) return;

    const speed = hovered ? 80 : 15;
    const move = (speed * delta) / 1000;

    let next = x.get() - move;

    if (next <= -segmentWidth) {
      next = next + segmentWidth;
    }

    x.set(next);
  });

  // ====== LOGO CARD ======
  const renderLogoCard = (src, key) => (
    <div
      key={key}
      style={{
        background: "rgba(255,255,255,0.15)",
        padding: "35px 40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        draggable={false}
        style={{
          height: "80px",
          objectFit: "contain",
        }}
      />
    </div>
  );

  // ====== SEGMENT BUILDER ======
  const renderSegment = (key) => (
    <div
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "30px",
        paddingRight: "40px",
      }}
    >
      {segmentImages.map((src, idx) =>
        renderLogoCard(src, `${key}-${idx}`)
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: hovered ? expandedHeight : itemHeight,
        transition: "height 0.35s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        padding: "45px 0",
        // fontFamily: 'Bricolage Grotesque'

      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* TEXT TITLE */}
      <h2
        style={{
          color: hovered ? "transparent" : "#F3F4F5",
          fontWeight: 400,
          fontSize: itemHeight,
          margin: 0,
          lineHeight: 1.1,
          transition: "color 0.25s ease",
          zIndex: 1,  
        }}
      >
        {title}
      </h2>

      {/* HEIGHT-ANIMATED WRAPPER */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: hovered ? expandedHeight : 0,
          overflow: "hidden",
          transition: "height 0.35s ease",
          pointerEvents: "none",
        }}
      >
        {/* CONTENT INSIDE THE SLIDE-DOWN PANEL */}
        <motion.div
          style={{
            height: expandedHeight,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          <motion.div
            ref={trackRef}
            style={{
              display: "flex",
              flexShrink: 0,
              x,
              willChange: "transform",
              whiteSpace: "nowrap",
            }}
          >
            {renderSegment("seg-1")}
            {renderSegment("seg-2")}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function IndustriesPage() {
  const industries = [
    {
      title: "Social Media Marketing",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
    {
      title: "Branding & Design",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
    {
      title: "Photo & Video Production",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
    {
      title: "Website & Commerce",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
    {
      title: "E-Commerce & Retail",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
    {
      title: "Fashion & Beauty",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
    {
      title: "Drone & Aerial Media",
      logos: [
        "/clients/dwm/logo.png",
        "/clients/marrosh/logo.png",
        "/clients/novo-ampang/logo.png",
        "/clients/sdg/logo.png",
        "/clients/sunny-village/logo.png",
        "/clients/solace/logo.png",
      ],
    },
  ];

  return (
    <div style={{ padding: "150px 20px", color: "#FDEBD3"}}>
      <h1
        style={{
          fontSize: "clamp(80px, 22vw, 300px)",
          fontWeight: "800",
          lineHeight: 0.9,
          margin: 0,
          textAlign: "center",
          fontFamily: 'Bricolage Grotesque',
          display: 'none'
        }}
      >
        INDUSTRIES
      </h1>

      <p style={{ textAlign: "center", marginBottom: "60px", display: 'none' }}>
        Backed by decades of experience
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {industries.map((item, i) => (
          <IndustryItem key={i} title={item.title} logos={item.logos} />
        ))}
      </div>
    </div>
  );
}


function MeetBoson() {
  const container = useRef(null);
  const maskGroup = useRef(null);

  useLayoutEffect(() => {
    if (!container.current || !maskGroup.current) return;

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const faceX = vw * 0.48;
      const faceY = vh * 0.42;

      const textNode = maskGroup.current.querySelector("text");

      const textX = parseFloat(textNode.getAttribute("x")) || 0;
      const totalLength = textNode.getComputedTextLength();
      const totalChars = textNode.getNumberOfChars();
      const lastIndex = totalChars - 1;
      const lastWidth = textNode.getSubStringLength(lastIndex, 1);

      const rightEdge = textX + totalLength;
      const lastLetterCenterX = rightEdge - lastWidth / 2;

      const centerTargetX = vw / 2;
      const shiftToCenter = centerTargetX - lastLetterCenterX;

      /** ---------------------------------------------------------
       *  GET SAFE SCALE — iterative solver
       *  memastikan SEMUA corner huruf keluar viewport
       * --------------------------------------------------------- */

      const box = maskGroup.current.getBBox();

      const boxCorners = [
        { x: box.x, y: box.y },
        { x: box.x + box.width, y: box.y },
        { x: box.x, y: box.y + box.height },
        { x: box.x + box.width, y: box.y + box.height },
      ];

      const viewportCorners = [
        { x: 0, y: 0 },
        { x: vw, y: 0 },
        { x: 0, y: vh },
        { x: vw, y: vh },
      ];

      const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

      const farViewport = Math.max(
        ...viewportCorners.map((v) => dist(faceX, faceY, v.x, v.y))
      );

      // 🔥 ITERATIVE SCALE COMPUTATION
      let scaleFinal = 1;
      for (let i = 1; i < 6000; i++) {
        const scaledDistances = boxCorners.map((c) => {
          const dx = c.x - faceX;
          const dy = c.y - faceY;
          return Math.hypot(dx * i, dy * i);
        });

        const farScaled = Math.max(...scaledDistances);
        if (farScaled >= farViewport * 1) {
          scaleFinal = i * 5.1;
          break;
        }
      }

      /** ---------------------------------------------------------
       *  BUILD SCROLL TIMELINE
       * --------------------------------------------------------- */

      const scrollLength = Math.round(vh * 1.6);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: true,
          pin: true,
        },
      });

      // Phase 1: shift horizontally
      tl.to(maskGroup.current, {
        x: shiftToCenter,
        ease: "none",
        duration: 0.5,
      });

      // Phase 2: scale zoom-out
      tl.to(
        maskGroup.current,
        {
          scale: scaleFinal,
          transformBox: "fill-box",
          svgOrigin: `${faceX} ${faceY}`,
          ease: "none",
          duration: 0.5,
        },
        0.5
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#000",
      }}
    >
      <video
        src="https://cdn.pixabay.com/video/2022/07/08/123523-728292591_large.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <mask
          id="text-mask"
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
        >
          <rect width="100%" height="100%" fill="white" />

          <g
            ref={maskGroup}
            fill="black"
            fontWeight="900"
            fontSize="110vh"
            letterSpacing="-0.05em"
          >
            <text x="0" y="60%" dominantBaseline="middle">
              TRANSFORMATION
            </text>
          </g>
        </mask>

        <rect width="100%" height="100%" fill="#09070b" mask="url(#text-mask)" />
      </svg>
    </section>
  );
}

function VideoSection() {
  const outerRef = useRef(null);
  const holeRef = useRef(null);
  const videoRef = useRef(null);
  const videoOverlayRef = useRef(null);
  const textRef = useRef(null);
  const processRef = useRef(null);
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);

  const sigilDiscoverRef = useRef(null);
  const sigilCreateRef = useRef(null);
  const sigilDeliverRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  const holeBaseW = 300;
  const holeBaseH = 450;
  const holeMaxScale = 7;

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const hole = holeRef.current;
    const video = videoRef.current;
    const overlay = videoOverlayRef.current;
    const text = textRef.current;
    const process = processRef.current;

    if (!outer || !hole || !video || !overlay || !text || !process) return;

    hole.style.width = `${holeBaseW}px`;
    hole.style.height = `${holeBaseH}px`;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(text, { opacity: 0 });

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "+=140%",
        scrub: 0.6,
      },
    });

    master
      .to(hole, { scale: holeMaxScale, ease: "none" }, 0)
      .fromTo(video, { scale: 1.6 }, { scale: 1, ease: "none" }, 0)
      .fromTo(overlay, { opacity: 0 }, { opacity: 0.55, ease: "none" }, 0.3)
      .fromTo(
        hLineRef.current,
        { x: "0%", opacity: 0.25 },
        { x: "18%", opacity: 0.4 },
        0
      )
      .fromTo(
        vLineRef.current,
        { y: "0%", opacity: 0.25 },
        { y: "18%", opacity: 0.4 },
        0
      )
      .fromTo(text, { opacity: 0 }, { opacity: 1 }, 0.4)
      .fromTo(
        process.children,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, stagger: 0.15, ease: "power2.out" },
        0.65
      );

    [sigilDiscoverRef, sigilCreateRef, sigilDeliverRef].forEach((ref) => {
      const svg = ref.current;
      if (!svg) return;

      svg.querySelectorAll("circle, line, rect, polyline").forEach((el, i) => {
        try {
          const L = el.getTotalLength();
          el.style.strokeDasharray = `${L} ${L}`;
          el.style.strokeDashoffset = L;
          el.style.opacity = 0.001;
          el.style.transition = `stroke-dashoffset 1.4s cubic-bezier(.2,.9,.2,1) ${
            i * 70
          }ms, opacity 300ms`;
          requestAnimationFrame(() => {
            el.style.strokeDashoffset = 0;
            el.style.opacity = 0.55;
          });
        } catch {}
      });
    });

    const loop = () => {
      tRef.current += 0.01;

      if (sigilDiscoverRef.current) {
        sigilDiscoverRef.current.style.transform = `rotate(${
          Math.sin(tRef.current) * 1.2
        }deg)`;
      }

      if (sigilCreateRef.current) {
        const s = 1 + Math.sin(tRef.current * 0.8) * 0.012;
        sigilCreateRef.current.style.transform = `scale(${s})`;
      }

      if (sigilDeliverRef.current) {
        sigilDeliverRef.current.style.transform = `translateY(${
          Math.sin(tRef.current * 1.2) * 1.2
        }px)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div ref={outerRef} style={{ height: "300vh", position: "relative" }}>
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "black",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          src="https://www.pexels.com/id-id/download/video/3888252/"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          ref={videoOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))",
            opacity: 0,
          }}
        />

        <div style={{ position: "absolute", inset: 0 }}>
          <div
            ref={hLineRef}
            style={{
              position: "absolute",
              top: "34%",
              left: 0,
              width: "32%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            }}
          />
          <div
            ref={vLineRef}
            style={{
              position: "absolute",
              left: "56%",
              top: 0,
              width: "1px",
              height: "32%",
              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.55), transparent)",
            }}
          />
        </div>

        <div
          ref={holeRef}
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderTopLeftRadius: "100rem",
            borderTopRightRadius: "100rem",
            boxShadow: "0 0 0 9999px black",
          }}
        />

        <div
          ref={textRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "10vh",
            paddingLeft: "14vw",
            color: "white",
            opacity: 0,
          }}
        >
          <div style={{ maxWidth: "1080px" }}>
            <h2
              style={{
                fontSize: "clamp(26px, 3.2vw, 40px)",
                lineHeight: "1.22",
                marginBottom: "72px",
                maxWidth: "620px",
              }}
            >
              If your content feels inconsistent
              <br />
              it’s not a content problem.
              <br />
              It’s a <span className="italic border-b border-gray-200">system</span> problem.
            </h2>

            <div
              ref={processRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
                gap: "56px",
              }}
            >
              {/* DISCOVER */}
              <div>
                <svg
                  ref={sigilDiscoverRef}
                  width="36"
                  height="36"
                  viewBox="0 0 100 100"
                  style={{ marginBottom: "14px" }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <line
                    x1="50"
                    y1="14"
                    x2="50"
                    y2="34"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <line
                    x1="86"
                    y1="50"
                    x2="66"
                    y2="50"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <line
                    x1="50"
                    y1="86"
                    x2="50"
                    y2="66"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <line
                    x1="14"
                    y1="50"
                    x2="34"
                    y2="50"
                    stroke="white"
                    strokeWidth="1"
                  />
                </svg>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.2)",
                    marginBottom: "20px",
                  }}
                />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
                  Discover
                </h3>
                <p
                  style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.8 }}
                >
                  Every project begins with curiosity. We dive deep into your
                  brand, audience, and goals to uncover insights that define
                  direction.
                </p>
              </div>

              {/* CREATE */}
              <div>
                <svg
                  ref={sigilCreateRef}
                  width="36"
                  height="36"
                  viewBox="0 0 100 100"
                  style={{ marginBottom: "14px" }}
                >
                  <rect
                    x="20"
                    y="20"
                    width="60"
                    height="60"
                    rx="8"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <circle cx="35" cy="35" r="3" fill="white" />
                  <circle cx="65" cy="35" r="3" fill="white" />
                  <circle cx="50" cy="65" r="3" fill="white" />
                  <line
                    x1="35"
                    y1="35"
                    x2="65"
                    y2="35"
                    stroke="white"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="65"
                    y1="35"
                    x2="50"
                    y2="65"
                    stroke="white"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="50"
                    y1="65"
                    x2="35"
                    y2="35"
                    stroke="white"
                    strokeWidth="0.8"
                  />
                </svg>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.2)",
                    marginBottom: "20px",
                  }}
                />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
                  Create
                </h3>
                <p
                  style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.85 }}
                >
                  Strategy transforms into visuals, words, and experiences
                  crafted to connect, inspire, and elevate presence.
                </p>
              </div>

              {/* DELIVER */}
              <div>
                <svg
                  ref={sigilDeliverRef}
                  width="36"
                  height="36"
                  viewBox="0 0 100 100"
                  style={{ marginBottom: "14px" }}
                >
                  <rect
                    x="26"
                    y="30"
                    width="48"
                    height="36"
                    rx="4"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <line
                    x1="20"
                    y1="70"
                    x2="80"
                    y2="70"
                    stroke="white"
                    strokeWidth="1.2"
                  />
                </svg>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.2)",
                    marginBottom: "20px",
                  }}
                />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
                  Deliver
                </h3>
                <p
                  style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.8 }}
                >
                  We refine, optimize, and launch across platforms — creating
                  work that performs, engages, and endures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


function ImageBurst({ src, motionProps, styleOverrides = {} }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        width: "260px",
        height: "260px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        transformStyle: "preserve-3d",

        // motion-linked props
        translateZ: motionProps.z,
        scale: motionProps.scale,
        x: motionProps.x,
        y: motionProps.y,
        opacity: motionProps.opacity,

        ...styleOverrides,
      }}
    >
      <img src={src} style={{ width: "100%" }} />
    </motion.div>
  );
}

function Projects() {
const scrollRef = useRef(null);

// ==================================================
// SECTION SCROLL (UNTUK VISUAL & TRANSISI)
// ==================================================
const { scrollYProgress } = useScroll({
  target: scrollRef,
  offset: ["start start", "end end"],
});

// ==================================================
// GLOBAL SCROLL (UNTUK DOT — NEVER STOPS)
// ==================================================
const { scrollY } = useScroll();

// normalize global scroll → smooth & slow
const spinBase = useTransform(scrollY, (v) => v * 0.5);

const rotate1 = useTransform(spinBase, (v) => v);
const rotate2 = useTransform(spinBase, (v) => -v * 0.65);
const rotate3 = useTransform(spinBase, (v) => v * 0.9);

// ==================================================
// LIGHT MODE TRANSITION
// ==================================================
const lightProgress = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

const bgColor = useTransform(
  lightProgress,
  [0, 1],
  ["rgb(0,0,0)", "#f3f4f5"]
);

const textColor = useTransform(
  lightProgress,
  [0, 1],
  ["rgb(255,255,255)", "rgb(0,0,0)"]
);

const orbitStroke = useTransform(
  lightProgress,
  [0, 1],
  ["rgba(255,255,255,0.15)", "rgba(0,0,0,0.15)"]
);

const dotFill = useTransform(
  lightProgress,
  [0, 1],
  ["rgb(255,255,255)", "rgb(0,0,0)"]
);

// ==================================================
// INTRO TEXT
// ==================================================
const { scrollYProgress: introProgress } = useScroll({
  target: scrollRef,
  offset: ["start end", "start start"],
});

const textOpacity = useTransform(introProgress, [0, 1], [0, 1]);
const textY = useTransform(introProgress, [0, 1], [-50, 0]);
const textFilter = useTransform(introProgress, [0, 1], [
  "blur(20px)",
  "blur(0px)",
]);

// ==================================================
// ORBIT GEOMETRY
// ==================================================
const c1 = { cx: 425, cy: 350, r: 250 };
const c2 = { cx: 325, cy: 500, r: 250 };
const c3 = { cx: 525, cy: 500, r: 250 };

const g1Ref = useRef(null);
const g2Ref = useRef(null);
const g3Ref = useRef(null);

useEffect(() => {
  const apply = (g, cx, cy, deg) => {
    if (!g) return;
    g.setAttribute("transform", `translate(${cx} ${cy}) rotate(${deg})`);
  };

  const u1 = rotate1.on("change", (v) =>
    apply(g1Ref.current, c1.cx, c1.cy, v)
  );
  const u2 = rotate2.on("change", (v) =>
    apply(g2Ref.current, c2.cx, c2.cy, v)
  );
  const u3 = rotate3.on("change", (v) =>
    apply(g3Ref.current, c3.cx, c3.cy, v)
  );

  return () => {
    u1();
    u2();
    u3();
  };
}, [rotate1, rotate2, rotate3]);

// ==================================================
// IMAGES
// ==================================================
const images = [
  "https://i.pinimg.com/736x/c3/b1/11/c3b11179de6c74c444bd740118c1ae7d.jpg",
  "https://i.pinimg.com/736x/6b/ce/00/6bce000cde7125363ff049f632983d0f.jpg",
  "https://i.pinimg.com/736x/58/e5/ce/58e5ce7dd757fc4e95c01a9d7ee3d909.jpg",
  "https://i.pinimg.com/736x/51/41/5f/51415fd5923fee1d9b0fc00b643c79c4.jpg",
  "https://i.pinimg.com/736x/eb/72/5d/eb725db13fc17d3b39c38d3436d09c69.jpg",
  "https://i.pinimg.com/1200x/69/f8/a5/69f8a548c9690f44b47d162dbfca1bf6.jpg",
  "https://i.pinimg.com/736x/12/9f/ae/129fae7341a77e1b3d7f5d8c7d7e8bab.jpg",
  "https://i.pinimg.com/736x/9e/a4/74/9ea474a7be64551feff14e34a6be5d4e.jpg",
  "https://i.pinimg.com/736x/a2/26/b8/a226b8c51836c051a70e347f8954d4a0.jpg",
  "https://i.pinimg.com/736x/ab/dc/6f/abdc6f50c425f07b45e2fc30b40e17e9.jpg",
  "https://i.pinimg.com/736x/e9/f3/39/e9f3398872917363f0960cb8aa74af9c.jpg",
  "https://i.pinimg.com/736x/13/7e/d3/137ed3f1af70ef163c5f69da71f47336.jpg",
  "https://i.pinimg.com/736x/7f/23/a2/7f23a222c82d121fbcad3d43ccfb416a.jpg",
  "https://i.pinimg.com/1200x/20/d4/a8/20d4a80fd78e7fa8ce05699860694b32.jpg",
  "/clients/tender-touch/6.jpg",
];

const baseStart = 0.15;
const step = 0.05;
const windowLen = 0.15;

const bursts = images.map((_, i) =>
  useTransform(
    scrollYProgress,
    [baseStart + i * step, baseStart + i * step + windowLen],
    [0, 1]
  )
);

const motionPropsList = bursts.map((b, i) => {
  const dir = i % 4;
  return {
    x: useTransform(b, [0, 1], [0, dir % 2 === 0 ? 240 : -240]),
    y: useTransform(b, [0, 1], [0, dir < 2 ? -200 : 200]),
    z: useTransform(b, [0, 1], [-2000, 3000]),
    scale: useTransform(b, [0, 1], [0.4, 1.1]),
    opacity: useTransform(b, [0, 0.05, 1], [0, 1, 1]),
  };
});

// ==================================================
// RENDER
// ==================================================
return (
  <motion.div
    ref={scrollRef}
    style={{
      width: "100%",
      height: "500vh",
      position: "relative",
      backgroundColor: bgColor,
    }}
  >
    <div
      style={{
        position: "sticky",
        top: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        pointerEvents: "none",
        perspective: "1800px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* ORBITS */}
      <svg viewBox="0 0 850 850" width="850" height="850">
        {[c1, c2, c3].map((c, i) => (
          <motion.circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill="none"
            strokeWidth="0.5"
            style={{ stroke: orbitStroke }}
          />
        ))}

        <motion.g ref={g1Ref}>
          <motion.circle cx={c1.r} cy={0} r={3} style={{ fill: dotFill }} />
        </motion.g>
        <motion.g ref={g2Ref}>
          <motion.circle cx={c2.r} cy={0} r={3} style={{ fill: dotFill }} />
        </motion.g>
        <motion.g ref={g3Ref}>
          <motion.circle cx={c3.r} cy={0} r={3} style={{ fill: dotFill }} />
        </motion.g>
      </svg>

      {/* TEXT */}
      <motion.div
        style={{
          opacity: textOpacity,
          y: textY,
          filter: textFilter,
          color: textColor,
          position: "absolute",
          fontSize: "43px",
          fontWeight: 200,
          lineHeight: 1,
          textAlign: "center",
          whiteSpace: "pre-line",
          zIndex: 10,
        }}
      >
        A world where uncertainty <br />
        becomes clarity.
      </motion.div>

      {/* IMAGES */}
      {images.map((src, i) => (
        <ImageBurst key={i} src={src} motionProps={motionPropsList[i]} />
      ))}
    </div>
  </motion.div>
);
}

function Galery() {
  const GRID_COLUMNS = 5;

  const LANES = [
    {
      col: 1,
      speed: -160,
      items: [
        { src: "/clients/tender-touch/10.jpg", top: "220vh" },
        {
          src: "https://i.pinimg.com/736x/b9/38/fc/b938fc84ffb5b038922947577be7ea29.jpg",
          top: "380vh",
        },
      ],
    },
    {
      col: 2,
      speed: 120,
      items: [
        {
          src: "https://cdn.dribbble.com/userupload/13311994/file/original-1b3e2a914e7aacef47d981ec6622517c.jpg",
          top: "80vh",
        },
        {
          src: "https://i.pinimg.com/736x/2f/ed/d1/2fedd195865fd1ba2476e88710a57ee1.jpg",
          top: "300vh",
        },
      ],
    },
    {
      col: 3,
      speed: -140,
      items: [
        { src: "/clients/tender-touch/5.jpg", top: "160vh" },
        { src: "/clients/dwm/2.jpg", top: "280vh" },
        {
          src: "https://i.pinimg.com/736x/bf/60/fc/bf60fc2805a33c05b5c567e7cbd5dc1e.jpg",
          top: "420vh",
        },
      ],
    },
    {
      col: 4,
      speed: 100,
      items: [
        {
          src: "https://cdn.dribbble.com/userupload/46029274/file/35dc49f9cb7ffa2053cc997a2af8c02e.jpg",
          top: "120vh",
        },
        {
          src: "https://i.pinimg.com/736x/15/2a/f8/152af8b5b5482d248fdded7c9229b656.jpg",
          top: "340vh",
        },
      ],
    },
    {
      col: 5,
      speed: -160,
      items: [
        {
          src: "https://cdn.dribbble.com/userupload/45119801/file/aee8f3c47fe2aec531b71ba1e1de78ff.jpg",
          top: "250vh",
        },
        {
          src: "https://i.pinimg.com/736x/de/98/e6/de98e6115337ff017e582de7e8526a7a.jpg",
          top: "430vh",
        },
      ],
    },
  ];

  const sectionRef = useRef(null);
  const textPinRef = useRef(null);
  const headlineRef = useRef(null);
  const cursorRef = useRef(null);

  // =========================
  // PARALLAX + PIN (DITAMBAH onEnter)
  // =========================
  useEffect(() => {
    gsap.utils.toArray(".lane").forEach((lane, i) => {
      const speed = LANES[i].speed;

      gsap.fromTo(
        lane,
        { y: speed * -0.35 },
        {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        }
      );
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: textPinRef.current,
      pinSpacing: false,
      onEnter: () => playHeadline(), // 🔥 KUNCI
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // =========================
  // HEADLINE PLAY (NO SCROLLTRIGGER)
  // =========================
  const playHeadline = () => {
    if (!headlineRef.current) return;

    document.fonts.ready.then(() => {
      gsap.set(headlineRef.current, { opacity: 1 });

      const split = SplitText.create(headlineRef.current, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      gsap.from(split.lines, {
        yPercent: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power2.out",
      });
    });
  };

  // =========================
  // CUSTOM CURSOR DOT
  // =========================
  useEffect(() => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor) return;

    const move = (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const enter = () => {
      section.style.cursor = "none";
      cursor.style.opacity = "1";
    };

    const leave = () => {
      section.style.cursor = "auto";
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", move);
    section.addEventListener("mouseenter", enter);
    section.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      section.removeEventListener("mouseenter", enter);
      section.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      {/* CUSTOM CURSOR DOT */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0"
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "white",
          transform: "translate(-50%, -50%)",
        }}
      />

      <section
        ref={sectionRef}
        className="relative min-h-[480vh] bg-black text-white overflow-hidden"
      >
        {/* GRID */}
        <div
          className="absolute inset-0 z-10 pointer-events-none grid"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)` }}
        >
          {Array.from({ length: GRID_COLUMNS }).map((_, i) => (
            <div
              key={i}
              className="border-r border-white/20 last:border-r-0"
            />
          ))}
        </div>

        {/* PINNED TEXT */}
        <div
          ref={textPinRef}
          className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center z-30 pointer-events-none"
        >
          <div className="text-center max-w-[90vw] px-6">
            <span className="block text-[11px] tracking-[0.22em] opacity-80 mb-6">
              GET STARTED
            </span>

            <h1
              ref={headlineRef}
              className="font-light leading-[1.08] text-[clamp(44px,6.2vw,76px)] opacity-0"
            >
              Let&apos;s make
              <br />
              things happen.
            </h1>
          </div>
        </div>

        {/* IMAGES */}
        <div
          className="absolute inset-0 z-20 grid"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)` }}
        >
          {LANES.map((lane, i) => (
            <div
              key={i}
              className="lane relative h-full flex justify-center"
              style={{ gridColumn: lane.col }}
            >
              {lane.items.map((item, j) => (
                <figure
                  key={j}
                  className="absolute w-[240px] aspect-[3/4] bg-neutral-900 overflow-hidden"
                  style={{ top: item.top }}
                >
                  <img
                    src={item.src}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>

        {/* FADES */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-[240px] z-40 bg-gradient-to-b from-black via-black/90 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[360px] z-40 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </section>
    </>
  );
}


function BigHeading() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  const topX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const bottomX = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div
      ref={ref}
      className="relative bg-black overflow-hidden w-full big-heading-container"
      style={{ height: "130vh" }}
    >
      <div
        className="big-heading-sticky pointer-events-none"
        style={{ position: "sticky", top: 0, width: "100%", height: "150vh" }}
      >

        {/* TOP */}
        <div
          className="big-heading-top-wrapper flex justify-center items-end overflow-hidden"
          style={{ height: "75vh" }}
        >
          <motion.div
            className="big-heading-top flex whitespace-nowrap"
            style={{
              x: topX,
              transform: "translateY(10%)",
              color: "white",
              fontSize: "30vw",
              fontWeight: 600,
              lineHeight: 0.8,
              opacity: 0.9,
              textTransform: "uppercase",
              gap: "4vw",
            }}
          >
            <span>Work -</span>
            <span>Work -</span>
            <span>Work</span>
          </motion.div>
        </div>

        {/* BOTTOM */}
        <div
          className="big-heading-bottom-wrapper flex justify-center items-start overflow-hidden"
          style={{ height: "75vh" }}
        >
          <motion.div
            className="big-heading-bottom flex whitespace-nowrap"
            style={{
              x: bottomX,
              transform: "translateY(-10%)",
              color: "#3a3a3a",
              fontSize: "30vw",
              fontWeight: 600,
              lineHeight: 0.8,
              opacity: 0.45,
              textTransform: "uppercase",
              gap: "4vw",
            }}
          >
            <span>Experiences -</span>
            <span>Experiences -</span>
            <span>Experiences</span>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media(max-width: 1023px) {
          .big-heading-container {
            height: auto !important;
          }
          .big-heading-sticky {
            position: static !important;
            height: auto !important;
          }
          .big-heading-top-wrapper,
          .big-heading-bottom-wrapper {
            height: auto !important;
            padding: 2vh 0 !important; /* ← DIPERAPAT */
          }
        }

        @media(max-width: 600px) {
          .big-heading-top,
          .big-heading-bottom {
            font-size: 22vw !important;
          }
        }
      `}</style>
    </div>
  );
}


function MarqueeOverlay({ item, active }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const segmentWidthRef = useRef(0);

  // ====== MEASURE WIDTH ======
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const total = el.scrollWidth;
      if (!total) return;
      segmentWidthRef.current = total / 2;
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ====== INFINITE SCROLL ======
  useAnimationFrame((t, delta) => {
    const segmentWidth = segmentWidthRef.current;
    if (!segmentWidth) return;

    const speed = active ? 180 : 30;
    const move = (speed * delta) / 1000;

    let next = x.get() - move;

    if (next <= -segmentWidth) {
      const overshoot = next + segmentWidth;
      next = overshoot;
    }

    x.set(next);
  });

  // ============ DETECT LOGO ============
  const isLogo = (src) => {
    const l = src.toLowerCase();
    return l.includes("logo") || l.endsWith(".png");
  };

  // ============ RENDER IMAGE / LOGO ============
  const renderImageCard = (src, key) => {
    if (isLogo(src)) {
      return (
        <img
          key={key}
          src={src}
          draggable={false}
          style={{
            height: "13vh",
            width: "auto",
            objectFit: "contain",
            filter: "invert(1) brightness(0)", // jadi hitam
            flexShrink: 0,
          }}
        />
      );
    }

    return (
      <img
        key={key}
        src={src}
        draggable={false}
        style={{
          height: "13vh",
          width: "32vh",
          borderRadius: "6vh",
          objectFit: "cover",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          flexShrink: 0,
          background: "black",
        }}
      />
    );
  };

  // Base images untuk marquee
  const baseImages = useMemo(
    () => [item.image1, item.image2, item.image1, item.image2],
    [item.image1, item.image2]
  );

  const segmentImages = useMemo(() => {
    const out = [];
    for (let i = 0; i < 3; i++) out.push(...baseImages);
    return out;
  }, [baseImages]);

  const renderSegment = (key) => (
    <div
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4vw",
        paddingRight: "4vw",
      }}
    >
      {segmentImages.map((src, idx) =>
        renderImageCard(src, `${key}-${idx}`)
      )}
    </div>
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: "100%",
        height: "22vh",
        transform: "translateY(-50%)",
        overflow: "hidden",
        zIndex: 2,
        pointerEvents: "none",
        background: active ? "white" : "transparent",
        opacity: active ? 1 : 0,
        display: "flex",
        alignItems: "center",
        padding: "0 3vw",
      }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        ref={trackRef}
        style={{
          display: "flex",
          flexShrink: 0,
          x,
          willChange: "transform",
        }}
      >
        {renderSegment("seg-1")}
        {renderSegment("seg-2")}
      </motion.div>
    </motion.div>
  );
}


function WorksList() {
  const items = [
    {
      industry: "Fitness",
      name: "Tender Touch",
      year: "2025",
      image1: "/clients/tender-touch/2.jpg",
      image2: "/clients/tender-touch/main.jpg",
    },
    {
      industry: "Real Estate",
      name: "Hidden City Ubud",
      year: "2025",
      image1: "/clients/hidden-city-ubud/main.jpg",
      image2: "/clients/hidden-city-ubud/2.jpg",
    },
    {
      industry: "Real Estate",
      name: "DWM",
      year: "2025",
      image1: "/clients/dwm/5.jpg",
      image2: "/clients/dwm/logo.png",
    },
    {
      industry: "Food & Beverage",
      name: "Marrosh",
      year: "2025",
      image1: "/clients/marrosh/9.jpg",
      image2: "/clients/marrosh/logo.png",
    },
    {
      industry: "Real Estate",
      name: "NOVO",
      year: "2025",
      image1: "/clients/novo-ampang/main.jpg",
      image2: "/clients/novo-ampang/logo.png",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      style={{
        background: "black",
        width: "100%",
        padding: "6vh 0",
        position: "relative",
      }}
    >
      {/* ===============================
         SECTION DESCRIPTION (CENTER)
      =============================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "5vh",
          color: "white",
        }}
      >
        <p
          style={{
            fontSize: "1.1vw",
            maxWidth: "42vw",
            lineHeight: 1.45,
            opacity: 0.75,
            textAlign: "center",
          }}
        >
          A selection of work across different industries
          <br/>
          each shaped by its own context and way of working 
        </p>
      </div>

      {/* ===============================
         WORK LIST
      =============================== */}
      {items.map((item, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            width: "100%",
            padding: "4.5vh 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "grid",
            gridTemplateColumns: "1fr 2.2fr 1fr",
            alignItems: "center",
            color: "white",
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {/* WHITE OVERLAY */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              transformOrigin: "center center",
              zIndex: 1,
              pointerEvents: "none",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: hoveredIndex === i ? 1 : 0 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* MARQUEE OVERLAY */}
          <MarqueeOverlay item={item} active={hoveredIndex === i} />

          {/* TEXT ROW */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "contents",
            }}
          >
            <div
              style={{
                fontSize: "0.9vw",
                opacity: 0.7,
                paddingLeft: "3vw",
                letterSpacing: "0.03em",
              }}
            >
              {item.industry}
            </div>

            <div
              style={{
                fontSize: "3.8vw",
                fontWeight: 300,
                textAlign: "center",
                lineHeight: 0.95,
                whiteSpace: "nowrap",
                letterSpacing: "-0.03em",
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                fontSize: "0.9vw",
                textAlign: "right",
                paddingRight: "3vw",
                opacity: 0.7,
                letterSpacing: "0.03em",
              }}
            >
              {item.year}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

  
function BosonScrollText() {
  const wrapRef = React.useRef(null);
  const hoverRef = React.useRef(null);

  const pointer = React.useRef({ x: 0, y: 0 });
  const isHovering = React.useRef(false);
  const lastSpawn = React.useRef(0);
  const liveImages = React.useRef(new Set());

  const IMAGES = [
    "https://i.pinimg.com/736x/a2/32/3b/a2323b00992937f19158ab588d7b3ae5.jpg",
    "https://i.pinimg.com/736x/41/d8/c2/41d8c260bead65dda136dc36ff050f53.jpg",
    "https://i.pinimg.com/736x/ab/24/1d/ab241d4ee15a8eec9865cfcde25c1928.jpg",
    "https://i.pinimg.com/736x/2f/ef/f9/2feff9fa223efc86f58b0dac8a329b78.jpg",
    "https://i.pinimg.com/736x/81/80/76/818076e4dab04be9bcf90b81af06edfa.jpg",
  ];

  const TEXT = `A clear brand direction and growth that moves the business forward`;

  // ================= SPLIT TEXT =================
  const words = TEXT.trim().split(/(\s+)/);
  const chars = [];
  words.forEach((word) => {
    if (word.trim().length === 0) {
      chars.push({ type: "space", char: " " });
      return;
    }

    chars.push({
      type: "word",
      chars: word.split("").map((c) => ({ char: c })),
    });
  });

  // ================= SCROLL TEXT =================
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const characters = Array.from(wrap.querySelectorAll(".bf-char"));
    const total = characters.length;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 90%",
      end: "+=75%",
      scrub: 0.2,
      onUpdate: (self) => {
        const filled = self.progress * total;
        const full = Math.floor(filled);
        const frac = filled - full;

        characters.forEach((el) => {
          el.classList.remove("filled", "partial");
          el.style.setProperty("--partial", "0%");
        });

        for (let i = 0; i < full; i++) {
          characters[i]?.classList.add("filled");
        }

        if (characters[full]) {
          characters[full].classList.add("partial");
          characters[full].style.setProperty(
            "--partial",
            `${Math.round(frac * 100)}%`
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  // ================= HOVER IMAGE (MOVE-BASED) =================
  React.useEffect(() => {
    const area = hoverRef.current;
    if (!area) return;

    const spawnImage = () => {
      const img = document.createElement("img");
      img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];

      img.style.position = "absolute";
      img.style.left = pointer.current.x + "px";
      img.style.top = pointer.current.y + "px";
      img.style.width = "180px";
      img.style.height = "240px";
      img.style.objectFit = "cover";
      img.style.pointerEvents = "none";
      img.style.zIndex = "40";
      img.style.transform = "translate(-50%, -50%) scale(0.85)";
      img.style.opacity = "0";

      area.appendChild(img);
      liveImages.current.add(img);

      const intro = gsap.to(img, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      });

      const outro = gsap.to(img, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: 0.9,
        ease: "power2.inOut",
        onComplete: () => {
          liveImages.current.delete(img);
          img.remove();
        },
      });

      img._tweens = [intro, outro];
    };

    const onMove = (e) => {
      if (!isHovering.current) return;

      const now = performance.now();
      if (now - lastSpawn.current < 120) return;
      lastSpawn.current = now;

      const rect = area.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;

      spawnImage();
    };

    const onEnter = () => {
      isHovering.current = true;
    };

    const onLeave = (e) => {
      isHovering.current = false;

      // keluar window → jangan bunuh
      if (!e.relatedTarget) return;

      liveImages.current.forEach((img) => {
        if (img._tweens) img._tweens.forEach((t) => t.kill());
        img.remove();
      });

      liveImages.current.clear();
    };

    area.addEventListener("mousemove", onMove);
    area.addEventListener("mouseenter", onEnter);
    area.addEventListener("mouseleave", onLeave);

    return () => {
      area.removeEventListener("mousemove", onMove);
      area.removeEventListener("mouseenter", onEnter);
      area.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="bf-page" ref={hoverRef}>
      <style jsx>{`
        .bf-page {
          position: relative;
          width: 100vw;
          min-height: 101vh;
          background: #f3f4f5;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          overflow: hidden;
        }

        .bf-header {
          padding: 3vh 7.9vw 0;
          text-align: center;
        }

        .bf-header-title {
          font-family: Inter, sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          font-weight: 700;
          text-transform: uppercase;
          color: #0b0f14;
        }

        .bf-header-sub {
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          opacity: 0.75;
        }

        .bf-outer {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10vh 7.9vw;
        }

        .bf-wrap {
          width: min(1300px, 92%);
          text-align: center;
          line-height: 1.05;
        }

        .bf-word {
          display: inline-block;
          white-space: nowrap;
          margin-right: 0.4rem;
        }

        .bf-char {
          display: inline-block;
          font-family: Inter, sans-serif;
          font-weight: 1000;
          font-size: clamp(48px, 18vw, 84px);
          line-height: 0.98;
          color: rgba(0, 0, 0, 0.25);
          background-clip: text;
          -webkit-background-clip: text;
          text-transform: uppercase;
        }

        .bf-char.filled {
          color: #000;
        }

        .bf-char.partial {
          color: transparent;
          background-image: linear-gradient(
            90deg,
            #000 var(--partial),
            rgba(0, 0, 0, 0.25) var(--partial)
          );
        }

        .bf-footer {
          padding: 0 7.9vw 4vh;
          text-align: center;
        }

        .bf-footer-text {
          font-family: Georgia, serif;
          font-size: 14px;
          font-style: italic;
          opacity: 0.85;
        }
      `}</style>

      <header className="bf-header">
        <div className="bf-header-title">
          We Work With The Biggest Brands
        </div>
        <div className="bf-header-sub">From Around the World</div>
      </header>

      <div className="bf-outer">
        <div className="bf-wrap" ref={wrapRef}>
          {chars.map((item, i) =>
            item.type === "space" ? (
              <span key={i}>&nbsp;</span>
            ) : (
              <span className="bf-word" key={i}>
                {item.chars.map((c, j) => (
                  <span key={j} className="bf-char">
                    {c.char}
                  </span>
                ))}
              </span>
            )
          )}
        </div>
      </div>

      <footer className="bf-footer">
        <div className="bf-footer-text">
          And We’re Clued Up on Culture…
        </div>
      </footer>
    </div>
  );
}


function ServicesHero() {
  const cursorRef = useRef(null);
  const sectionRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [inside, setInside] = useState(false);

  // =====================
  // CUSTOM CURSOR FOLLOW (SECTION ONLY)
  // SCALE REVEAL + SCALE VANISH
  // =====================
  useEffect(() => {
    const cursor = cursorRef.current;
    const section = sectionRef.current;
    if (!cursor || !section) return;

    const move = (e) => {
      const rect = section.getBoundingClientRect();

      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // position always updates
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      setInside(isInside);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // =====================
  // DATA
  // =====================
  const services = [
    {
      label: "Social Media Marketing",
      image:
        "https://i.pinimg.com/736x/20/dc/20/20dc2018ff68b43705e167cfd0452b85.jpg",
    },
    {
      label: "Content Production",
      image:
        "https://i.pinimg.com/736x/2e/14/bd/2e14bda3c06055b6345f718e2ea23620.jpg",
    },
    {
      label: "Branding",
      image:
        "https://i.pinimg.com/1200x/f7/91/37/f79137ca724f78b5e0dd7e4820ad13f2.jpg",
    },
    {
      label: "Website Development",
      image:
        "https://i.pinimg.com/736x/ef/82/3e/ef823e9611b89a12bb0503bfb8dc0ec5.jpg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F3F4F5] text-black overflow-hidden cursor-none"
    >
      {/* ===================== */}
      {/* CUSTOM GREEN CURSOR */}
      {/* SCALE REVEAL */}
      {/* ===================== */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          transform: "translate3d(-9999px, -9999px, 0)",
        }}
      >
        <div
          className="w-[70px] h-[70px] rounded-full bg-[#C8FF4D] flex items-center justify-center"
          style={{
            transform: inside ? "scale(1)" : "scale(0)",
            opacity: inside ? 1 : 0,
            transition:
              "transform 220ms cubic-bezier(0.22,1,0.36,1), opacity 180ms ease-out",
            transformOrigin: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
      </div>

      <div className="max-w-screen mx-auto h-full px-6 sm:px-8 lg:px-16 py-10 sm:py-12 flex flex-col">
        {/* ===================== */}
        {/* TOP BAR */}
        {/* ===================== */}
        <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between gap-8 pt-4 sm:pt-6">
          <div className="text-sm text-gray-600 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-black/80 inline-block" />
            <span className="opacity-80">Our Expertise</span>
          </div>

          <h2 className="text-center text-black font-medium leading-tight max-w-[700px] mx-auto md:mx-0 text-[clamp(22px,4vw,40px)]">
            How we take your <br className="hidden sm:block" />
            business to the next level
          </h2>

          <div className="hidden lg:flex flex-col items-end text-right max-w-xs">
            <p className="text-gray-600 text-sm leading-relaxed">
              We are a digital marketing agency with expertise, and we're on a
              mission to help you take the next step in your business.
            </p>
          </div>
        </div>

        {/* ===================== */}
        {/* MAIN CONTENT */}
        {/* ===================== */}
        <div className="relative flex-1 mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
          <div className="hidden xl:block xl:col-span-2" />

          <div className="col-span-1 lg:col-span-12 xl:col-span-10 flex flex-col">
            {services.map((item, i) => {
              const isHovering = hoverIndex !== null;
              const isActive = hoverIndex === i;

              const words = item.label.split(" ");
              const lastWord = words.at(-1);
              const firstLine = words.slice(0, -1).join(" ");

              const colorState = !isHovering
                ? "text-black"
                : isActive
                ? "text-black"
                : "text-black/30";

              return (
                <div
                  key={item.label}
                  className="py-6 sm:py-8"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div className="flex items-center">
                    <div
                      className={`relative h-[110px] overflow-hidden transition-all duration-300 ease-out w-[160px] mr-6 xl:w-0 xl:mr-0 ${
                        isActive ? "xl:w-[160px] xl:mr-8" : ""
                      }`}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className={`h-full w-full object-cover rounded-md transition-all duration-300 ease-out opacity-100 scale-100 xl:opacity-0 xl:scale-95 ${
                          isActive ? "xl:opacity-100 xl:scale-100" : ""
                        }`}
                      />
                    </div>

                    <h3
                      className={`hidden sm:block font-sans font-semibold tracking-tight leading-[1.05] transition-colors duration-150 ${colorState}`}
                      style={{
                        fontSize: "clamp(36px, 7vw, 95px)",
                      }}
                    >
                      {item.label}
                    </h3>

                    <h3
                      className={`block sm:hidden flex flex-col tracking-tight transition-colors duration-150 ${colorState}`}
                    >
                      <span className="text-[18px] font-light leading-none opacity-70 mb-1">
                        {firstLine}
                      </span>
                      <span
                        className="font-semibold leading-[0.95]"
                        style={{
                          fontSize: "clamp(34px, 8.5vw, 60px)",
                        }}
                      >
                        {lastWord}
                      </span>
                    </h3>
                  </div>

                  <div className="mt-4 sm:mt-6 border-t border-black/10 w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}









function Description() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const rightRef = useRef(null);

  useLayoutEffect(() => {
    let headlineTween;

    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {

        /* =========================
           LEFT — HEADLINE
        ========================= */

        gsap.set(titleRef.current, { opacity: 1 });

        SplitText.create(titleRef.current, {
          type: "lines,words",
          linesClass: "line",
          autoSplit: true,
          mask: "lines",
          onSplit(self) {
            headlineTween = gsap.from(self.lines, {
              yPercent: 40,
              opacity: 0,
              duration: 1.2,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 72%",
                once: true,
              },
            });

            return headlineTween;
          },
        });

        /* =========================
           RIGHT — BODY COPY
        ========================= */

        const paragraphs =
          rightRef.current.querySelectorAll("p[data-animate]");

        paragraphs.forEach((p) => {
          const split = SplitText.create(p, {
            type: "lines",
            linesClass: "line",
            autoSplit: true,
            mask: "lines",
          });

          gsap.from(split.lines, {
            yPercent: 38,
            opacity: 0,
            duration: 1.3,
            stagger: 0.04,
            ease: "power1.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              once: true,
            },
          });
        });

        /* =========================
           STATS — OWN TRIGGER (FINAL FIX)
        ========================= */

        const statsGrid = rightRef.current.querySelector(
          ".grid.grid-cols-1.sm\\:grid-cols-3"
        );

        if (!statsGrid) return;

        const stats = Array.from(statsGrid.children);

        stats.forEach((stat) => {
          const icon = stat.querySelector("svg");
          const value = stat.querySelector("div");
          const desc = stat.querySelector("p");

          gsap.set([icon, value, desc], {
            opacity: 0,
            y: 12,
          });
        });

        ScrollTrigger.create({
          trigger: statsGrid,
          start: "top 85%",
          once: true,
          onEnter: () => {
            stats.forEach((stat, i) => {
              const icon = stat.querySelector("svg");
              const value = stat.querySelector("div");
              const desc = stat.querySelector("p");

              const tl = gsap.timeline({
                delay: i * 0.15,
              });

              tl.to(icon, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
              })
                .to(
                  value,
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                  },
                  "-=0.35"
                )
                .to(
                  desc,
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power1.out",
                  },
                  "-=0.3"
                );
            });
          },
        });
      });
    }, sectionRef);

    return () => {
      if (headlineTween) headlineTween.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#F3F4F5] text-black py-32">
      <div className="max-w-screen mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT — HEADLINE */}
        <div className="lg:col-span-7">
          <h1
            ref={titleRef}
            className="font-sans font-medium leading-[1.15] tracking-tight text-black opacity-0"
            style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
          >
            We are a social media agency that helps brands stay{" "}
            <span className="italic">consistent</span> online. We keep
            everything on track so you can stay focused on what{" "}
            <span className="italic">matters.</span>
          </h1>
        </div>

        {/* RIGHT — COPY + STATS */}
        <div
          ref={rightRef}
          className="lg:col-span-5 flex flex-col text-neutral-800 text-[17px] leading-relaxed"
        >
          <p data-animate className="mb-5">
            Boson is a digital agency founded in 2021 and based in Bali, working
            with clients across Qatar, Malaysia, and other regions. We focus on
            creating structured, reliable systems for brands that want to scale
            with confidence.
          </p>

          <p data-animate className="mb-5">
            Our work combines design, development, and brand operations, giving
            teams a toolkit that keeps everything consistent — from visuals to
            messaging to digital experience. No clutter, no unnecessary layers.
          </p>

          <p data-animate className="mb-6">
            Whether you're refining a brand or building a new digital
            foundation, Boson brings clarity, process, and long-term stability
            to the table.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-black/20">
            <div className="flex flex-col gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>

              <div className="text-[34px] font-semibold tracking-[-0.02em]">
                100+
              </div>

              <p className="text-sm text-neutral-500 leading-snug">
                Large-scale projects delivered for festivals, agencies, and
                brands.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>

              <div className="text-[34px] font-semibold tracking-[-0.02em]">
                3+
              </div>

              <p className="text-sm text-neutral-500 leading-snug">
                Markets served across Qatar, Indonesia, and Malaysia.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
              </svg>

              <div className="text-[34px] font-semibold tracking-[-0.02em]">
                2.5m
              </div>

              <p className="text-sm text-neutral-500 leading-snug">
                Audience reached across digital platforms and brand campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





function ProjectShowcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    {
      id: "01",
      title: "Real Estate &\nProperty",
      image:
        "https://plus.unsplash.com/premium_photo-1678903964473-1271ecfb0288?w=900&auto=format&fit=crop&q=60",
      meta: ["PRODUCTION", "LONDON", "EDELMAN", "XBOX"],
      desc:
        "A 6×3 metre renaissance-style oil painting to support the launch of Xbox’s flagship video game, Halo Infinite.",
    },
    {
      id: "02",
      title: "Food &\nBeverage",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1365&auto=format&fit=crop",
      meta: ["BRANDING", "BERLIN", "NIKE"],
      desc:
        "A visual identity system exploring silence, tension, and modern athletic discipline.",
    },
    {
      id: "03",
      title: "Lifestyle &\nHospitality",
      image:
        "https://images.unsplash.com/photo-1583873743670-6d60e445a7e2?q=80&w=987&auto=format&fit=crop",
      meta: ["EXPERIMENT", "TOKYO", "SONY"],
      desc:
        "An experimental campaign blending digital ritual, motion, and sound design.",
    },
    {
      id: "04",
      title: "Drone &\nAerial Media",
      image:
        "https://images.unsplash.com/photo-1533358122925-6eb2658855bb?q=80&w=1335&auto=format&fit=crop",
      meta: ["EXPERIMENT", "TOKYO", "SONY"],
      desc:
        "An experimental campaign blending digital ritual, motion, and sound design.",
    },
  ];

  useLayoutEffect(() => {
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const progressBar = progressRef.current;

      const totalWidth = track.scrollWidth - window.innerWidth;

      // =====================
      // MAIN HORIZONTAL SCROLL
      // =====================
      const mainTween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate(self) {
            gsap.set(progressBar, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });

            setActiveIndex(
              Math.min(
                projects.length - 1,
                Math.floor(self.progress * projects.length)
              )
            );
          },
        },
      });

      // =====================
      // PARALLAX LAYERS
      // =====================
      gsap.utils.toArray(".parallax-title").forEach((el) => {
        gsap.fromTo(
          el,
          { x: 40 },
          {
            x: -40,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: mainTween,
              start: "left right",
              end: "right left",
              scrub: 0.6,
            },
          }
        );
      });

      gsap.utils.toArray(".parallax-image").forEach((el) => {
        gsap.fromTo(
          el,
          { x: 90 },
          {
            x: -90,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: mainTween,
              start: "left right",
              end: "right left",
              scrub: 0.6,
            },
          }
        );
      });

      gsap.utils.toArray(".parallax-meta").forEach((el) => {
        gsap.fromTo(
          el,
          { x: 140 },
          {
            x: -140,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: mainTween,
              start: "left right",
              end: "right left",
              scrub: 0.6,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-hidden lg:h-screen"
    >
      {/* ===============================
         STATIC SECTION LABEL (DIAM)
      =============================== */}
      <div className="hidden lg:block absolute top-16 left-16 z-40 pointer-events-none">
        <span className="text-xs tracking-[0.32em] uppercase text-white/50">
          Industries We Serve
        </span>
      </div>

      {/* ===============================
         HORIZONTAL TRACK
      =============================== */}
      <div className="relative lg:absolute lg:inset-0">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row"
          style={{
            width:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? `${projects.length * 100}vw`
                : "100%",
          }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              className="relative w-full lg:w-screen min-h-screen flex-shrink-0"
            >
              <div className="relative max-w-[1600px] mx-auto h-full px-6 lg:px-16 pt-24 pb-32 grid grid-cols-1 lg:grid-cols-12">
                <span className="lg:col-span-12 text-xs tracking-widest text-white/50">
                   {p.id}
                </span>

                <h1 className="parallax-title lg:absolute lg:left-16 lg:top-[45%] text-[96px] leading-[0.95] font-light whitespace-pre-line z-20">
                  {p.title}
                </h1>

                <div className="lg:col-span-4 lg:col-start-5 flex justify-center z-10">
                  <div className="parallax-image relative w-[420px] aspect-[3/4]">
                    <img
                      src={p.image}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="parallax-meta lg:col-span-3 lg:col-start-9 flex flex-col gap-6 justify-end">
                  <div className="space-y-2 text-xs">
                    {p.meta.map((m) => (
                      <p key={m} className="underline">
                        {m}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-white/60">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===============================
         PROGRESS
      =============================== */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 px-28 pb-6">
        <div className="h-[1px] bg-white/20">
          <div
            ref={progressRef}
            className="h-full bg-white origin-left scale-x-0"
          />
        </div>
        <div className="mt-4 text-sm">
          [ {activeIndex + 1} — {projects.length} ]
        </div>
      </div>
    </section>
  );
}



function Footer() {
  return (
    <footer className="relative w-full bg-[#c9574b] text-white overflow-hidden">
      {/* ========================= */}
      {/* MAIN GRID */}
      {/* ========================= */}
      <div className="relative z-[2] px-[80px] py-[140px] max-[900px]:px-6 max-[900px]:py-[100px]">
        <div className="grid grid-cols-[1.2fr_0.8fr_1fr] gap-20 max-[1100px]:grid-cols-1 max-[1100px]:gap-16">

          {/* LEFT — IDENTITY */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[48px] font-light leading-[1.1] tracking-tight max-[900px]:text-[36px]">
              Ready to talk?<br />
              Let’s build something<br />
              that actually lasts.
            </h2>

            <p className="text-sm text-white/75 max-w-[420px] leading-relaxed">
              Share your ideas with us and we’ll begin turning your vision into
              something clear, sharp, and executable.
            </p>

            <a
              href="mailto:boson.studio@gmail.com"
              className="mt-6 inline-flex items-center gap-3 text-sm tracking-wide text-white/80 hover:text-white transition"
            >
              Get in touch →
            </a>
          </div>

          {/* CENTER — NAV */}
          <div className="flex flex-col divide-y divide-white/15 border border-white/15 bg-white/5 backdrop-blur">
            {[
              "Home",
              "Projects",
              "What We Do",
              "Latest News",
              "Get In Touch",
            ].map((item) => (
              <a
                key={item}
                className="px-8 py-6 flex items-center justify-between text-sm tracking-wide hover:bg-white/10 transition"
              >
                <span>{item}</span>
                <span className="opacity-60">↗</span>
              </a>
            ))}
          </div>

          {/* RIGHT — CONTACT */}
          <div className="flex flex-col gap-6 text-sm text-white/75">
            <div>
              <div className="text-white/50 mb-1">Email</div>
              <div>boson.studio@gmail.com</div>
            </div>

            <div>
              <div className="text-white/50 mb-1">Base</div>
              <div>Bali, Indonesia</div>
            </div>

            <div>
              <div className="text-white/50 mb-1">Working</div>
              <div>Worldwide</div>
            </div>

            <div className="flex gap-4 mt-4 text-xs text-white/60">
              <a className="hover:text-white transition">Behance</a>
              <a className="hover:text-white transition">LinkedIn</a>
              <a className="hover:text-white transition">Contact</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}


 


 
 


/* ==========================================
   PAGE
   ========================================== */

   export default function Page() {
    const ready = useContext(LoaderContext);
    const bgRef = useRef(null);
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    useEffect(() => {
      if (!ready) return;
  
      const el = bgRef.current;
  
      // ===== BACKGROUND SCROLL TRANSITION bg-[#F3F4F5]===== 
      // (versi NON-SCRUB → scroll cuma memicu animasi)
      // ScrollTrigger.create({
      //   trigger: ".chayay",
      //   start: "top top",
      //   end: "bottom bottom",
      
      //   onEnter: () => {
      //     gsap.to(el, {
      //       backgroundColor: "#F3F4F5",
      //       duration: 1.2,
      //       ease: "power2.out",
      //     });
      //   },
      
      //   onEnterBack: () => {
      //     gsap.to(el, {
      //       backgroundColor: "#F3F4F5",
      //       duration: 1.2,
      //       ease: "power2.out",
      //     });
      //   },
      
      //   onLeave: () => {
      //     gsap.to(el, {
      //       backgroundColor: "#F3F4F5",
      //       duration: 1.2,
      //       ease: "power2.out",
      //     });
      //   },
      
      //   onLeaveBack: () => {
      //     gsap.to(el, {
      //       backgroundColor: "#F3F4F5",
      //       duration: 1.2,
      //       ease: "power2.out",
      //     });
      //   },
      // });
      
  
      return () => ScrollTrigger.getAll().forEach((st) => st.kill());
    }, [ready]);
  
    if (!ready) return null;
  
    return (
      <div
        className="chayay"
        ref={bgRef}
        style={{ width: "100%", background: "black", position: "relative" }}
      >
        <div style={{ position: "relative", zIndex: 2, width: "100%", background: "#000" }}>
          <HeroJoin/>
        </div>
  
        {/* <div className="h-screen w-screen bg-white"/> */}
           
          
          <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
            <BosonNarrative />
          </div>
          
          <div style={{ position: "relative", zIndex: 2 }}>
            <Projects />
          </div>
          
          
       
        
        
        
         <Description/>
         
        <VideoSection/>
        
   
          
           <ServicesHero/>
           
          <ProjectShowcase/>
        
        
          <div style={{ position: "relative", zIndex: 2 }}>
            <BigHeading />
          </div>
        
        
          <div style={{ position: "relative", zIndex: 2 }}>
            <WorksList />
          </div>
          
          
          {/* <BosonScrollText/>   */}
        
       
         <Galery/>
       
        
  
       
  
        
  
        {/* <MeetBoson /> */}
  
       
  
      
  
        {/* <div style={{ position: "relative", zIndex: 2 }}>
            <Carousel />
          </div> */}
        
        {/* <div className="" style={{ position: "relative", zIndex: 2 }}>
          <IndustriesPage />
        </div> */}
        
     
        
          
        
        
        

  
        <div style={{ position: "relative", zIndex: 2 }}>
          <Footer />
        </div>
  
        <style jsx global>{`
          body {
            background: #000;
            overflow-x: hidden;
          }
        `}</style>
      </div>
    );
  }
  
  