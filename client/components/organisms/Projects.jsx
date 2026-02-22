import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ==================================================
   IMAGE BURST (UPDATED FOR HORIZONTAL LOGOS)
================================================== */
function ImageBurst({ src, motionProps, styleOverrides = {} }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",

        // RESPONSIVE HORIZONTAL CONTAINER
        width: "clamp(300px, 42vw, 620px)",
        height: "clamp(120px, 18vw, 220px)",

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
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
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
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771768818/sunny-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068787/hidden-city-ubud-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771768640/yolo-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771768740/solace-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771768694/novo-ampang-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068279/the-linea-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768898518/marroosh-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769066430/hairaholic-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067253/newminatis-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769069228/petra-logo.png",
    "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768899596/tender-touch-logo.png",
  ];

  /* ==================================================
     DYNAMIC TIMELINE
  ================================================== */

  const baseStart = 0.14;
  const windowLen = 0.16;
  const availableSpace = 1 - baseStart - windowLen;
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
        [0, dir % 2 === 0 ? 220 : -220, dir % 2 === 0 ? 260 : -260]
      ),
      y: useTransform(
        b,
        [0, 0.85, 1],
        [0, dir < 2 ? -180 : 180, dir < 2 ? -220 : 220]
      ),
      z: useTransform(b, [0, 1], [-2000, 3000]),

      // INCREASED SCALE FOR VISUAL WEIGHT
      scale: useTransform(b, [0, 1], [0.6, 1.35]),

      opacity: useTransform(b, [0, 0.05, 1], [0, 1, 1]),
    };
  });

  /* ==================================================
     LIGHT MODE
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