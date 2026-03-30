import { useLayoutEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

/* =========================
   LOGOS
========================= */
const logos = [
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
   MARQUEE ROW
========================= */
function MarqueeRow({ reverse = false }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const segmentWidthRef = useRef(0);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  /* ===== MEASURE ===== */
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const total = el.scrollWidth;
      if (!total) return;
      segmentWidthRef.current = total / 2;
    };

    setTimeout(measure, 120);

    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.complete) img.onload = measure;
    });

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ===== ANIMATION (SLOWED DOWN) ===== */
  useAnimationFrame((_, delta) => {
    const segmentWidth = segmentWidthRef.current;
    if (!segmentWidth) return;

    // 🔥 SLOWER SPEED
    const speed = isMobile ? 12 : 28;

    let next = reverse
      ? x.get() + (speed * delta) / 1000
      : x.get() - (speed * delta) / 1000;

    if (reverse) {
      if (next >= 0) next = -segmentWidth;
    } else {
      if (next <= -segmentWidth) next = 0;
    }

    x.set(next);
  });

  /* ===== DATA ===== */
  const segment = useMemo(() => {
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return [...shuffled, ...shuffled];
  }, []);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        ref={trackRef}
        style={{
          display: "flex",
          x,
        }}
      >
        {[0, 1].map((seg) => (
          <div
            key={seg}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(60px, 8vw, 140px)",
              paddingRight: "clamp(60px, 8vw, 140px)",
            }}
          >
            {segment.map((src, i) => (
              <img
                key={`${seg}-${i}`}
                src={src}
                draggable={false}
                style={{
                  // 🔥 BIGGER LOGOS
                  height: isMobile ? "36px" : "72px",
                  width: "clamp(120px, 10vw, 180px)",
                  objectFit: "contain",
                  opacity: 0.95,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* =========================
   MAIN SECTION
========================= */
export default function LogoMarqueeSection() {
  return (
    <section
      data-theme="dark"
      className="w-full bg-black overflow-hidden"
      style={{
        padding: "8vh 0",
      }}
    >
      <div style={{ marginBottom: "4vh" }}>
        <MarqueeRow reverse={false} />
      </div>

      <MarqueeRow reverse={true} />
    </section>
  );
}