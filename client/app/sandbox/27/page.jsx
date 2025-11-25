"use client";

import { useLayoutEffect, useRef, useContext, useState, useEffect } from "react";
import gsap from "gsap";
import { LoaderContext } from "../../../components/atoms/LoaderGate";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { motion, useScroll, useTransform, useAnimation } from "framer-motion";




/* ==========================================
   HERO (unchanged markup, styling tightened)
   ========================================== */
function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 80])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex justify-center items-center text-white/80">

      {/* NAV */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
        className="absolute top-10 w-full px-20 flex justify-between text-sm z-20 tracking-wide"
      >
        <div className="flex gap-8"><span>About</span><span>Philosophy</span></div>
        <div className="flex gap-8"><span>Works</span><span>Contact</span></div>
      </motion.div>

      {/* BOSON CHROME */}
      <motion.div
  initial={{ opacity: 0, scale: 1.07, filter: "blur(10px)" }}
  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
  transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
  className="absolute inset-0 z-10 flex items-center justify-center"
>
  <div className="boson-chrome-v4" />
</motion.div>


      {/* TITLE */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.8, ease: "easeOut" }}
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center text-center select-none"
      >
        <span className="text-[72px] font-light tracking-[-0.03em] text-white/95 leading-[0.82]">boson</span>
        <span className="text-[72px] font-light tracking-[-0.03em] text-white/95 leading-[0.82] -mt-[6px]">collective</span>
      </motion.div>

      {/* SIDE LEFT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 2.3, duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-[22%] left-20 text-sm leading-relaxed max-w-[240px] z-20"
      >
        A system-driven studio<br />for modern identity & engineering.
      </motion.div>

      {/* SIDE RIGHT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 2.35, duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-[22%] right-20 text-right text-sm leading-relaxed max-w-[240px] z-20"
      >
        Focused on how to shape<br />the future, not follow it.
      </motion.div>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.55, y: 0 }}
        transition={{ delay: 2.4, duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-10 w-full px-20 flex justify-between text-xs z-20"
      >
        <span>06°10'00"S</span>
        <span>Bali, Indonesia</span>
        <span>106°49'00"E</span>
      </motion.div>

      {/* CHROME CSS (unchanged) */}
      <style jsx>{`
        .boson-chrome-v4 {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 1250px;
          height: 1250px;
          mask-image: url("/boson-white.png");
          -webkit-mask-image: url("/boson-white.png");
          mask-size: contain;
          mask-position: center;
          mask-repeat: no-repeat;
          opacity: 0.9;
          filter: blur(0.2px);
          background:
            linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 4%, rgba(255,255,255,0.25) 7%, rgba(255,255,255,0) 11%),
            linear-gradient(140deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 3%, rgba(255,255,255,0) 8%),
            radial-gradient(circle at 50% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%),
            radial-gradient(circle at 50% 78%, rgba(0,0,0,0.4), rgba(0,0,0,0) 70%),
            radial-gradient(circle at 50% 70%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,1) 100%),
            linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,1) 100%),
            linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%),
            linear-gradient(180deg, rgba(255,255,255,0.6), rgba(30,30,30,0.85) 45%, rgba(0,0,0,1) 95%);
          background-blend-mode: screen, screen, screen, multiply, multiply, multiply, multiply, overlay;
        }
      `}</style>
    </div>
  )
}
  

