"use client";

import React, { Fragment, useLayoutEffect, useRef, useContext, useState, useEffect, useMemo, useId } from "react";
import gsap from "gsap";
import { LoaderContext } from "../../../components/atoms/LoaderGate";
import ScrollTrigger from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";
import SplitType from "split-type";
import Image from "next/image";
import Link from "next/link";
import { motion, useSpring, useScroll, useTransform, useAnimationFrame, useAnimation, useReducedMotion, useMotionValue, animate} from "framer-motion";
import Carousel from '../1/page';
import GradientBg from '../../../components/organisms/GradientBg'
import * as THREE from "three";
import {
  BriefcaseIcon,
  GlobeAltIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger,SplitText,CustomEase);


function Webglbg() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const webgl = new GradientBg({ rendererEl: containerRef.current, background: {
      color1: [0.796, 0.294, 0.243],
      color2: [0.914, 0.412, 0.349],
      color3: [0, 0, 0],
      colorAccent: new THREE.Color(0, 0, 0),
      uLinesBlur: 0.33,
      uNoise: 0.03,
      uOffsetX: 0.05,
      uOffsetY: -2.46,
      uLinesAmount: 1.36,      
    } });
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
  
    // BASE COORDINATES
    const BASE_LAT = { deg: 6, min: 10, sec: 0, dir: "S" };
    const BASE_LON = { deg: 106, min: 49, sec: 0, dir: "E" };
  
    const [latText, setLatText] = useState(`06°10'00"S`);
    const [lonText, setLonText] = useState(`106°49'00"E`);
  
    useEffect(() => {
      function updateCoordinatesFromPointer(e) {
        const w = window.innerWidth;
        const h = window.innerHeight;
  
        const nx = e.clientX / w; // 0–1
        const ny = e.clientY / h; // 0–1
  
        // offset seconds (beda sumbu)
        let lonSec = (nx - 0.5) * 60;
        let latSec = (ny - 0.5) * 60;
  
        // clamp
        lonSec = Math.min(Math.max(lonSec, -59), 59);
        latSec = Math.min(Math.max(latSec, -59), 59);
  
        const lonS = Math.abs(Math.round(lonSec)).toString().padStart(2, "0");
        const latS = Math.abs(Math.round(latSec)).toString().padStart(2, "0");
  
        setLonText(`${BASE_LON.deg}°${BASE_LON.min}'${lonS}"${BASE_LON.dir}`);
        setLatText(`${BASE_LAT.deg}°${BASE_LAT.min}'${latS}"${BASE_LAT.dir}`);
      }
  
      window.addEventListener("mousemove", updateCoordinatesFromPointer);
      return () =>
        window.removeEventListener("mousemove", updateCoordinatesFromPointer);
    }, []);
  
    return (
      <div className="relative w-full h-screen overflow-hidden flex justify-center items-center text-gray/80">
        <Webglbg />
  
        {/* NAV */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ delay: TEXT_DELAY, duration: 0.6, ease: "easeOut" }}
          className="absolute top-6 sm:top-10 w-full px-6 sm:px-20 flex justify-between text-xs sm:text-sm z-20 tracking-wide text-white"
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
          className="absolute bottom-[28%] sm:bottom-[22%] left-1/2 sm:left-20 
          -translate-x-1/2 sm:translate-x-0 text-[11px] sm:text-sm leading-relaxed 
          max-w-[240px] text-center sm:text-left z-20 text-white"
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
          className="absolute bottom-[20%] sm:bottom-[22%] right-1/2 sm:right-20 
          translate-x-1/2 sm:translate-x-0 text-[11px] sm:text-sm leading-relaxed 
          max-w-[240px] text-center sm:text-right z-20 text-white"
        >
          Focused on how to shape
          <br />
          the future, driving it forward
        </motion.div>
  
        {/* FOOTER — COORDINATES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ delay: TEXT_DELAY, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-6 sm:bottom-10 w-full px-6 sm:px-20 
          flex justify-between text-[10px] sm:text-xs tracking-wide z-20 text-white"
        >
          <span>{latText}</span>
          <span>Bali, Indonesia</span>
          <span>{lonText}</span>
        </motion.div>
  
        {/* BOSON */}
        <motion.div
          initial={{ opacity: 0, scale: 1.9, filter: "blur(100px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: BOSON_DELAY, duration: 2.3, ease: "easeOut" }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="boson-chrome-v4" />
        </motion.div>
  
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
            background: #000;
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
      "/clients/dwm/4.jpg",
      "/clients/tender-touch/5.jpg",
      "/clients/dwm/3.jpg",
      "/clients/tender-touch/4.jpg",
      "/clients/dwm/5.jpg",
      "/clients/tender-touch/3.jpg",
      "/clients/tender-touch/7.jpg",
      "/clients/dwm/6.jpg",
      "/clients/dwm/2.jpg",
    ];
  
    const [phase, setPhase] = useState("slides");
    const [visible, setVisible] = useState(
      Array(IMAGES.length).fill("start")
    );
    const [topIndex, setTopIndex] = useState(0);
  
    // =========================
    // RESPONSIVE SCALE CONTROL
    // =========================
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const check = () => {
        setIsMobile(window.innerWidth < 768);
      };
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
  
    const scaleExpand = isMobile
      ? { scaleX: 6, scaleY: 6 } // 📱 portrait
      : { scaleX: 16, scaleY: 4 }; // 🖥 landscape
  
    const getDuration = (i) => (i === 0 ? 650 : 250);
    const overlapOffset = 150;
  
    useEffect(() => {
      let timeCursor = 0;
  
      IMAGES.forEach((_, i) => {
        const duration = getDuration(i);
        const openTime = timeCursor;
        const softTime = i === 0 ? openTime + duration * 0.35 : openTime;
        const closeTime = softTime + duration;
  
        if (i === 0) {
          setTimeout(() => {
            setVisible((prev) => {
              const arr = [...prev];
              arr[i] = "soft";
              return arr;
            });
            setTopIndex(i);
          }, openTime);
        }
  
        setTimeout(() => {
          setVisible((prev) => {
            const arr = [...prev];
            arr[i] = "open";
            return arr;
          });
          setTopIndex(i);
        }, softTime);
  
        setTimeout(() => {
          setVisible((prev) => {
            const arr = [...prev];
            arr[i] = "close";
            return arr;
          });
        }, closeTime);
  
        setTimeout(() => {
          if (i < IMAGES.length - 1) {
            setTopIndex(i + 1);
          }
        }, (i === 0 ? softTime : openTime) + overlapOffset);
  
        timeCursor += duration;
      });
  
      const total = timeCursor;
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
            ? scaleExpand
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
                className={`absolute w-full h-full object-cover transition-all ${
                  i === 0 ? "duration-[650ms]" : "duration-[250ms]"
                } ${
                  visible[i] === "soft"
                    ? "reveal-soft"
                    : visible[i] === "open"
                    ? "reveal"
                    : visible[i] === "close"
                    ? "reveal-end"
                    : "reveal-start"
                }`}
                style={{
                  zIndex: i === topIndex ? 1000 : i,
                  transitionTimingFunction:
                    i === 0
                      ? "cubic-bezier(0.3, 0, 0.2, 1)"
                      : "ease-in-out",
                }}
              />
            ))}
          </div>
  
          {/* HOLE */}
          <div className="absolute inset-0 spotlight pointer-events-none" />
        </div>
  
        <style jsx>{`
          .spotlight {
            box-shadow: 0 0 0 9999px white;
          }
          .reveal-start {
            clip-path: inset(100% 0% 0% 0%);
          }
          .reveal-soft {
            clip-path: inset(92% 0% 0% 0%);
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
  
          {/* BOSON — DEAD CENTER → REVEAL SCALE */}
          <motion.div
            style={{ y: titleY }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="
              absolute
              left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              z-[65]
              flex items-center justify-center
              select-none pointer-events-none
            "
          >
            <motion.img
              src="/png/boson-white.png"
              alt="Boson Collective"
              draggable="false"
              initial={{ width: 200 }}
              animate={{ width: 250 }}
              transition={{
                delay: 3.2,
                duration: 3.8,
                ease: [0.12, 0, 0.24, 1],
              }}
              className="object-contain"
            />
          </motion.div>
  
          {/* INTRO OVERLAY */}
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
       SMOOTH MOUSE FOLLOW (DESKTOP ONLY)
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
       MOUSE MOVE (DESKTOP ONLY)
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
       BASE TEXT STYLE (DESKTOP)
    ========================= */
    const baseTextStyle = {
      width: "100%",
      whiteSpace: "pre-wrap",
      fontSize: "clamp(28px, 6vw, 74px)",
      lineHeight: 1.1,
      wordSpacing: -5,
      fontWeight: 400,
      textAlign: "justify",
      textAlignLast: "left",
      textIndent: "12rem",
      hyphens: "auto",
    };
  
    /* =========================
       MOBILE OVERRIDE
    ========================= */
    const mobileTextOverride = isMobile
      ? {
          fontSize: "clamp(20px, 5.5vw, 28px)",
          lineHeight: 1.45,
          wordSpacing: 0,
          textAlign: "left",
          textIndent: 0,
          hyphens: "none",
        }
      : {};
  
    return (
      <div
        ref={wrap}
        onMouseMove={handleMove}
        className="boson-narrative-container bg-black w-full relative overflow-hidden flex"
        style={{
          /* =========================
             HEIGHT BEHAVIOR
          ========================= */
          minHeight: isMobile ? "auto" : "100vh",
          alignItems: isMobile ? "flex-start" : "center",
  
          /* =========================
             PADDING
          ========================= */
          padding: isMobile ? "72px 6vw" : "120px 6vw",
        }}
      >
        {/* =========================
            BASE TEXT (DIM)
        ========================= */}
        <div
          style={{
            position: "relative",
            color: isMobile
              ? "rgba(255,255,255,0.96)"
              : "rgba(255,255,255,0.285)",
            ...baseTextStyle,
            ...mobileTextOverride,
          }}
        >
          {text}
  
          {/* =========================
              MASKED TEXT (DESKTOP ONLY)
          ========================= */}
          {!isMobile && (
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                color: "rgba(255,255,255,0.96)",
                ...baseTextStyle,
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
  const sectionRef = useRef(null);
  const holeRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const processRef = useRef(null);

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
    const section = sectionRef.current;
    const hole = holeRef.current;
    const video = videoRef.current;
    const text = textRef.current;
    const process = processRef.current;

    if (!outer || !section || !hole || !video || !text || !process) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    hole.style.width = `${isMobile ? 180 : holeBaseW}px`;
    hole.style.height = `${isMobile ? 260 : holeBaseH}px`;

    gsap.set(section, { backgroundColor: "#000" });
    gsap.set(video, { scale: isMobile ? 1.25 : 1.6 });
    gsap.set(text, { opacity: 0 });

    gsap.set(hole, {
      scale: 1,
      boxShadow: "0 0 0 9999px #000",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: isMobile ? "+=110%" : "+=140%",
        scrub: 0.8,
      },
    });

    tl.to(
      hole,
      {
        scale: isMobile ? holeMaxScale * 0.75 : holeMaxScale,
        ease: "none",
      },
      0
    ).to(
      video,
      {
        scale: 1,
        ease: "none",
      },
      0
    );

    tl.to(text, { opacity: 1, ease: "power1.out" }, 0.9).fromTo(
      process.children,
      { opacity: 0, y: isMobile ? 24 : 36 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: "power2.out",
      },
      0.92
    );

    const loop = () => {
      tRef.current += 0.01;

      if (sigilDiscoverRef.current) {
        sigilDiscoverRef.current.style.transform = `rotate(${Math.sin(tRef.current) * 1}deg)`;
      }

      if (sigilCreateRef.current) {
        const s = 1 + Math.sin(tRef.current * 0.8) * 0.01;
        sigilCreateRef.current.style.transform = `scale(${s})`;
      }

      if (sigilDeliverRef.current) {
        sigilDeliverRef.current.style.transform = `translateY(${Math.sin(tRef.current * 1.1) * 1}px)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false;

  return (
    <div ref={outerRef} data-theme="dark" style={{ height: "300vh", position: "relative" }}>
      <section
        ref={sectionRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768191599/Private_Jet_ouqtwx.mp4"
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
            zIndex: 1,
          }}
        />

        <div
          ref={holeRef}
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderTopLeftRadius: "100rem",
            borderTopRightRadius: "100rem",
            zIndex: 10,
          }}
        />

        {/* TEXT WRAPPER — HANYA POSITION YANG DIUBAH */}
        <div
          ref={textRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: isMobile ? "auto" : "10vh",
            top: isMobile ? "50%" : "auto",
            transform: isMobile ? "translateY(-50%)" : "none",
            paddingLeft: "14vw",
            paddingRight: "6vw",
            color: "white",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <div style={{ maxWidth: "1080px" }}>
            <div
              ref={processRef}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(3, minmax(260px, 1fr))",
                gap: isMobile ? "40px" : "56px",
              }}
            >
              {/* === ISI KONTEN ASLI — TIDAK DIUBAH === */}

              <div>
                <svg ref={sigilDiscoverRef} width="36" height="36" viewBox="0 0 100 100" style={{ marginBottom: "14px" }}>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="50" cy="50" r="6" fill="none" stroke="white" strokeWidth="1" />
                  <line x1="50" y1="14" x2="50" y2="34" stroke="white" strokeWidth="1" />
                  <line x1="86" y1="50" x2="66" y2="50" stroke="white" strokeWidth="1" />
                  <line x1="50" y1="86" x2="50" y2="66" stroke="white" strokeWidth="1" />
                  <line x1="14" y1="50" x2="34" y2="50" stroke="white" strokeWidth="1" />
                </svg>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "20px" }} />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Discover</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.8 }}>
                  Most projects fail because no one really looks at what’s happening day to day. We start by understanding how your content is actually used and where things begin to slip.
                </p>
              </div>

              <div>
                <svg ref={sigilCreateRef} width="36" height="36" viewBox="0 0 100 100" style={{ marginBottom: "14px" }}>
                  <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="35" cy="35" r="3" fill="white" />
                  <circle cx="65" cy="35" r="3" fill="white" />
                  <circle cx="50" cy="65" r="3" fill="white" />
                  <line x1="35" y1="35" x2="65" y2="35" stroke="white" strokeWidth="0.8" />
                  <line x1="65" y1="35" x2="50" y2="65" stroke="white" strokeWidth="0.8" />
                  <line x1="50" y1="65" x2="35" y2="35" stroke="white" strokeWidth="0.8" />
                </svg>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "20px" }} />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Create</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.85 }}>
                  Once things are clear, we focus on structure. We turn ideas into content that’s easier to manage, repeat, and grow without starting from zero every time.
                </p>
              </div>

              <div>
                <svg ref={sigilDeliverRef} width="36" height="36" viewBox="0 0 100 100" style={{ marginBottom: "14px" }}>
                  <rect x="26" y="30" width="48" height="36" rx="4" fill="none" stroke="white" strokeWidth="1" />
                  <line x1="20" y1="70" x2="80" y2="70" stroke="white" strokeWidth="1.2" />
                </svg>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "20px" }} />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Deliver</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.8 }}>
                  Publishing is only part of the work. We test, adjust, and keep things moving so your content stays consistent as platforms and needs change.
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
  const isMobile = window.innerWidth <= 768;

  /* =========================
     SECTION SCROLL
  ========================= */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  /* =========================
     GLOBAL ROTATION
  ========================= */
  const { scrollY } = useScroll();
  const spinBase = useTransform(scrollY, (v) => v * 0.5);

  const rotate1 = useTransform(spinBase, (v) => v);
  const rotate2 = useTransform(spinBase, (v) => -v * 0.65);
  const rotate3 = useTransform(spinBase, (v) => v * 0.9);

  /* =========================
     IMAGES
  ========================= */
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

  /* =========================
     IMAGE BURST
  ========================= */
  const baseStart = 0.1;
  const step = 0.045;
  const windowLen = 0.27;

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

  /* =========================
     LIGHT MODE (MOBILE NEVER)
  ========================= */
  const lightProgress = useTransform(
    scrollYProgress,
    isMobile ? [2, 3] : [1 - windowLen, 1],
    [0, 1]
  );

  const bgColor = useTransform(lightProgress, [0, 1], [
    "rgb(0,0,0)",
    "#f3f4f5",
  ]);

  const textColor = useTransform(lightProgress, [0, 1], [
    "rgb(255,255,255)",
    "rgb(0,0,0)",
  ]);

  const orbitStroke = useTransform(lightProgress, [0, 1], [
    "rgba(255,255,255,0.15)",
    "rgba(0,0,0,0.15)",
  ]);

  const dotFill = useTransform(lightProgress, [0, 1], [
    "rgb(255,255,255)",
    "rgb(0,0,0)",
  ]);

  /* =========================
     ORBITS DATA
  ========================= */
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

  /* =========================
     INTRO TEXT
  ========================= */
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

  /* =========================
     RENDER (UTUH)
  ========================= */
  return (
    <motion.div
    data-theme="dark"
      ref={scrollRef}
      style={{
        width: "100%",
        height: "500vh",
        position: "relative",
        backgroundColor: bgColor,
      }}
    >
      <div className="projects-sticky">
        <svg viewBox="0 0 850 850" className="projects-orbit">
          {[c1, c2, c3].map((c, i) => (
            <motion.circle
              key={i}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill="none"
              strokeWidth="1.0"
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

        <motion.div
          className="projects-text"
          style={{
            opacity: textOpacity,
            y: textY,
            filter: textFilter,
            color: textColor,
            mixBlendMode: "difference",
          }}
        >
          A world where uncertainty <br />
          becomes clarity.
        </motion.div>

        {images.map((src, i) => (
          <ImageBurst key={i} src={src} motionProps={motionPropsList[i]} />
        ))}
      </div>

      <style>{`
        .projects-sticky {
          position: sticky;
          top: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          pointer-events: none;
          perspective: 1800px;
          transform-style: preserve-3d;
        }

        .projects-orbit {
          position: absolute;
          width: 850px;
          height: 850px;
          max-width: 100vw;
          max-height: 100vw;
        }

        .projects-text {
          position: absolute;
          font-size: clamp(24px, 6vw, 43px);
          font-weight: 200;
          line-height: 1;
          text-align: center;
          white-space: pre-line;
          z-index: 10;
          mix-blend-mode: difference;
        }
      `}</style>
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
  const gridRef = useRef(null);
  const fadeTopRef = useRef(null);
  const fadeBottomRef = useRef(null);

  const headlinePlayedRef = useRef(false);

  /* =========================
     BASE STATE (GSAP ONLY)
  ========================= */
  useEffect(() => {
    gsap.set(sectionRef.current, {
      backgroundColor: "#000",
      color: "#fff",
      borderBottomLeftRadius: "7vw",
      borderBottomRightRadius: "7vw",
    });

    gsap.set(".grid-line", {
      borderColor: "rgba(255,255,255,0.2)",
    });

    gsap.set(cursorRef.current, {
      backgroundColor: "#fff",
    });
  }, []);

  /* =========================
     BORDER RADIUS
  ========================= */
  useEffect(() => {
    const tween = gsap.to(sectionRef.current, {
      borderBottomLeftRadius: "0vw",
      borderBottomRightRadius: "0vw",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom bottom",
        end: "top+=35% top",
        scrub: 2,
      },
    });

    return () => tween.scrollTrigger?.kill();
  }, []);

  /* =========================
     PARALLAX LANES
  ========================= */
  useEffect(() => {
    const triggers = [];

    gsap.utils.toArray(".lane").forEach((lane, i) => {
      const t = gsap.fromTo(
        lane,
        { y: LANES[i].speed * -0.35 },
        {
          y: LANES[i].speed,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        }
      );

      triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach((t) => t?.kill());
  }, []);

  /* =========================
     PIN + HEADLINE
  ========================= */
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: textPinRef.current,
      pinSpacing: false,
      onEnter: playHeadline,
    });

    return () => trigger.kill();
  }, []);

  const playHeadline = () => {
    if (headlinePlayedRef.current) return;
    headlinePlayedRef.current = true;

    document.fonts.ready.then(() => {
      gsap.set(headlineRef.current, { opacity: 1 });

      const split = SplitText.create(headlineRef.current, {
        type: "lines",
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

  /* =========================
     DARK → LIGHT (CLEAN)
  ========================= */
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "55% bottom",
        end: "85% bottom",
        scrub: true,
      },
    });

    tl.fromTo(
      sectionRef.current,
      { backgroundColor: "#000", color: "#fff" },
      { backgroundColor: "#f5f5f5", color: "#111", ease: "none" }
    )
      .fromTo(
        ".grid-line",
        { borderColor: "rgba(255,255,255,0.2)" },
        { borderColor: "rgba(0,0,0,0.15)", ease: "none" },
        0
      )
      .fromTo(
        cursorRef.current,
        { backgroundColor: "#fff" },
        { backgroundColor: "#111", ease: "none" },
        0
      )
      .to(
        [fadeTopRef.current, fadeBottomRef.current],
        { opacity: 0, ease: "none" },
        0
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  /* =========================
     CURSOR
  ========================= */
  useEffect(() => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;

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
      {/* CURSOR */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0"
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <section
        ref={sectionRef}
        className="relative min-h-[480vh] overflow-hidden"
      >
        {/* GRID */}
        <div
          ref={gridRef}
          className="absolute inset-0 z-10 pointer-events-none grid"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)` }}
        >
          {Array.from({ length: GRID_COLUMNS }).map((_, i) => (
            <div key={i} className="grid-line border-r last:border-r-0" />
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
              Time to
              <br />
              Make it happen
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
        <div
          ref={fadeTopRef}
          className="pointer-events-none absolute top-0 left-0 w-full h-[240px] z-40
                     bg-gradient-to-b from-black via-black/90 to-transparent"
        />
        <div
          ref={fadeBottomRef}
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[360px] z-40
                     bg-gradient-to-t from-black via-black/90 to-transparent"
        />
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

  /* =========================
     MEASURE WIDTH
  ========================= */
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

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* =========================
     INFINITE SCROLL
  ========================= */
  useAnimationFrame((_, delta) => {
    const segmentWidth = segmentWidthRef.current;
    if (!segmentWidth) return;

    const speed = active ? 180 : 30;
    let next = x.get() - (speed * delta) / 1000;

    if (next <= -segmentWidth) {
      next += segmentWidth;
    }

    x.set(next);
  });

  /* =========================
     IMAGE TYPE DETECT
  ========================= */
  const isLogo = (src) => {
    const s = src.toLowerCase();
    return s.endsWith(".png");
  };

  /* =========================
     RENDER CARD
  ========================= */
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
            filter: "invert(1) brightness(0)",
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

  /* =========================
     MARQUEE DATA
  ========================= */
  const baseImages = useMemo(() => {
    if (!Array.isArray(item.images)) return [];
    return [...item.images, ...item.images];
  }, [item.images]);

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
      {segmentImages.map((src, i) =>
        renderImageCard(src, `${key}-${i}`)
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
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const ctxRef = useRef(null);
  const splitsRef = useRef([]);
  const resizeTimer = useRef(null);

  const items = [
    {
      industry: "Real Estate",
      name: "Real Estate & Property",
      year: "2025",
      images: [
        "https://i.imgur.com/MqFOJqk.jpeg",
        "/clients/novo-ampang/logo.png",
        "/clients/hey-yolo/main.jpg",
        "/clients/hey-yolo/logo.png",
        "/clients/dwm/5.jpg",
        "/clients/dwm/logo.png",
      ],
    },
    {
      industry: "Production",
      name: "Hospitality",
      year: "2025",
      images: [
        "/clients/tender-touch/4.jpg",
        "/clients/tender-touch/logo.png",
      ],
    },
    {
      industry: "Commerce",
      name: "Food & Beverage",
      year: "2025",
      images: [
        "https://i.imgur.com/GnY6iYR.jpeg",
        "/clients/marrosh/logo.png",
        "https://i.imgur.com/F4vcyc5.jpeg",
        "/clients/zai-cafe/logo.png",
      ],
    },
    {
      industry: "Branding",
      name: "E-Commerce",
      year: "2025",
      images: [
        "/clients/hidden-city-ubud/logo.png",
        "/clients/hidden-city-ubud/2.jpg",
      ],
    },
    {
      industry: "Branding",
      name: "Drone & Aerial Media",
      year: "2025",
      images: [
        "/clients/private-jet-villa/logo.png",
        "https://i.imgur.com/8jhTJv7.jpeg",
      ],
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  /* =========================
     GSAP HEADER (UNCHANGED)
  ========================= */
  useLayoutEffect(() => {
    const build = () => {
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {
        const leftSplit = SplitText.create(leftRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
        splitsRef.current.push(leftSplit);

        gsap.from(leftSplit.lines, {
          yPercent: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 75%",
          },
        });

        const rightSplit = SplitText.create(rightRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
        splitsRef.current.push(rightSplit);

        gsap.from(rightSplit.lines, {
          yPercent: 28,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power1.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 75%",
          },
        });
      }, sectionRef);

      ScrollTrigger.refresh();
    };

    document.fonts.ready.then(build);

    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(build, 200);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      splitsRef.current.forEach((s) => s.revert());
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      style={{ background: "black", padding: "6vh 0" }}
    >
      {/* ================= HEADER ================= */}
      <div
        ref={headerRef}
        className="works-header"
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.5fr",
          padding: "0 6vw 6vh",
          color: "white",
        }}
      >
        <h2
          ref={leftRef}
          style={{ fontSize: "2.5vw", margin: 0 }}
        >
          Industry Experience
        </h2>

        <p
          ref={rightRef}
          style={{ fontSize: "1vw", opacity: 0.7 }}
        >
          This selection represents work developed under different business
          contexts, where constraints, scale, and objectives vary from project
          to project.
        </p>
      </div>

      {/* ================= LIST ================= */}
      {items.map((item, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="works-row"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 2.2fr 1fr",
            padding: "2.5vh 0",
            borderBottom: "1px solid rgba(255,255,255,0.25)",
            color: "white",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {/* WHITE OVERLAY — DESKTOP ONLY */}
          <motion.div
            className="hover-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              zIndex: 1,
              transformOrigin: "center",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: hoveredIndex === i ? 1 : 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />

          <MarqueeOverlay item={item} active={hoveredIndex === i} />

          <div style={{ zIndex: 2, display: "contents" }}>
            <div />
            <div
              className="works-title"
              style={{ fontSize: "4.5vw", textAlign: "center" }}
            >
              {item.name}
            </div>
            <div />
          </div>
        </div>
      ))}

      {/* ================= MOBILE ONLY ================= */}
      <style jsx>{`
        @media (max-width: 768px) {
          .works-header {
            grid-template-columns: 1fr !important;
            padding: 0 6vw 4vh !important;
          }

          .works-header h2 {
            font-size: 32px !important;
          }

          .works-header p {
            font-size: 14px !important;
            max-width: 90%;
          }

          .works-row {
            grid-template-columns: 1fr !important;
            padding: 4vh 6vw !important;
          }

          .works-title {
            font-size: 34px !important;
            text-align: left !important;
          }

          .hover-overlay {
            display: none;
          }
        }
      `}</style>
    </section>
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
  const headerRef = useRef(null);
  const rightTextRef = useRef(null);

  const splitsRef = useRef([]);
  const ctxRef = useRef(null);
  const resizeTimer = useRef(null);

  const [hoverIndex, setHoverIndex] = useState(null);
  const [inside, setInside] = useState(false);

  // =====================
  // CUSTOM CURSOR FOLLOW
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

      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setInside(isInside);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // =====================
  // GSAP TEXT BUILD
  // =====================
  useLayoutEffect(() => {
    const build = () => {
      if (!sectionRef.current || !headerRef.current || !rightTextRef.current)
        return;

      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {
        gsap.set([headerRef.current, rightTextRef.current], {
          opacity: 1,
          clearProps: "transform",
        });

        const headerSplit = SplitText.create(headerRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
        splitsRef.current.push(headerSplit);

        gsap.from(headerSplit.lines, {
          yPercent: 35,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });

        const rightSplit = SplitText.create(rightTextRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
        splitsRef.current.push(rightSplit);

        gsap.from(rightSplit.lines, {
          yPercent: 25,
          opacity: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "power1.out",
          scrollTrigger: {
            trigger: rightTextRef.current,
            start: "top 85%",
          },
        });
      }, sectionRef);

      ScrollTrigger.refresh();
    };

    document.fonts.ready.then(build);

    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(build, 200);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      splitsRef.current.forEach((s) => s.revert());
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

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
    data-theme="light"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F3F4F5] text-black overflow-hidden cursor-none"
    >
      {/* CUSTOM CURSOR */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
      >
        <div
          className="w-[70px] h-[70px] rounded-full bg-[#C8FF4D]"
          style={{
            transform: inside ? "scale(1)" : "scale(0)",
            opacity: inside ? 1 : 0,
            transition:
              "transform 220ms cubic-bezier(0.22,1,0.36,1), opacity 180ms ease-out",
          }}
        />
      </div>

      <div className="max-w-screen mx-auto h-full px-6 sm:px-8 lg:px-16 py-10 flex flex-col">
        {/* ===================== */}
        {/* TOP TEXT — RAPAT */}
        {/* ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-10 items-start">
          {/* LEFT — HEADLINE */}
          <div className="lg:col-span-7">
            <h2
              ref={headerRef}
              className="font-sans font-normal tracking-tight"
            >
              <span className="block text-[clamp(32px,5vw,55px)] leading-[1.02] text-neutral-900">
                Services built to help
              </span>

              <span className="block -mt-1 text-[clamp(32px,5vw,55px)] leading-[1.02] text-neutral-900">
                brands grow
              </span>

              <span className="block mt-2 text-[clamp(18px,2vw,26px)] leading-tight text-neutral-400">
                and stay relevant
              </span>
            </h2>
          </div>

          {/* RIGHT — SUPPORTING BODY */}
          <div className="lg:col-span-4 lg:col-start-9 lg:mt-5">
            <p
              ref={rightTextRef}
              className="text-[14px] leading-[1.55] text-neutral-800 max-w-sm"
            >
              <span className="lg:mr-10"></span>Most brands come to us when growth starts feeling harder to manage
              and consistency across platforms begins to break down. We step in
              to bring structure, clarity, and momentum back into their digital
              work.
            </p>
          </div>
           
          
        </div>

        {/* ===================== */}
        {/* MAIN CONTENT */}
        {/* ===================== */}
        <div className="relative flex-1 mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
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
                      style={{ fontSize: "clamp(36px, 7vw, 95px)" }}
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



function Header() {
  const headerRef = useRef(null);

  // =========================
  // SCROLL STATES
  // =========================
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const [hidden, setHidden] = useState(true);
  const [enabled, setEnabled] = useState(false);

  // =========================
  // MOBILE MENU
  // =========================
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================
  // SCROLL LOGIC
  // =========================
  useEffect(() => {
    const threshold = 8;

    const onScroll = () => {
      const currentY = window.scrollY;
      const triggerY = window.innerHeight * 1.01;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentY >= triggerY) {
            setEnabled(true);
          } else {
            setEnabled(false);
            setHidden(true);
            lastScrollY.current = currentY;
            ticking.current = false;
            return;
          }

          const diff = currentY - lastScrollY.current;

          if (diff > threshold) setHidden(true);
          if (diff < -threshold) setHidden(false);

          lastScrollY.current = currentY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // =========================
  // INTERSECTION → DATA-THEME
  // =========================
  useEffect(() => {
    if (!enabled) return;

    const header = headerRef.current;
    if (!header) return;

    const sections = document.querySelectorAll("[data-theme]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            header.dataset.theme = entry.target.dataset.theme;
          }
        });
      },
      {
        rootMargin: "-1px 0px -99% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <>
      {/* HEADER */}
      <header
        ref={headerRef}
        data-theme="light"
        className={`
          group
          fixed top-0 left-0 z-50 w-full
          bg-transparent
          transition-transform duration-300 ease-out
          ${
            !enabled || hidden
              ? "-translate-y-full"
              : "translate-y-0"
          }
        `}
      >
        <div
          className="
            relative
            mx-auto
            px-4 sm:px-6 md:px-20
            min-h-[64px] md:min-h-[72px]
            flex items-center
          "
        >
          {/* LEFT — NAV (DESKTOP ONLY) */}
          <nav
            aria-label="Primary navigation"
            className="
              hidden md:flex
              items-center gap-6
              flex-1 min-w-0
              text-sm font-medium tracking-wide
            "
          >
            {["Work", "Pricing", "Services", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="
                  transition-colors whitespace-nowrap
                  group-data-[theme=light]:text-black
                  group-data-[theme=dark]:text-white
                "
              >
                {item}
              </a>
            ))}
          </nav>

          {/* MOBILE — HAMBURGER */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="
              md:hidden
              relative z-50
              w-10 h-10
              flex items-center justify-center
              group-data-[theme=light]:text-black
              group-data-[theme=dark]:text-white
            "
            aria-label="Open menu"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
            </div>
          </button>

          {/* CENTER — LOGO */}
          <div
            className="
              absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              pointer-events-none
            "
          >
            <a href="/" className="pointer-events-auto block">
              <img
                src="/png/boson-black.png"
                alt="Boson"
                className="
                  w-16 sm:w-18 md:w-28
                  h-auto
                  transition
                  group-data-[theme=dark]:invert
                "
              />
            </a>
          </div>

          {/* RIGHT — CTA (DESKTOP ONLY) */}
          <div className="hidden md:flex items-center justify-end flex-1">
            <a
              href="#contact"
              className="
                relative
                text-sm font-medium tracking-wide whitespace-nowrap
                transition-colors
                group-data-[theme=light]:text-black
                group-data-[theme=dark]:text-white
              "
            >
              Contact
              <span
                className="
                  pointer-events-none
                  absolute left-0 right-0 -bottom-0.5
                  h-px
                  scale-x-0 origin-left
                  transition-transform duration-300
                  hover:scale-x-100
                  group-data-[theme=light]:bg-black
                  group-data-[theme=dark]:bg-white
                "
              />
            </a>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        <div
          className={`
            md:hidden
            absolute top-full left-0 w-full
            bg-white text-black
            group-data-[theme=dark]:bg-black
            group-data-[theme=dark]:text-white
            transition-all duration-300
            ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
        >
          <nav className="flex flex-col px-6 py-6 gap-4 text-base">
            {["Work", "Pricing", "Services", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="tracking-wide"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}








function Description() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const dividerRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const splitsRef = useRef([]);
  const ctxRef = useRef(null);
  const resizeTimer = useRef(null);

  useLayoutEffect(() => {
    const isTouch = ScrollTrigger.isTouch === 1;

    const build = () => {
      if (
        !sectionRef.current ||
        !titleRef.current ||
        !bodyRef.current ||
        !dividerRef.current ||
        !statsRef.current ||
        !ctaRef.current
      ) {
        return;
      }

      // cleanup
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {
        gsap.set(
          [
            titleRef.current,
            dividerRef.current,
            ctaRef.current,
            ...statsRef.current.querySelectorAll("[data-stat]"),
            ...bodyRef.current.querySelectorAll("[data-animate]"),
          ],
          { opacity: 1, clearProps: "transform" }
        );

        /* =====================
           TITLE
        ===================== */
        const titleSplit = SplitText.create(titleRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
        splitsRef.current.push(titleSplit);

        gsap.from(titleSplit.lines, {
          yPercent: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        /* =====================
           DIVIDER
        ===================== */
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        /* =====================
           BODY PARAGRAPHS
        ===================== */
        bodyRef.current
          .querySelectorAll("[data-animate]")
          .forEach((p) => {
            const split = SplitText.create(p, {
              type: "lines",
              linesClass: "line",
              mask: "lines",
            });
            splitsRef.current.push(split);

            gsap.from(split.lines, {
              yPercent: 32,
              opacity: 0,
              duration: 1.1,
              stagger: 0.06,
              ease: "power1.out",
              scrollTrigger: {
                trigger: p,
                start: "top 85%",
                once: true,
              },
            });
          });

        /* =====================
           STATS
        ===================== */
        gsap.from(statsRef.current.querySelectorAll("[data-stat]"), {
          opacity: 0,
          y: 10,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        });

        /* =====================
           CTA
        ===================== */
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true,
          },
        });
      }, sectionRef);

      // refresh ONLY desktop
      if (!isTouch) {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };

    document.fonts.ready.then(build);

    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        if (!isTouch) build();
      }, 200);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      splitsRef.current.forEach((s) => s.revert());
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="w-full bg-[#F3F4F5] text-black py-12 lg:py-20"
    >
      <div className="max-w-screen mx-auto px-5 sm:px-6 lg:px-12">
        {/* HEADLINE */}
        <div className="max-w-full mb-12 lg:mb-16">
          <h1
            ref={titleRef}
            className="font-sans font-medium tracking-tight leading-[1.05]"
            style={{ fontSize: "clamp(32px, 5vw, 134px)" }}
          >
            <span className="hidden lg:inline mr-80" />
            We are a social media agency that helps brands stay consistent
            online. We keep everything on track so you can stay focused on
            what <span className="italic">matters</span>
          </h1>

          <div
            ref={dividerRef}
            className="mt-8 lg:mt-10 h-px w-full bg-neutral-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-y-20">
          {/* STATS */}
          <div ref={statsRef} className="lg:col-span-5">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-neutral-500">
    
    <div data-stat className="flex items-center sm:items-start gap-4 sm:flex-col">
      <BriefcaseIcon className="w-6 h-6 text-neutral-700 block sm:hidden" />
      <div>
        <div className="text-[22px] font-medium text-neutral-800">100+</div>
        <div className="text-xs uppercase tracking-widest">Projects delivered</div>
      </div>
    </div>

    <div data-stat className="flex items-center sm:items-start gap-4 sm:flex-col">
      <GlobeAltIcon className="w-6 h-6 text-neutral-700 block sm:hidden" />
      <div>
        <div className="text-[22px] font-medium text-neutral-800">3</div>
        <div className="text-xs uppercase tracking-widest">Countries served</div>
      </div>
    </div>

    <div data-stat className="flex items-center sm:items-start gap-4 sm:flex-col">
      <UsersIcon className="w-6 h-6 text-neutral-700 block sm:hidden" />
      <div>
        <div className="text-[22px] font-medium text-neutral-800">2.5m+</div>
        <div className="text-xs uppercase tracking-widest">Total audience reach</div>
      </div>
    </div>

  </div>
</div>


          {/* BODY + CTA */}
          <div
            ref={bodyRef}
            className="lg:col-span-7 max-w-full lg:max-w-xl lg:ml-auto text-neutral-800 text-[16px] lg:text-[17px] leading-[1.6]"
          >
            <p data-animate className="mb-8 lg:mb-10">
              Boson is a digital agency founded in 2021 and based in Bali,
              working with clients across Qatar, Malaysia, and other regions.
              Our work combines design, development, and brand operations,
              giving teams a toolkit that keeps everything consistent.
            </p>

            <a ref={ctaRef} href="#projects" className="inline-flex items-center gap-3 px-7 lg:px-8 py-4 rounded-full border border-black bg-black text-white text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white hover:text-black">
              DISCOVER ALL PROJECTS →
            </a>
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
      title: "Sunny\nDevelopment",
      image: "https://i.imgur.com/Gjuxvj5.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A property development group delivering residential and hospitality projects with a focus on design, lifestyle, and long-term value",
    },
    {
      title: "Novo\nAmpang",
      image: "https://i.imgur.com/UzRs3rO.mp4",
      meta: ["REAL ESTATE", "KUALA LUMPUR", "SOCIAL MEDIA MARKETING"],
      desc:
        "A premium residential development in Kuala Lumpur designed for urban living and investment-driven buyers",
    },
    {
      title: "Shinobi\nSoirée",
      image: "https://i.imgur.com/WJI4G8F.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc:
        "A club in Bali functioning as a music-oriented social venue, defined by its spatial layout, sound, and collective presence",
    },
    {
      title: "Marrosh\nBali",
      image: "/clients/marrosh/main.mp4",
      meta: ["FOOD & BEVERAGE", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc:
        "A Lebanese restaurant in Canggu offering authentic Middle Eastern cuisine in a warm, casual dining setting.",
    },
    {
      title: "Tender\nTouch",
      image: "/clients/tender-touch/main.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A wellness and massage brand in Bali offering premium treatments focused on recovery, relaxation, and holistic care",
    },
  ];

  const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const slidesCount = projects.length;
      const track = trackRef.current;
      const progressBar = progressRef.current;

      const getScrollDistance = () =>
        (slidesCount - 1) * window.innerWidth;

      const mainTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            gsap.set(progressBar, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });

            const index = Math.round(
              self.progress * (slidesCount - 1)
            );
            setActiveIndex(index);
          },
        },
      });

      const parallax = (selector, fromX, toX) => {
        gsap.utils.toArray(selector).forEach((el) => {
          gsap.fromTo(
            el,
            { x: fromX },
            {
              x: toX,
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
      };

      parallax(".parallax-title", 40, -40);
      parallax(".parallax-image", 90, -90);
      parallax(".parallax-meta", 140, -140);
    }, sectionRef);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative w-full bg-black text-white overflow-hidden lg:h-screen"
    >
      {/* TRACK */}
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
          {projects.map((p, i) => (
            <div
              key={i}
              className="relative w-full lg:w-screen min-h-screen flex-shrink-0"
            >
              <div className="relative max-w-[1600px] mx-auto h-full px-6 lg:px-16 pt-24 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
                <span className="lg:col-span-12 text-xs tracking-widest text-white/50">
                  PROJECT 0{i + 1}
                </span>

                {/* TITLE — MIX BLEND MODE */}
                <h1
                  className="
                    parallax-title
                    text-[56px] leading-[1]
                    font-light whitespace-pre-line
                    lg:text-[96px] lg:leading-[0.95]
                    lg:absolute lg:left-50 lg:top-[25%]
                    z-30
                    mix-blend-difference
                    pointer-events-none
                    select-none
                  "
                >
                  {p.title}
                </h1>

                {/* MEDIA */}
                <div className="lg:col-span-4 lg:col-start-5 z-10">
                  <div
                    className="
                      parallax-image
                      relative
                      w-full
                      aspect-[3/4]
                      overflow-hidden
                      lg:max-w-[420px]
                      lg:mx-auto
                    "
                  >
                    {isVideo(p.image) ? (
                      <video
                        src={p.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={p.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt=""
                      />
                    )}
                  </div>
                </div>

                {/* META */}
                <div className="parallax-meta lg:col-span-3 lg:col-start-9 flex flex-col gap-6 lg:justify-end">
                  <div className="space-y-2 text-xs">
                    {p.meta.map((m) => (
                      <p key={m} className="underline">
                        {m}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-white/60">
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRESS */}
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



 


 
 


/* ==========================================
   PAGE
   ========================================== */

   export default function Page() {
    const ready = useContext(LoaderContext);
  
    const bgRef = useRef(null);
    const footerRef = useRef(null);
  
    const [footerHeight, setFooterHeight] = useState(0);
  
    /* ==================================================
      RESET SCROLL
    ================================================== */
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    /* ==================================================
      MEASURE FOOTER HEIGHT (ROBUST + DETERMINISTIC)
    ================================================== */
    useLayoutEffect(() => {
      if (!ready) return;
  
      const footer = footerRef.current;
      if (!footer) return;
  
      const measure = () => {
        const rect = footer.getBoundingClientRect();
        setFooterHeight(rect.height);
      };
  
      // initial sync (post layout)
      requestAnimationFrame(() => {
        requestAnimationFrame(measure);
      });
  
      const observer = new ResizeObserver(() => {
        measure();
      });
  
      observer.observe(footer);
  
      window.addEventListener("resize", measure);
  
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [ready]);
  
    /* ==================================================
      SCROLL-DRIVEN FOOTER REVEAL (PURE, MANUAL)
    ================================================== */
    useEffect(() => {
      if (!ready) return;
      if (!footerHeight) return;
  
      const footer = footerRef.current;
      if (!footer) return;
  
      const OFFSET = window.innerHeight * 0.5;
  
      // INIT STATE
      footer.style.transform = `translateY(${OFFSET}px)`;
  
      const onScroll = () => {
        const scrollY = window.scrollY;
        const viewportH = window.innerHeight;
        const docH = document.documentElement.scrollHeight;
  
        // trigger zone
        const start = docH - viewportH - footerHeight;
        const end = docH - viewportH;
  
        let progress = (scrollY - start) / (end - start);
        progress = Math.min(Math.max(progress, 0), 1);
  
        const y = OFFSET * (1 - progress);
        footer.style.transform = `translateY(${y}px)`;
      };
  
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
  
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, [ready, footerHeight]);
  
    if (!ready) return null;
  
    return (
      <div
        className="chayay"
        ref={bgRef}
        style={{
          width: "100%",
          background: "black",
          position: "relative",
        }}
      >
        {/* ==================================================
          HERO / TOP
        ================================================== */}
  
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            background: "#000",
          }}
        >
          <HeroJoin />
        </div>
  
        {/* <div className="h-screen w-screen bg-white" /> */}
  
        <Header />
  
        <div
          data-theme="dark"
          style={{ position: "relative", zIndex: 2, width: "100%" }}
        >
          <BosonNarrative />
        </div>
  
        <div style={{ position: "relative", zIndex: 2 }}>
          <Projects />
        </div>
  
        {/* ==================================================
          DESCRIPTION
        ================================================== */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Description />
        </div>
  
        <div style={{ position: "relative", zIndex: 2 }}>
          <VideoSection />
        </div>
  
        <div style={{ position: "relative", zIndex: 2 }}>
          <ServicesHero />
        </div>
  
        <div style={{ position: "relative", zIndex: 2 }}>
          <BigHeading />
        </div>
  
        <div style={{ position: "relative", zIndex: 2 }}>
          <ProjectShowcase />
        </div>
  
        <div style={{ position: "relative", zIndex: 2 }}>
          <WorksList />
        </div>
  
        {/* <BosonScrollText /> */}
  
        {/* ==================================================
          GALERY
        ================================================== */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Galery />
        </div>
  
        {/*
          <MeetBoson />
        */}
  
        {/*
          <div style={{ position: "relative", zIndex: 2 }}>
            <Carousel />
          </div>
        */}
  
        {/*
          <div style={{ position: "relative", zIndex: 2 }}>
            <IndustriesPage />
          </div>
        */}
  
        {/* ==================================================
          EXTRA SCROLL DEPTH (DYNAMIC BUFFER)
        ================================================== */}
        <div
          style={{
            height: footerHeight,
          }}
        />
  
        {/* ==================================================
          FOOTER — FIXED, PURE SCROLL-DRIVEN
        ================================================== */}
        <div
          ref={footerRef}
          className="fixed bottom-0 left-0 w-full z-0"
          style={{
            willChange: "transform",
          }}
        >
          <Footer />
        </div>
  
        {/* ==================================================
          GLOBAL STYLE
        ================================================== */}
        <style jsx global>{`
          body {
            background: #000;
            overflow-x: hidden;
          }
        `}</style>
      </div>
    );
  }
  