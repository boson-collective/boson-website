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

  useAnimationFrame((_, delta) => {
    const segmentWidth = segmentWidthRef.current;
    if (!segmentWidth) return;

    const speed = isMobile ? 10 : 28;

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

  const segment = useMemo(() => {
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return [...shuffled, ...shuffled];
  }, []);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <motion.div ref={trackRef} style={{ display: "flex", x }}>
        {[0, 1].map((seg) => (
          <div
            key={seg}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "48px" : "clamp(80px, 10vw, 180px)",
              paddingRight: isMobile ? "48px" : "clamp(80px, 10vw, 180px)",
            }}
          >
            {segment.map((src, i) => (
              <img
                key={`${seg}-${i}`}
                src={src}
                draggable={false}
                style={{
                  height: isMobile ? "40px" : "96px",
                  width: isMobile ? "auto" : "clamp(140px, 12vw, 220px)",
                  objectFit: "contain",
                  opacity: 0.9,
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
  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <section
      data-theme="dark"
      className="w-full bg-black text-white overflow-hidden"
      style={{ padding: isMobile ? "12vh 0" : "18vh 0" }}
    >
      {/* HEADER */}
      <div className="flex justify-center mb-[8vh]">
        <div className="font-[Code_Pro] text-[11px] tracking-[0.25em] uppercase text-white/50">
          Brands We Work With
        </div>
      </div>

      {/* MARQUEE */}
      <div>
        <div style={{ marginBottom: isMobile ? "0" : "4vh" }}>
          <MarqueeRow reverse={false} />
        </div>

        {/* ❌ HIDE SECOND ROW ON MOBILE */}
        {!isMobile && <MarqueeRow reverse={true} />}
      </div>
    </section>
  );
}