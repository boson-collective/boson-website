"use client";

import React, { Fragment, useLayoutEffect, useRef, useContext, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { LoaderContext } from "../../../components/atoms/LoaderGate";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
gsap.registerPlugin(ScrollTrigger);

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
  <div className="relative w-full h-screen overflow-hidden flex justify-center items-center text-white/80">
    <Webglbg />

    {/* NAV */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.75, y: 0 }}
      transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
      className="absolute top-6 sm:top-10 w-full px-6 sm:px-20 flex justify-between text-xs sm:text-sm z-20 tracking-wide"
    >
      <div className="flex gap-4 sm:gap-8">
        <span>About</span>
        <span>Philosophy</span>
      </div>
      <div className="flex gap-4 sm:gap-8">
        <span>Works</span>
        <span>Contact</span>
      </div>
    </motion.div>

    {/* BOSON CHROME */}
    <motion.div
      initial={{ opacity: 0, scale: 1.5, filter: "blur(100px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: 2.4, duration: 1.8, ease: "easeOut" }}
      className="absolute inset-0 z-10 flex items-center justify-center"
    >
      <div className="boson-chrome-v4" />
    </motion.div>

    {/* SIDE LEFT */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay: 2.3, duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-[28%] sm:bottom-[22%] left-1/2 sm:left-20 sm:text-left -translate-x-1/2 sm:translate-x-0 
      text-[11px] sm:text-sm leading-relaxed max-w-[240px] text-center sm:text-start z-20"
    >
      A system-driven studio
      <br />
      for modern identity & engineering.
    </motion.div>

    {/* SIDE RIGHT */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay: 2.35, duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-[20%] sm:bottom-[22%] right-1/2 sm:right-20 sm:text-right translate-x-1/2 sm:translate-x-0
      text-[11px] sm:text-sm leading-relaxed max-w-[240px] text-center sm:text-right z-20"
    >
      Focused on how to shape
      <br />
      the future, not follow it.
    </motion.div>

    {/* FOOTER */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.55, y: 0 }}
      transition={{ delay: 2.4, duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-6 sm:bottom-10 w-full px-6 sm:px-20 flex justify-between 
      text-[10px] sm:text-xs tracking-wide z-20"
    >
      <span>06°10&apos;00&quot;S</span>
      <span>Bali, Indonesia</span>
      <span>106°49&apos;00&quot;E</span>
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
          linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 40%, rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.4) 100%),
          radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0.35) 80%, rgba(0, 0, 0, 0.55) 100%),
          #09070b;

        background-blend-mode: screen, multiply;

        filter: blur(0.6px);
        opacity: 0.5;
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
  "/clients/tender-touch/3.jpg",
  "/clients/tender-touch/4.jpg",
  "/clients/tender-touch/5.jpg",
  "/clients/tender-touch/3.jpg",
  "/clients/tender-touch/4.jpg",
  "/clients/tender-touch/5.jpg",
  "/clients/tender-touch/3.jpg",
  "/clients/tender-touch/4.jpg",
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
        background: "#000",
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
          background: #000;
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(mq);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

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


  const text = `In the beginning
there is only possibility.
A world where uncertainty
becomes clarity.`;

  return (
    <div
      ref={wrap}
      onMouseMove={handleMove}
      className="boson-narrative-container w-full min-h-screen bg-[#09070b] relative overflow-hidden flex items-center justify-center"
      style={{ padding: "200px 8vw" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          textAlign: "center",
          whiteSpace: "pre-wrap",
          fontSize: "clamp(32px, 6vw, 78px)",
          lineHeight: 1.28,
          fontWeight: 400,
          color: isMobile
            ? "rgba(255,255,255,0.96)"
            : "rgba(255,255,255,0.10)",
        }}
      >
        {text}

        {!isMobile && (
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              textAlign: "center",
              color: "rgba(255,255,255,0.96)",
              fontWeight: 400,
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

  const itemHeight = "clamp(36px, 6vw, 84px)";
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
        fontFamily: 'Bricolage Grotesque'

      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* TEXT TITLE */}
      <h2
        style={{
          color: hovered ? "transparent" : "#FDEBD3",
          fontWeight: 600,
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
      title: "Real Estate & Property",
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
      title: "Lifestyle & Hospitality",
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
      title: "Personal Brand",
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
      title: "Food & Beverage",
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
    <div style={{ padding: "150px 20px", background: "#e85848", color: "#FDEBD3", fontFamily: 'Bricolage Grotesque'}}>
      <h1
        style={{
          fontSize: "clamp(80px, 22vw, 300px)",
          fontWeight: "800",
          lineHeight: 0.9,
          margin: 0,
          textAlign: "center",
        }}
      >
        INDUSTRIES
      </h1>

      <p style={{ textAlign: "center", marginBottom: "60px" }}>
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
      const box = maskGroup.current.getBBox();
      const viewportWidth = window.innerWidth;

      // Geser sampai huruf terakhir sedikit lewat center
      const scrollDistance = Math.max(
        box.x + box.width - viewportWidth * 0.7,
        0
      );

      gsap.to(maskGroup.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: true,
          pin: true,
        },
      });

      gsap.to(maskGroup.current, {
        scale: 6,
        transformBox: "fill-box",
        transformOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: `top+=${scrollDistance} top`,
          end: "+=900",
          scrub: true,
        },
      });
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
        src="https://video.wixstatic.com/video/f0fad4_c5e73af6159647568391799b6d161626/1080p/mp4/file.mp4"
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

      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, zIndex: 10 }}
      >
        <mask id="text-mask">
          <rect width="100%" height="100%" fill="white" />
          <g ref={maskGroup} fill="black">
            <text
              x="0"
              y="60%"
              fontSize="55vw"
              fontWeight="900"
              letterSpacing="-0.05em"
              dominantBaseline="middle"
            >
              COLLECTIVE
            </text>
          </g>
        </mask>

        <rect width="100%" height="100%" fill="#09070b" mask="url(#text-mask)" />
      </svg>
    </section>
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

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // ROTATION VALUES (for orbits)
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -540]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 900]);

  // ============================
  // TEXT REVEAL with Framer Motion
  // ============================
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.12], [-50, 0]);
  const textFilter = useTransform(
    scrollYProgress,
    [0, 0.12],
    ["blur(20px)", "blur(0px)"]
  );

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
    "/clients/hidden-city-ubud/mockup.png", // 3
    "/clients/marrosh/mockup.png", // 4 (extra)
    "/clients/dwm/mockup.png", // 5
    "/clients/tender-touch/mockup.png", // 6
    "/clients/marrosh/mockup.png", // 0
    "/clients/dwm/mockup.png", // 1
    "/clients/tender-touch/mockup.png", // 2
    "/clients/hidden-city-ubud/mockup.png", // 3
    "/clients/marrosh/mockup.png", // 4 (extra)
    "/clients/dwm/mockup.png", // 5
    "/clients/marrosh/mockup.png", // 0
    "/clients/dwm/mockup.png", // 1
    "/clients/tender-touch/mockup.png", // 2
    "/clients/hidden-city-ubud/mockup.png", // 3
    "/clients/marrosh/mockup.png", // 4 (extra)
    "/clients/dwm/mockup.png", // 5
  ];

  // ============================
  // STAGGERED BURST TIMING (micro-stagger)
  // base start, step, window length
  // ============================
  const baseStart = 0.15;
  const step = 0.03; // small delay between starts
  const windowLen = 0.17; // each burst end = start + windowLen

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
        height: "1200vh",
        background: "#09070b",
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
            fontSize: "32px",
            textAlign: "center",
            fontWeight: 300,
            lineHeight: 1.3,
            zIndex: 10,
            whiteSpace: "pre-line",
          }}
        >
          {`Signals, motion, intent:
The Boson process takes shape`}
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
      className="relative bg-[#09070b] overflow-hidden w-full big-heading-container"
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
              fontWeight: 300,
              lineHeight: 0.8,
              opacity: 0.9,
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
              fontWeight: 300,
              lineHeight: 0.8,
              opacity: 0.45,
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
            height: "18vh",
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
          height: "18vh",
          width: "32vh",
          borderRadius: "2vh",
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
        background: "#09070b",
        width: "100%",
        padding: "6vh 0",
        position: "relative",
      }}
    >
      
      {/* BOSON SUBHEADER */}
