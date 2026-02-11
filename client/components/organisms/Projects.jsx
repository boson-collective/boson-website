import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

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

export default function Projects() {
  const scrollRef = useRef(null);

  /* ==================================================
     MOBILE DETECTION
  ================================================== */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ==================================================
     SECTION SCROLL
  ================================================== */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  /* ==================================================
     GLOBAL ROTATION
  ================================================== */
  const { scrollY } = useScroll();
  const spinBase = useTransform(scrollY, (v) => v * 0.5);

  const rotate1 = useTransform(spinBase, (v) => v);
  const rotate2 = useTransform(spinBase, (v) => -v * 0.65);
  const rotate3 = useTransform(spinBase, (v) => v * 0.9);

  /* ==================================================
     IMAGES
  ================================================== */
  const images = [
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770815480/hidden-city-ubud-5.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968402/little-soho-5.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770815566/little-brew-2.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770816466/sunny-family-3.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968403/little-soho-3.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067634/tea-time-2.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770816274/novo-ampang-3.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770816770/alraimi-2.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770817395/terra-auri-2.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969071/little-soho-9.jpg",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1770817596/terra-auri-3.png",
    
    
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968403/little-soho-4.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968403/little-soho-3.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968402/little-soho-5.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969070/little-soho-10.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968402/little-soho-7.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968401/little-soho-6.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768968401/little-soho-8.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969071/little-soho-9.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969070/little-soho-11.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969069/little-soho-12.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969068/little-soho-13.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969068/little-soho-14.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969947/little-soho-16.jpg",
    // "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768969947/little-soho-15.jpg",
  ];

  /* ==================================================
     DYNAMIC TIMELINE CALCULATION
  ================================================== */

  const baseStart = 0.14;

  const windowLen = 0.16;

  // total available scroll space before light mode
  const availableSpace = 1 - baseStart - windowLen;

  // dynamic step so images stretch properly
  const step = images.length > 0
    ? availableSpace / images.length
    : 0;

  /* ==================================================
     IMAGE BURST
  ================================================== */

  const bursts = images.map((_, i) =>
    useTransform(
      scrollYProgress,
      [
        baseStart + i * step,
        baseStart + i * step + windowLen,
      ],
      [0, 1]
    )
  );

  const motionPropsList = bursts.map((b, i) => {
    const dir = i % 4;

    return {
      x: useTransform(
        b,
        [0, 0.85, 1],
        [0, dir % 2 === 0 ? 200 : -200, dir % 2 === 0 ? 240 : -240]
      ),
      y: useTransform(
        b,
        [0, 0.85, 1],
        [0, dir < 2 ? -170 : 170, dir < 2 ? -200 : 200]
      ),
      z: useTransform(b, [0, 1], [-2000, 3000]),
      scale: useTransform(b, [0, 1], [0.4, 1.1]),
      opacity: useTransform(b, [0, 0.05, 1], [0, 1, 1]),
    };
  });

  /* ==================================================
     LIGHT MODE (ALWAYS SYNCHRONIZED)
  ================================================== */

  const lightProgress = useTransform(
    scrollYProgress,
    [1 - windowLen, 1],
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

  /* ==================================================
     ORBITS
  ================================================== */

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

  /* ==================================================
     INTRO TEXT
  ================================================== */

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

  /* ==================================================
     RENDER
  ================================================== */

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

        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            filter: textFilter,
            color: textColor,
            mixBlendMode: isMobile ? "normal" : "difference",
            position: "absolute",
            fontSize: "clamp(18px, 6vw, 43px)",
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

        {images.map((src, i) => (
          <ImageBurst
            key={i}
            src={src}
            motionProps={motionPropsList[i]}
          />
        ))}
      </div>
    </motion.div>
  );
}