function BosonNarrative() {
  const wrap = useRef(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const targetPos = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    let frame;

    const animate = () => {
      setPos((prev) => {
        const dx = targetPos.current.x - prev.x;
        const dy = targetPos.current.y - prev.y;

        const speed = 0.06; // slow elegant
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMove = (e) => {
    const rect = wrap.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const text = `We begin with possibility—mapping the forces, patterns, and subtle movements that shape how meaning emerges, transforming raw potential into stories, experiences, and identities that move with clarity and intention.`;

  return (
    <div
      ref={wrap}
      onMouseMove={handleMove}
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        padding: "140px 7vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          fontSize: "74px",
          lineHeight: 1.28,
          fontWeight: 400,
          width: "100%",
          whiteSpace: "pre-wrap",
          color: "rgba(255,255,255,0.085)",
        }}
      >
        {text}

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
            transition: "color 0.2s linear",
          }}
        >
          {text}
        </div>
      </div>
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

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // ROTATION VALUES (for orbits)
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -540]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 900]);

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

    const unsub1 = rotate1.onChange(v =>
      setTransform(g1Ref.current, c1.cx, c1.cy, v)
    );
    const unsub2 = rotate2.onChange(v =>
      setTransform(g2Ref.current, c2.cx, c2.cy, v)
    );
    const unsub3 = rotate3.onChange(v =>
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
    "/clients/marrosh/mockup.png",              // 0
    "/clients/dwm/mockup.png",                 // 1
    "/clients/tender-touch/mockup.png",        // 2
    "/clients/hidden-city-ubud/mockup.png",    // 3
    "/clients/marrosh/mockup.png",             // 4 (extra)
    "/clients/dwm/mockup.png",                 // 5
    "/clients/tender-touch/mockup.png",        // 6
    "/clients/hidden-city-ubud/mockup.png",    // 7
    "/clients/marrosh/mockup.png",             // 8 (extra)
    "/clients/tender-touch/mockup.png",        // 6
    "/clients/hidden-city-ubud/mockup.png",    // 7
    "/clients/marrosh/mockup.png",             // 8 (extra)
    "/clients/hidden-city-ubud/mockup.png",    // 3
    "/clients/marrosh/mockup.png",             // 4 (extra)
    "/clients/dwm/mockup.png",                 // 5
    "/clients/tender-touch/mockup.png",        // 6
    "/clients/marrosh/mockup.png",              // 0
    "/clients/dwm/mockup.png",                 // 1
    "/clients/tender-touch/mockup.png",        // 2
    "/clients/hidden-city-ubud/mockup.png",    // 3
    "/clients/marrosh/mockup.png",             // 4 (extra)
    "/clients/dwm/mockup.png",                 // 5
    "/clients/marrosh/mockup.png",              // 0
    "/clients/dwm/mockup.png",                 // 1
    "/clients/tender-touch/mockup.png",        // 2
    "/clients/hidden-city-ubud/mockup.png",    // 3
    "/clients/marrosh/mockup.png",             // 4 (extra)
    "/clients/dwm/mockup.png",                 // 5
    
  ];

  // ============================
  // STAGGERED BURST TIMING (micro-stagger)
  // base start, step, window length
  // ============================
  const baseStart = 0.15;
  const step = 0.03;     // small delay between starts
  const windowLen = 0.17; // each burst end = start + windowLen

  // For each image, compute burst transform from scrollYProgress
  const bursts = images.map((_, i) => {
    const s = baseStart + i * step;
    const e = s + windowLen;
    return useTransform(scrollYProgress, [s, e], [0, 1]);
  });

  // ============================
  // SHARED MOVEMENT/DEPTH builders
  // ============================
  const createXRight = (b) => useTransform(b, [0, 1], [0, 1300]);
  const createXLeft = (b) => useTransform(b, [0, 1], [0, -1300]);
  const createYDown = (b) => useTransform(b, [0, 1], [0, 1000]);
  const createYUp = (b) => useTransform(b, [0, 1], [0, -1000]);

  const createZDepth = (b) => useTransform(b, [0, 1], [-2000, 0]);
  const createDepthScale = (b) => useTransform(b, [0, 1], [0.01, 2]);
  const createBurstScale = (b) => useTransform(b, [0, 1], [1, 3]);
  const createFinalScale = (b) => {
    const d = createDepthScale(b);
    const s = createBurstScale(b);
    return useTransform([d, s], ([a, c]) => a * c);
  };

  // ============================
  // Per-image motion props using loop & index%4 for position pattern
  // pattern: 0 -> bottom-right, 1 -> bottom-left, 2 -> top-right, 3 -> top-left
  // then repeats for subsequent images (looping)
  // ============================
  const motionPropsList = bursts.map((b, idx) => {
    const pattern = idx % 4;
    let xTransform, yTransform;

    if (pattern === 0) {
      xTransform = createXRight(b); // bottom-right
      yTransform = createYDown(b);
    } else if (pattern === 1) {
      xTransform = createXLeft(b); // bottom-left
      yTransform = createYDown(b);
    } else if (pattern === 2) {
      xTransform = createXRight(b); // top-right
      yTransform = createYUp(b);
    } else {
      xTransform = createXLeft(b); // top-left
      yTransform = createYUp(b);
    }

    return {
      burst: b,
      x: xTransform,
      y: yTransform,
      z: createZDepth(b),
      scale: createFinalScale(b),
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
        background: "#000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "99vw",
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
          <circle cx={c1.cx} cy={c1.cy} r={c1.r} stroke="white" strokeWidth="0.5" opacity="0.15" fill="none" />
          <circle cx={c2.cx} cy={c2.cy} r={c2.r} stroke="white" strokeWidth="0.5" opacity="0.15" fill="none" />
          <circle cx={c3.cx} cy={c3.cy} r={c3.r} stroke="white" strokeWidth="0.5" opacity="0.15" fill="none" />

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
<div
  style={{
    position: "absolute",
    color: "white",
    fontSize: "32px",
    textAlign: "center",
    fontWeight: 300,
    lineHeight: 1.3,
    zIndex: 10,
  }}
>
  Signals, motion, intent:
  <br />
  The Boson process takes shape
</div>

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

    // ⬅️ MULAI ANIMASI begitu section mulai masuk viewport
    offset: ["start 80%", "end start"],
  });

  // Scroll transforms — makin cepat respons
  const topX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const bottomX = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div
      ref={ref}
      style={{
        height: "150vh",
        position: "relative",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Sticky container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "150vh",
          width: "100vw",
          pointerEvents: "none",
        }}
      >

        {/* TOP 75vh */}
        <div
          style={{
            height: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              x: topX,
              transform: "translateY(10%)",
              color: "white",
              fontSize: "30vw",
              fontWeight: 300,
              lineHeight: 0.8,
              whiteSpace: "nowrap",
              opacity: 0.9,
              display: "flex",
              gap: "4vw",
            }}
          >
            <span>Work -</span>
            <span>Work -</span>
            <span>Work</span>
          </motion.div>
        </div>

        {/* BOTTOM 75vh */}
        <div
          style={{
            height: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              x: bottomX,
              transform: "translateY(-10%)",
              color: "#3a3a3a",
              fontSize: "30vw",
              fontWeight: 300,
              lineHeight: 0.8,
              whiteSpace: "nowrap",
              opacity: 0.45,
              display: "flex",
              gap: "4vw",
            }}
          >
            <span>Experiences -</span>
            <span>Experiences -</span>
            <span>Experiences</span>
          </motion.div>
        </div>

      </div>
    </div>
  );
}