<div
  style={{
    width: "100%",
    color: "white",
    textAlign: "center",
    fontSize: "1.1vw",
    fontWeight: 300,
    opacity: 0.7,
    marginBottom: "6vh",
    letterSpacing: "0.02em",
    lineHeight: 1.4,
    padding: "0 10vw",
    textTransform: "none",
  }}
>
Every decision, every detail is a lever — elevating the whole
</div>

      
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
                fontSize: "6.8vw",
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
  

function Footer() {
  return (
    <div className="relative w-full bg-black text-white px-[80px] py-[180px] overflow-hidden flex items-center justify-center max-[900px]:px-6 max-[900px]:py-[140px]">

      {/* BOSON LOGO BACKDROP */}
      <div className="footer-chrome absolute right-0 top-1/2 -translate-y-1/2 w-[900px] h-[1100px] opacity-[0.20] pointer-events-none select-none max-[900px]:right-[-20%] max-[900px]:w-[600px] max-[900px]:h-[750px]" />

      {/* GRID */}
      <div className="relative z-[2] grid grid-cols-[1fr_0.6fr] gap-20 w-full max-w-[1400px] max-[900px]:grid-cols-1 max-[900px]:gap-12">

        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-10">

          <h2 className="text-[64px] font-light leading-[1.05] tracking-tight max-[900px]:text-[42px]">
            Let’s work<br/>together
          </h2>

          <div className="w-[70%] border-t border-white/10 max-[900px]:w-full" />

          <a href="mailto:boson.studio@gmail.com"
            className="inline-flex items-center justify-center bg-[#822222] px-12 py-5 rounded-full text-base font-medium whitespace-nowrap opacity-95 hover:opacity-100 transition-all duration-200 tracking-wide w-fit">
            Get in touch →
          </a>

          <div className="text-sm opacity-75 font-light">
            boson.studio@gmail.com
          </div>

          <div className="text-xs opacity-70 flex gap-3 flex-wrap">
            <span>Based in Bali</span>•<span>Working Worldwide</span>•<span>Since 2021</span>
          </div>

          <div className="flex gap-6 text-xs opacity-70 mt-1 flex-wrap">
            {["Behance", "LinkedIn", "Contact"].map((txt) => (
              <a key={txt} className="cursor-pointer hover:opacity-100 transition-opacity">
                {txt}
              </a>
            ))}
          </div>

        </div>

        {/* RIGHT EMPTY COLUMN FOR BALANCE */}
        <div />

      </div>

      <style jsx>{`
        .footer-chrome {
          mask-image: url("/boson-white.png");
          -webkit-mask-image: url("/boson-white.png");
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;
          background: linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 4%, rgba(255,255,255,0.25) 7%, rgba(255,255,255,0) 11%), linear-gradient(140deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 3%, rgba(255,255,255,0) 8%), radial-gradient(circle at 50% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%), radial-gradient(circle at 50% 78%, rgba(0,0,0,0.4), rgba(0,0,0,0) 70%), radial-gradient(circle at 50% 70%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,1) 100%), linear-gradient(180deg, rgba(255,255,255,0.6), rgba(30,30,30,0.85) 45%, rgba(0,0,0,1) 95%);
          background-blend-mode: screen, screen, screen, multiply, multiply, multiply, multiply, overlay;
        }
      `}</style>
    </div>
  );
}

 

 
 


