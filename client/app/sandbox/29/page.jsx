"use client";

import React, { Fragment, useLayoutEffect, useRef, useContext, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { LoaderContext } from "../../../components/atoms/LoaderGate";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Image from "next/image";
gsap.registerPlugin(ScrollTrigger);
import Galery from '../22/page.jsx'
import { motion, useSpring, useScroll, useTransform, useAnimationFrame, useAnimation, useReducedMotion, useMotionValue, animate} from "framer-motion";
import Carousel from '../1/page';
import GradientBg from '../../../components/organisms/GradientBg'



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

return (
  <div className="relative w-full h-screen overflow-hidden flex justify-center items-center text-gray/80">
    <Webglbg />
    
    {/* NAV */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.75, y: 0 }}
      transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
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
      transition={{ delay: 2.3, duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-[28%] text-white sm:bottom-[22%] left-1/2 sm:left-20 sm:text-left -translate-x-1/2 sm:translate-x-0 
      text-[11px] sm:text-sm leading-relaxed max-w-[240px] text-center sm:text-start z-20"
    >
      A system-driven studio
      <br />
      for modern identity & engineering
    </motion.div>

    {/* SIDE RIGHT */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay: 2.35, duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-[20%] text-white sm:bottom-[22%] right-1/2 sm:right-20 sm:text-right translate-x-1/2 sm:translate-x-0
      text-[11px] sm:text-sm leading-relaxed max-w-[240px] text-center sm:text-right z-20"
    >
      Focused on how to shape
      <br />
      the future, driving it forward
    </motion.div>
    
    {/* FOOTER */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.55, y: 0 }}
      transition={{ delay: 2.4, duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-6 text-white sm:bottom-10 w-full px-6 sm:px-20 flex justify-between 
      text-[10px] sm:text-xs tracking-wide z-20"
    >
      <span>06°10&apos;00&quot;S</span>
      <span>Bali, Indonesia</span>
      <span>106°49&apos;00&quot;E</span>
    </motion.div>
 

    {/* BOSON CHROME */}
    <motion.div
      initial={{ opacity: 0, scale: 1.9, filter: "blur(100px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: 2.8, duration: 2.3, ease: "easeOut" }}
      className="absolute inset-0 z-10 flex items-center justify-center"
    >
      <div className="boson-chrome-v4" />
    </motion.div>
 

    {/* CHROME CSS */}
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
          #DED9CF;
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
        box-shadow: 0 0 0 9999px black;
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
        background: "black",
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
          background: "black",
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
          background: black;
        }
      `}</style>
    </div>
  );
}


function BosonNarrative() {
  const wrap = useRef(null);
  const baseTextRef = useRef(null); // stagger applied here

  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const targetPos = useRef({ x: -9999, y: -9999 });
  const [isMobile, setIsMobile] = useState(false);

  // ====================================
  // MOBILE CHECK
  // ====================================
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);

    handleChange(mq);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // ====================================
  // SPOTLIGHT FOLLOW
  // ====================================
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
        return { x: prev.x + dx * speed, y: prev.y + dy * speed };
      });

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  const handleMove = (e) => {
    if (!wrap.current || isMobile) return;

    const rect = wrap.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // ====================================
  // STAGGER ON BASE TEXT (WITH SCROLLTRIGGER)
  // ====================================
  useEffect(() => {
    if (!baseTextRef.current || isMobile) return;
 
  }, [isMobile]);

  // ====================================
  // TEXT
  // ====================================
  const text = `              We are a social media agency that helps brands stay consistent online. We keep everything on track so you can stay focused on what matters`;

  return (
    <div
      ref={wrap}
      onMouseMove={handleMove}
      className="boson-narrative-container  w-full  relative overflow-hidden flex items-start"
      style={{ padding: "120px 2vw" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          whiteSpace: "pre-wrap",
          fontSize: "clamp(18px, 6vw, 72px)",
          lineHeight: 1.05,
          fontWeight: 400, 
        }}
      >
       
        {/* ====================================
            LAYER 1 — BASE DIM TEXT (ANIMATED)
        ==================================== */}
        <div
          ref={baseTextRef}
          style={{
            color: isMobile
              ? "rgba(0,0,0,0.96)"
              : "rgba(0,0,0,0.9)",
          }}
        >
           <span className="mr-32"></span>{text}
        </div>

        {/* ====================================
            LAYER 2 — HIGHLIGHT W/ SPOTLIGHT MASK
        ==================================== */}
        {!isMobile && (
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              color: "rgba(255,255,255,0.96)",

              WebkitMaskImage: `
                radial-gradient(
                  900px circle at ${pos.x}px ${pos.y}px,
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.12) 30%,
                  rgba(255,255,255,0.03) 55%,
                  rgba(255,255,255,0) 100%
                )
              `,
              maskImage: `
                radial-gradient(
                  900px circle at ${pos.x}px ${pos.y}px,
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.12) 30%,
                  rgba(255,255,255,0.03) 55%,
                  rgba(255,255,255,0) 100%
                )
              `,
            }}
          >
            <span className="mr-32"></span>{text}
          </div>
        )}
      </div>

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
  const textRef = useRef(null);

  const holeBaseW = 300;
  const holeBaseH = 450;
  const holeMaxScale = 7;

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const hole = holeRef.current;
    const video = videoRef.current;
    const text = textRef.current;

    if (!outer || !hole || !video || !text) return;

    // SIZE
    hole.style.width = `${holeBaseW}px`;
    hole.style.height = `${holeBaseH}px`;

    // TIMELINE SCALE
    gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "+=100%",
        scrub: true,
      },
    })
      .to(hole, {
        scale: holeMaxScale,
        transformOrigin: "50% 50%",
        ease: "none",
      })
      .fromTo(
        video,
        { scale: 1.8 },
        { scale: 1, ease: "none" },
        0
      );

    // TIMELINE TEXT — SCRUB REALTIME
    gsap.fromTo(
      text,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top+=30% top",   // muncul sedikit setelah lubang mulai membesar
          end: "top+=60% top",     // selesai fade-in sebelum sticky selesai
          scrub: true,             // KUNCI: untuk reverse pas scroll naik
        },
      }
    );
  }, []);

  return (
    <div
      ref={outerRef}
      style={{
        height: "250vh",
        position: "relative",
      }}
    >
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
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
          ref={holeRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1)",
            borderTopLeftRadius: "100rem",
            borderTopRightRadius: "100rem",
            background: "transparent",
            boxShadow: `0 0 0 9999px black`,
            pointerEvents: "none",
          }}
        />

        {/* TEXT ABOVE VIDEO */}
        <div
          ref={textRef}
          style={{
            position: "absolute",
            bottom: "0%",
            left: 0,
            width: "100%",
            color: "white",
            padding: "10px 60px 30px 60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pointerEvents: "none",
            borderTop: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 600,
              width: "40%",
              lineHeight: "1.05",
            }}
          >
            {/* Transformation. */}
          </h1>

          <p
            style={{
              width: "40%",
              fontSize: "26px",
              lineHeight: "1.2",
              opacity: 0.9,
            }}
          >
            <span className="mr-20"></span>We are a multicultural collective of creatives, strategists, and designers,
            blending global perspectives with local insight to craft brands,
            stories, and digital experiences that move people and create lasting clarity.
          </p>
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

  // PROGRESS UTAMA — untuk burst (TETAP seperti semula)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  
  const { scrollYProgress: dotProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end end"],
  });
  
  const slowDotProgress = useTransform(dotProgress, v => v * 0.15);

  
  
  // ROTATION VALUES (for orbits) — pakai introProgress
  const rotate1 = useTransform(slowDotProgress, [0, 1], [0, 7200]);
  const rotate2 = useTransform(slowDotProgress, [0, 1], [0, -5400]);
  const rotate3 = useTransform(slowDotProgress, [0, 1], [0, 9000]);
    
  
  // PROGRESS INTRO — dari pertama kelihatan sampai titik sticky
  const { scrollYProgress: introProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start start"],
  });
  // ============================
  // TEXT REVEAL with Framer Motion
  // ============================
  // mulai reveal begitu komponen kelihatan, selesai pas sticky
  const textOpacity = useTransform(introProgress, [0, 1], [0, 1]);
  const textY = useTransform(introProgress, [0, 1], [-50, 0]);
  const textFilter = useTransform(introProgress, [0, 1], [
    "blur(20px)",
    "blur(0px)",
  ]);

  // ORBIT CONFIGS
  const c1 = { cx: 425, cy: 350, r: 250 };
  const c2 = { cx: 325, cy: 500, r: 250 };
  const c3 = { cx: 525, cy: 500, r: 250 };

  const g1Ref = useRef(null);
  const g2Ref = useRef(null);
  const g3Ref = useRef(null);

  useEffect(() => {
    const setTransform = (g, cx, cy, deg) => {
      if (!g) return;
      g.setAttribute("transform", `translate(${cx} ${cy}) rotate(${deg})`);
    };

    setTransform(g1Ref.current, c1.cx, c1.cy, rotate1.get());
    setTransform(g2Ref.current, c2.cx, c2.cy, rotate2.get());
    setTransform(g3Ref.current, c3.cx, c3.cy, rotate3.get());

    const unsub1 = rotate1.onChange((v) =>
      setTransform(g1Ref.current, c1.cx, c1.cy, v)
    );
    const unsub2 = rotate2.onChange((v) =>
      setTransform(g2Ref.current, c2.cx, c2.cy, v)
    );
    const unsub3 = rotate3.onChange((v) =>
      setTransform(g3Ref.current, c3.cx, c3.cy, v)
    );

    return () => {
      unsub1?.();
      unsub2?.();
      unsub3?.();
    };
  }, [rotate1, rotate2, rotate3]);

  // ============================
  // IMAGES LIST
  // ============================
  // original 4 + 5 extra (looping through the same assets as example)
  const images = [
    "/clients/marrosh/mockup.png", // 0
    "/clients/dwm/mockup.png", // 1
    "/clients/tender-touch/mockup.png", // 2
    "/clients/hidden-city-ubud/mockup.png", // 3
    "/clients/marrosh/mockup.png", // 4 (extra)
    "/clients/dwm/mockup.png", // 5
    "/clients/tender-touch/mockup.png", // 6
    "/clients/hidden-city-ubud/mockup.png", // 7
    "/clients/marrosh/mockup.png", // 8 (extra)
    "/clients/tender-touch/mockup.png", // 6
    "/clients/hidden-city-ubud/mockup.png", // 7
    "/clients/marrosh/mockup.png", // 8 (extra) 
    "/clients/dwm/mockup.png", // 5
    "/clients/tender-touch/mockup.png", // 6
    "/clients/hidden-city-ubud/mockup.png", // 7
    "/clients/marrosh/mockup.png", // 8 (extra)
    
  ];

  // ============================
  // STAGGERED BURST TIMING (micro-stagger)
  // base start, step, window length
  // ============================
  const baseStart = 0.15;
  const step = 0.03; // small delay between starts
  const windowLen = 0.12; // each burst end = start + windowLen

  // For each image, compute burst transform from scrollYProgress
  const bursts = images.map((_, i) => {
    const s = baseStart + i * step;
    const e = s + windowLen;
    return useTransform(scrollYProgress, [s, e], [0, 1]);
  });

  // ============================
  // RANDOM SEEDS per image (stabil antar render)
  // ============================
  const randomSeedsRef = useRef(null);
  if (!randomSeedsRef.current) {
    randomSeedsRef.current = images.map(() => ({
      xOffset: (Math.random() - 0.5) * 80, // -40..40
      yOffset: (Math.random() - 0.5) * 80, // -40..40
      zOffset: (Math.random() - 0.5) * 800, // -400..400
      rotStart: (Math.random() - 0.5) * 4, // -2..2 deg
      rotEnd: (Math.random() - 0.5) * 10, // -5..5 deg
      blurBoost: Math.random(), // 0..1
    }));
  }
  const randomSeeds = randomSeedsRef.current;

  // ============================
  // FORWARD MOTION VECTOR — Combo DEWA
  // A: cepat dekat kamera
  // B: smooth keluar frame
  // D: motion blur
  // E: randomization halus
  // ============================
  function createMotionVector(b, pattern, seed) {
    // Z: piecewise — cepat ke kamera, halus keluar
    const z = useTransform(b, [0, 0.4, 1], [-3000, 0, 5000 + seed.zOffset]);

    // base arah 4-kuadran
    const baseX =
      pattern === 0
        ? 220 // right-top
        : pattern === 1
        ? -220 // left-top
        : pattern === 2
        ? 220 // right-bottom
        : -220; // left-bottom;

    const baseY = pattern <= 1 ? -200 : 200;

    // XY + random offset halus
    const x = useTransform(b, [0, 1], [0, baseX + seed.xOffset]);
    const y = useTransform(b, [0, 1], [0, baseY + seed.yOffset]);

    // scale natural berbasis depth (nggak meledak)
    const scale = useTransform(b, [0, 1], [0.3, 1.2]);

    return { x, y, z, scale };
  }

  // ============================
  // motion props per image
  // ============================
  const motionPropsList = bursts.map((b, idx) => {
    const pattern = idx % 4;
    const seed = randomSeeds[idx % randomSeeds.length];

    const { x, y, z, scale } = createMotionVector(b, pattern, seed);

    return {
      burst: b,
      x,
      y,
      z,
      scale,
      opacity: useTransform(b, [0, 0.05, 1], [0, 1, 1]),
    };
  });

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div
      ref={scrollRef}
      style={{
        width: "100%",
        height: "500vh",
        background: "black",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "97vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden", // per request: keep hidden
          pointerEvents: "none",

          perspective: "1800px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* ORBIT SVG */}
        <svg
          viewBox="0 0 850 850"
          width="850"
          height="850"
          style={{ position: "absolute" }}
        >
          <circle
            cx={c1.cx}
            cy={c1.cy}
            r={c1.r}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.15"
            fill="none"
          />
          <circle
            cx={c2.cx}
            cy={c2.cy}
            r={c2.r}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.15"
            fill="none"
          />
          <circle
            cx={c3.cx}
            cy={c3.cy}
            r={c3.r}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.15"
            fill="none"
          />

          <g ref={g1Ref} transform={`translate(${c1.cx} ${c1.cy}) rotate(0)`}>
            <circle cx={c1.r} cy={0} r={3} fill="white" />
          </g>

          <g ref={g2Ref} transform={`translate(${c2.cx} ${c2.cy}) rotate(0)`}>
            <circle cx={c2.r} cy={0} r={3} fill="white" />
          </g>

          <g ref={g3Ref} transform={`translate(${c3.cx} ${c3.cy}) rotate(0)`}>
            <circle cx={c3.r} cy={0} r={3} fill="white" />
          </g>
        </svg>

        {/* TEXT */}
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            filter: textFilter,
            position: "absolute",
            color: "white",
            fontSize: "43px",
            textAlign: "center",
            fontWeight: 200,
            lineHeight: 1,
            zIndex: 10,
            whiteSpace: "pre-line", 
          }}
        >
          ELEVATE YOUR BRAND
        </motion.div>

        {/* Render all image bursts (looped pattern) */}
        {images.map((src, i) => (
          <ImageBurst key={i} src={src} motionProps={motionPropsList[i]} />
        ))}
      </div>
    </div>
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
      style={{ height: "150vh" }}
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
      year: "© 2025",
      image1: "/clients/tender-touch/2.jpg",
      image2: "/clients/tender-touch/main.jpg",
    },
    {
      industry: "Real Estate",
      name: "Hidden City Ubud",
      year: "© 2025",
      image1: "/clients/hidden-city-ubud/main.jpg",
      image2: "/clients/hidden-city-ubud/2.jpg",
    },
    {
      industry: "Real Estate",
      name: "DWM",
      year: "© 2025",
      image1: "/clients/dwm/5.jpg",
      image2: "/clients/dwm/logo.png",
    },
    {
      industry: "Food & Beverage",
      name: "Marrosh",
      year: "© 2025",
      image1: "/clients/marrosh/9.jpg",
      image2: "/clients/marrosh/logo.png",
    },
    {
      industry: "Real Estate",
      name: "NOVO",
      year: "© 2025",
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
  return (
    <section className="relative w-full min-h-screen bg-[#F3F4F5] text-black overflow-hidden">
      <div className="max-w-screen mx-auto h-full px-8 lg:px-16 py-12 flex flex-col">
        {/* TOP BAR */}
        <div className="w-full flex items-start justify-between pt-6">
          {/* left tiny label */}
          <div className="text-sm text-gray-600 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-black/80 inline-block" />
            <span className="opacity-80">Our Expertise</span>
          </div>

          {/* center headline */}
          <h2 className="hidden md:block text-center text-black font-medium leading-tight max-w-[700px] text-[clamp(20px,3vw,40px)]">
            How we take your <br /> business to the next level
          </h2>

          {/* right panel */}
          <div className="hidden lg:flex flex-col items-end text-right max-w-xs">
            <p className="text-gray-600 text-sm mb-4">
              We are a digital marketing agency with expertise, and we're on a mission to
              help you take the next step in your business.
            </p>
          </div>
        </div>

        {/* MAIN ROW */}
        <div className="relative flex-1 mt-32 grid grid-cols-12 gap-6 items-start">
          {/* left gutter */}
          <div className="col-span-4" />

          {/* center big list */}
          <div className="col-span-8 flex flex-col gap-10 justify-start">
            {["Social Media Marketing", "Content Production", "Branding", "Website Development"].map((label) => (
              <div key={label} className="relative">
                <h3
                  className="font-sans font-semibold text-black leading-[0.9] tracking-tight"
                  style={{
                    fontSize: "clamp(48px, 12vw, 120px)",
                    lineHeight: 0.95,
                  }}
                >
                  {label}
                </h3>

                <div className="mt-6 border-t border-black/10 w-full" />
              </div>
            ))}
          </div>

          {/* right gutter */}
          <div className="col-span-1" />
        </div>
      </div>
    </section>
  );
}

function Description() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ===============================
         LEFT — HEADLINE (EPIC)
      =============================== */
      const title = titleRef.current;
      const text = title.innerText;
      title.innerHTML = "";

      const lines = text.split(", ");
      lines.forEach((line, i) => {
        const wrapper = document.createElement("div");
        wrapper.className = "overflow-hidden";

        const span = document.createElement("span");
        span.className = "inline-block will-change-transform";
        span.innerText = line + (i < lines.length - 1 ? "," : "");

        wrapper.appendChild(span);
        title.appendChild(wrapper);
      });

      const spans = title.querySelectorAll("span");

      gsap.fromTo(
        spans,
        {
          y: 120,
          rotateX: 55,
          scaleY: 1.4,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          y: 0,
          rotateX: 0,
          scaleY: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      /* ===============================
         RIGHT — FADE IN ONLY
      =============================== */
      const paragraphs = rightRef.current.querySelectorAll("p");

      gsap.fromTo(
        paragraphs,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power1.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F3F4F5] text-black py-32"
    >
      <div className="max-w-screen mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* LEFT — HEADLINE */}
        <div className="lg:col-span-7 flex flex-col">
          <h1
            ref={titleRef}
            className="font-sans font-medium leading-[1.05] tracking-tight text-black perspective-[1200px]"
            style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
          >
            We build brands that move with clarity, communicate with intention,
            and scale smoothly in a world that never stops shifting.
          </h1>
        </div>

        {/* RIGHT — COPY */}
        <div
          ref={rightRef}
          className="lg:col-span-5 flex flex-col text-gray-700 text-[17px] leading-relaxed"
        >
          <p className="mb-5">
            Boson is a digital agency founded in 2021 and based in Bali, working with
            clients across Qatar, Malaysia, and other regions. We focus on creating
            structured, reliable systems for brands that want to scale with confidence.
          </p>

          <p className="mb-5">
            Our work combines design, development, and brand operations, giving teams
            a toolkit that keeps everything consistent — from visuals to messaging to
            digital experience. No clutter, no unnecessary layers.
          </p>

          <p className="mb-8">
            Whether you're refining a brand or building a new digital foundation,
            Boson brings clarity, process, and long-term stability to the table.
          </p>
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
      image: "https://plus.unsplash.com/premium_photo-1678903964473-1271ecfb0288?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D",
      meta: ["PRODUCTION", "LONDON", "EDELMAN", "XBOX"],
      desc:
        "A 6×3 metre renaissance-style oil painting to support the launch of Xbox’s flagship video game, Halo Infinite.",
    },
    {
      id: "02",
      title: "Food &\nBeverage",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      meta: ["BRANDING", "BERLIN", "NIKE"],
      desc:
        "A visual identity system exploring silence, tension, and modern athletic discipline.",
    },
    {
      id: "03",
      title: "Lifestyle &\nHospitality",
      image: "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGhvc3BpdGFsaXR5fGVufDB8fDB8fHww",
      meta: ["EXPERIMENT", "TOKYO", "SONY"],
      desc:
        "An experimental campaign blending digital ritual, motion, and sound design.",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const progressBar = progressRef.current;

      const totalSlides = projects.length;
      const totalWidth = track.scrollWidth;
      const viewport = window.innerWidth;
      const scrollDistance = totalWidth - viewport;

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate(self) {
            // ============================
            // PROGRESS BAR (REAL)
            // ============================
            const progress = self.progress; // 0 → 1
            gsap.set(progressBar, {
              scaleX: progress,
              transformOrigin: "left center",
            });

            // ============================
            // ACTIVE SLIDE INDEX
            // ============================
            const index = Math.min(
              totalSlides - 1,
              Math.floor(progress * totalSlides)
            );
            setActiveIndex(index);
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black text-white overflow-hidden"
    >
      {/* TRACK */}
      <div className="absolute inset-0">
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              className="relative w-screen h-full flex-shrink-0"
            >
              <div className="relative max-w-[1600px] mx-auto h-full px-16 pt-24 pb-32 grid grid-cols-12">
                {/* PROJECT LABEL */}
                <span className="col-span-12 text-xs tracking-widest text-white/50 mb-8">
                  PROJECT {p.id}
                </span>

                {/* IMAGE */}
                <div className="col-span-4 col-start-5 flex justify-center z-10">
                  <div className="relative w-[420px] aspect-[3/4]">
                    <img
                      src={p.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* TITLE — OVERLAP */}
                <h1
                  className="absolute left-16 top-[45%] text-[96px] leading-[0.95] font-light tracking-tight whitespace-pre-line z-20 pointer-events-none"
                  style={{ maxWidth: "620px" }}
                >
                  {p.title}
                </h1>

                {/* RIGHT META */}
                <div className="col-span-3 col-start-10 flex flex-col justify-end pt-24">
                  <div className="mb-8 space-y-2 text-xs tracking-wide">
                    {p.meta.map((m) => (
                      <p key={m} className="underline underline-offset-4">
                        {m}
                      </p>
                    ))}
                  </div>

                  <p className="max-w-[260px] text-sm leading-relaxed text-white/65">
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================= */}
      {/* BOTTOM PROGRESS BAR */}
      {/* ============================= */}
      <div className="absolute bottom-0 left-0 right-0 z-40 px-28 pb-6">
        {/* BAR */}
        <div className="relative h-[1px] bg-white/20 overflow-hidden">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full w-full bg-white"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* META */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>
            [ {activeIndex + 1} — {projects.length} ]
          </span> 
        </div>
      </div>
    </section>
  );
}



function Footer() {
  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
 

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

            <p className="text-sm opacity-70 max-w-[420px] leading-relaxed">
              Share your ideas with us and we’ll begin turning your vision into
              something clear, sharp, and executable.
            </p>

            <a
              href="mailto:boson.studio@gmail.com"
              className="mt-6 inline-flex items-center gap-3 text-sm tracking-wide opacity-90 hover:opacity-100 transition"
            >
              Get in touch →
            </a>
          </div>

          {/* CENTER — NAV */}
          <div className="flex flex-col divide-y divide-white/10 border border-white/10">
            {[
              "Home",
              "Projects",
              "What We Do",
              "Latest News",
              "Get In Touch",
            ].map((item) => (
              <a
                key={item}
                className="px-8 py-6 flex items-center justify-between text-sm tracking-wide hover:bg-white/5 transition"
              >
                <span>{item}</span>
                <span className="opacity-60">↗</span>
              </a>
            ))}
          </div>

          {/* RIGHT — CONTACT */}
          <div className="flex flex-col gap-6 text-sm opacity-80">
            <div>
              <div className="opacity-60 mb-1">Email</div>
              <div>boson.studio@gmail.com</div>
            </div>

            <div>
              <div className="opacity-60 mb-1">Base</div>
              <div>Bali, Indonesia</div>
            </div>

            <div>
              <div className="opacity-60 mb-1">Working</div>
              <div>Worldwide</div>
            </div>

            <div className="flex gap-4 mt-4 text-xs opacity-70">
              <a className="hover:opacity-100 transition">Behance</a>
              <a className="hover:opacity-100 transition">LinkedIn</a>
              <a className="hover:opacity-100 transition">Contact</a>
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
      ScrollTrigger.create({
        trigger: ".chayay",
        start: "top top",
        end: "bottom bottom",
      
        onEnter: () => {
          gsap.to(el, {
            backgroundColor: "#F3F4F5",
            duration: 1.2,
            ease: "power2.out",
          });
        },
      
        onEnterBack: () => {
          gsap.to(el, {
            backgroundColor: "#F3F4F5",
            duration: 1.2,
            ease: "power2.out",
          });
        },
      
        onLeave: () => {
          gsap.to(el, {
            backgroundColor: "#F3F4F5",
            duration: 1.2,
            ease: "power2.out",
          });
        },
      
        onLeaveBack: () => {
          gsap.to(el, {
            backgroundColor: "#F3F4F5",
            duration: 1.2,
            ease: "power2.out",
          });
        },
      });
      
  
      return () => ScrollTrigger.getAll().forEach((st) => st.kill());
    }, [ready]);
  
    if (!ready) return null;
  
    return (
      <div
        className="chayay"
        ref={bgRef}
        style={{ width: "100%", background: "#F3F4F5", position: "relative" }}
      >
        <div style={{ position: "relative", zIndex: 2, width: "100%", background: "#000" }}>
            <HeroJoin/>
          </div>
  
  {/* <div className="h-screen w-screen bg-white"/> */}
  
          <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
            <BosonNarrative />
          </div>
          
          
        <Galery/>
        
        
        
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
          
          
          <BosonScrollText/>  
        
       
        
       
        
  
       
  
        {/* <div style={{ position: "relative", zIndex: 2 }}>
            <Projects />
          </div> */}
  
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
  
  