function WorksList() {
  const items = [
    {
      industry: "Fitness",
      name: "Tender Touch",
      year: "© 2025",
      image1: "/clients/tender-touch/2.jpg",
      image2: "/clients/tender-touch/4.jpg",
    },
    {
      industry: "Real Estate",
      name: "Hidden City Ubud",
      year: "© 2025",
      image1: "/clients/hidden-city-ubud/main.jpg",
      image2: "/clients/hidden-city-ubud/mockup.png",
    },
    {
      industry: "Real Estate",
      name: "DWM",
      year: "© 2025",
      image1: "/clients/dwm/2.jpg",
      image2: "/clients/dwm/3.jpg",
    },
    {
      industry: "Food & Beverage",
      name: "Marrosh",
      year: "© 2025",
      image1: "/clients/marrosh/3.jpg",
      image2: "/clients/marrosh/mockup.png",
    },
    {
      industry: "Real Estate",
      name: "NOVO",
      year: "© 2025",
      image1: "/clients/novo-ampang/main.jpg",
      image2: "/clients/novo-ampang/main.jpg",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      style={{
        background: "#000",
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
          {/* =============================== */}
          {/*           WHITE OVERLAY          */}
          {/* =============================== */}
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

{/* =============================== */}
{/*       MARQUEE LOOP (HOVER)       */}
{/* =============================== */}
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

    background: hoveredIndex === i ? "white" : "transparent",
    opacity: hoveredIndex === i ? 1 : 0,

    display: "flex",
    alignItems: "center",
    padding: "0 3vw",
  }}
  animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
  {/* TRACK bergerak */}
  <motion.div
    style={{
      display: "flex",
      flexShrink: 0,
      gap: "4vw",
    }}
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    {/* ============================ */}
    {/*   ROW 1 — A B               */}
    {/* ============================ */}
    <div style={{ display: "flex", gap: "4vw" }}>
      <img
        src={item.image1}
        style={{
          height: "18vh",
          width: "32vh",
          borderRadius: "2vh",
          objectFit: "cover",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        }}
      />
      <img
        src={item.image2}
        style={{
          height: "18vh",
          width: "32vh",
          borderRadius: "2vh",
          objectFit: "cover",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        }}
      />
    </div>

    {/* ============================ */}
    {/*   ROW 2 — COPY EXACT         */}
    {/*   (kunci infinite perfeita)  */}
    {/* ============================ */}
    <div style={{ display: "flex", gap: "4vw" }}>
      <img
        src={item.image1}
        style={{
          height: "18vh",
          width: "32vh",
          borderRadius: "2vh",
          objectFit: "cover",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        }}
      />
      <img
        src={item.image2}
        style={{
          height: "18vh",
          width: "32vh",
          borderRadius: "2vh",
          objectFit: "cover",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  </motion.div>
</motion.div>


          {/* =============================== */}
          {/*             TEXT ROW             */}
          {/* =============================== */}
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
    <div className="footer-section">
      {/* LEFT — Rotated Chrome Logo */}
      <div className="footer-chrome" />

      {/* RIGHT — Boson Narrative */}
      <div className="footer-text">
        <div className="footer-title">
          Designing systems that  
          <br />
          align humans, tools,  
          <br />
          and the shape of tomorrow.
        </div>

        <div className="footer-contact">
          For collaboration:
          <br />
          <span>boson.studio@gmail.com</span>
        </div>

        <div className="footer-socials">
          <span>Behance</span>
          <span>Dribbble</span>
          <span>LinkedIn</span>
          <span>Medium</span>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          position: sticky;
          bottom: 0;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 80px;
          color: white;
        }

        /* LEFT CHROME (portrait rotated) */
        .footer-chrome {
          position: absolute;
          left: -10%;
          top: 50%;
          transform: translateY(-50%) rotate(90deg); /* Rotate to portrait */

          width: 1200px;
          height: 2000px; /* Tall enough for portrait chrome */

          mask-image: url("/boson-white.png");
          -webkit-mask-image: url("/boson-white.png");
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;

          opacity: 0.9;

          /* SAME gradients as Hero, untouched */
          background:
            linear-gradient(
              110deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.65) 4%,
              rgba(255, 255, 255, 0.25) 7%,
              rgba(255, 255, 255, 0) 11%
            ),
            linear-gradient(
              140deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.35) 3%,
              rgba(255, 255, 255, 0) 8%
            ),
            radial-gradient(
              circle at 50% 30%,
              rgba(255, 255, 255, 0.28),
              rgba(255, 255, 255, 0) 60%
            ),
            radial-gradient(
              circle at 50% 78%,
              rgba(0, 0, 0, 0.4),
              rgba(0, 0, 0, 0) 70%
            ),
            radial-gradient(
              circle at 50% 70%,
              rgba(0, 0, 0, 0) 25%,
              rgba(0, 0, 0, 0.35) 55%,
              rgba(0, 0, 0, 0.85) 85%,
              rgba(0, 0, 0, 1) 100%
            ),
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.5) 60%,
              rgba(0, 0, 0, 1) 100%
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.6),
              rgba(30, 30, 30, 0.85) 45%,
              rgba(0, 0, 0, 1) 95%
            );

          background-blend-mode: screen, screen, screen, multiply, multiply,
            multiply, multiply, overlay;
        }

        /* RIGHT SIDE TEXT */
        .footer-text {
          margin-left: auto;
          z-index: 10;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .footer-title {
          font-size: 26px;
          line-height: 1.3;
          font-weight: 300;
          opacity: 0.92;
        }

        .footer-contact {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.6;
        }
        .footer-contact span {
          opacity: 0.9;
        }

        .footer-socials {
          font-size: 13px;
          opacity: 0.55;
          display: flex;
          gap: 32px;
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
          }}
        >
          <Hero />
        </div>
  
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            background: "#000",
          }}
        >
          <BosonNarrative />
        </div>
        
        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
           <Projects/>
        </div>
       
        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
           <BigHeading/>
        </div>
        
        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
           <WorksList/>
        </div>
        
        
        <Footer/>
        
         
  
        <style jsx global>{`
          body {
            background: #000;
          }
        `}</style>
      </div>
    );
  }