/* ==========================================
   PAGE
   ========================================== */

   export default function Page() {
    const ready = useContext(LoaderContext);
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    if (!ready) return null;
  
    
    return (
      <div style={{ width: "100%", background: "#000", position: "relative" }}>
        <div style={{ position: "relative", zIndex: 2, width: "100%", background: "#000" }}>
          <HeroJoin />
        </div>
    
        <div style={{ position: "relative", zIndex: 2, width: "100%", background: "#000" }}>
          <BosonNarrative />
        </div>
    
        <div style={{ position: "relative", zIndex: 2 }}>
          <Projects />
        </div>
    
        <div style={{ position: "relative", zIndex: 2 }}>
          <BigHeading />
        </div>
    
        <div style={{ position: "relative", zIndex: 2 }}>
          <WorksList />
        </div>
    
        {/* <div style={{ position: "relative", zIndex: 2 }}>
          <Carousel />
        </div> */}
        
         <MeetBoson />
         
         <IndustriesPage/>
         
    
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
    
    
    // return (
    //   <div style={{ width: "100%", background: "#000", position: "relative" }}>

    //     {/* HERO */}
    //     <HeroJoin />
  
    //     {/* BOSON NARRATIVE */}
    //     <BosonNarrative />
  
    //     <div style={{ position: "relative", zIndex: 2 }}>
    //       <Projects />
    //     </div>
        
    //     {/* MEET BOSON (GSAP pin — TIDAK BOLEH ADA WRAPPER) */}
    //     <MeetBoson />
        
    //     {/* <IndustriesPage /> */}
        
    //     <Footer />
  
    //     {/* OTHER SECTIONS */}
    //     {/*
        
    //     <BigHeading />
    //     <WorksList />
    //     <Carousel />
    //     */}
  
    //     <style jsx global>{`
    //       html,
    //       body {
    //         background: #000; 
    //         overflow-x: hidden;
    //       }
    //     `}</style>
    //   </div>
    // );
  }
  