import { useLayoutEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

/* =========================
   SOURCE LOGOS
========================= */
const allLogos = [
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068279/the-linea-logo.png",
  "/clients/hey-yolo/logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068787/hidden-city-ubud-logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769069228/petra-logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto:best/v1768899596/tender-touch-logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto:best/v1769066430/hairaholic-logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto:best/v1768898518/marroosh-logo.png",
  "/clients/zai-cafe/logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067632/tea-time-logo.png",
  "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067253/newminatis-logo.png",
  "/clients/private-jet-villa/logo.png",
];

/* =========================
   SPLIT UNIQUE
========================= */
function splitUnique(arr, parts = 3) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  const chunkSize = Math.ceil(arr.length / parts);

  return Array.from({ length: parts }, (_, i) =>
    shuffled.slice(i * chunkSize, (i + 1) * chunkSize)
  );
}

/* =========================
   MARQUEE (FIXED ENGINE)
========================= */
function Marquee({ logos, direction = "left", speed = 40 }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const widthRef = useRef(0);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      widthRef.current = el.scrollWidth / 2;
    };

    setTimeout(measure, 100);

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const w = widthRef.current;
    if (!w) return;

    const dir = direction === "left" ? -1 : 1;
    const velocity = (isMobile ? speed * 0.6 : speed) * dir;

    let next = x.get() + (velocity * delta) / 1000;

    if (dir === -1) {
      if (next <= -w) next += w;
    } else {
      if (next >= 0) next -= w;
    }

    x.set(next);
  });

  const loop = useMemo(() => {
    return [...logos, ...logos];
  }, [logos]);

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        ref={trackRef}
        style={{
          display: "flex",
          x,
          whiteSpace: "nowrap",
        }}
      >
        {loop.map((src, i) => (
          <img
            key={i}
            src={src}
            draggable={false}
            style={{
              height: isMobile ? "34px" : "88px",
              width: "auto",
              marginRight: isMobile ? "24px" : "clamp(80px, 10vw, 140px)",
              objectFit: "contain",
              flexShrink: 0,
              opacity: 0.85,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* =========================
   MAIN SECTION
========================= */
export default function LogoSection() {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  const [row1, row2, row3] = useMemo(() => {
    return splitUnique(allLogos, 3);
  }, []);

  return (
    <section
      className="w-full bg-black text-white overflow-hidden"
      style={{
        paddingTop: isMobile ? "10vh" : "18vh",
        paddingBottom: 0, // 🔥 ONLY CHANGE
      }}
    >
      {/* HEADER */}
      <div className="flex justify-center mb-[8vh]">
        <div className="text-[11px] tracking-[0.25em] uppercase text-white/50">
          Brands We Work With
        </div>
      </div>

      {/* ROWS */}
      <div className="space-y-[3vh]">
        <Marquee logos={row1} direction="left" speed={40} />
        <Marquee logos={row2} direction="right" speed={55} />
        {!isMobile && (
          <Marquee logos={row3} direction="left" speed={32} />
        )}
      </div>

      {/* DESC */}
      <div className="flex justify-center mt-[10vh] px-[6vw]">
        <p className="text-center text-sm text-white/50 max-w-[480px] leading-relaxed">
          A selection of brands we’ve worked with across different industries,
          markets, and business scales.
        </p>
      </div>
    </section>
  );
}