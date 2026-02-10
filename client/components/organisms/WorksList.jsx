import { useLayoutEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { SplitText, ScrollTrigger } from "../../lib/gsap";
import { motion, useMotionValue, useAnimationFrame} from "framer-motion";

function MarqueeOverlay({ item, active }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const segmentWidthRef = useRef(0);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

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

    const speed = isMobile
      ? active
        ? 60
        : 20
      : active
      ? 180
      : 30;

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
    return s.endsWith(".png") || s.includes("logo");
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
            height: isMobile ? "7vh" : "13vh",
            width: "auto",
            objectFit: "contain",
            filter: "invert(1) brightness(0)",
            opacity: 0.85,
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
          height: isMobile ? "8vh" : "13vh",
          width: isMobile ? "18vh" : "32vh",
          borderRadius:  "6vh",
          objectFit: "cover",
          flexShrink: 0,
          background: "black",
          boxShadow: isMobile
            ? "0 4px 10px rgba(0,0,0,0.12)"
            : "0 6px 16px rgba(0,0,0,0.15)",
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
    for (let i = 0; i < 2; i++) out.push(...baseImages);
    return out;
  }, [baseImages]);

  const renderSegment = (key) => (
    <div
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "6vw" : "4vw",
        paddingRight: isMobile ? "6vw" : "4vw",
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
        height: isMobile ? "14vh" : "22vh",
        transform: "translateY(-50%)",
        overflow: "hidden",
        zIndex: 2,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "0 5vw" : "0 3vw",
        background: active && !isMobile ? "white" : "transparent",
      }}
      animate={{
        opacity: active ? 1 : 0,
      }}
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

export default function WorksList() {
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
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068279/the-linea-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068306/the-linea-2.jpg",
        "/clients/hey-yolo/logo.png",
        "/clients/hey-yolo/main.jpg",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769068787/hidden-city-ubud-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1768915333/hidden-city-ubud-2.jpg",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769069228/petra-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769069229/petra-2.jpg",
      ],
    },
    {
      industry: "Production",
      name: "Hospitality",
      year: "2025",
      images: [
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto:best/v1768899596/tender-touch-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768899597/tender-touch-9.jpg",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto:best/v1769066430/hairaholic-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1769066538/hairaholic-2.jpg",
      ],
    },
    {
      industry: "Commerce",
      name: "Food & Beverage",
      year: "2025",
      images: [
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto:best/v1768898518/marroosh-logo.png",
        "https://i.imgur.com/GnY6iYR.jpeg",
        "/clients/zai-cafe/logo.png",
        "https://i.imgur.com/F4vcyc5.jpeg",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067632/tea-time-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067634/tea-time-2.jpg",
      ],
    },
    {
      industry: "Branding",
      name: "Fashion & Beauty",
      year: "2025",
      images: [
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067253/newminatis-logo.png",
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769067396/newminatis-2.jpg",
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
  const totalIndex = String(items.length).padStart(2, "0");

  /* ================= HEADER ANIMATION ================= */
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
          duration: 1.1,
          stagger: 0.1,
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
          duration: 0.9,
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
      className="bg-black"
      style={{ padding: "6vh 0" }}
    >
      {/* ================= HEADER ================= */}
      <div
        ref={headerRef}
        className="works-header"
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.3fr",
          padding: "5vw 7vh",
          color: "white",
          gap: "2vh",
        }}
      >
        <h2
          ref={leftRef}
          className="font-[Code_Pro] font-light"
          style={{
            margin: 0,
            fontSize: "clamp(28px, 2.8vw, 34px)",
            lineHeight: 1.15,
            display: "inline-flex",
            gap: "0.35em",
          }}
        >
          <span>Industry Experience</span>
          <sup
            style={{
              fontSize: "0.45em",
              opacity: 0.7,
              fontFeatureSettings: "'lnum' 1, 'tnum' 1",
            }}
          >
            {totalIndex}
          </sup>
        </h2>

        <p
          ref={rightRef}
          style={{
            opacity: 0.7,
            fontSize: "clamp(13px, 1vw, 16px)",
            lineHeight: 1.6,
            maxWidth: "32ch",
          }}
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
            padding: "3.8vh 7vh",
            borderBottom: "1px solid rgba(255,255,255,0.25)",
            color: "white",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {/* Hover background (desktop only) */}
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

          <div style={{ zIndex: 1, gridColumn: "2 / span 1" }}>
            <div
              className="works-title font-light"
              style={{
                textAlign: "center",
                fontSize: "clamp(32px, 4.5vw, 82px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {item.name}
            </div>
          </div>
        </div>
      ))}

      {/* ================= MOBILE ================= */}
      <style jsx>{`
        @media (max-width: 768px) {
          .works-header {
            grid-template-columns: 1fr !important;
            padding: 0 6vw 4vh !important;
            gap: 2vh;
          }

          .works-header h2 {
            font-size: 30px !important;
          }

          .works-header p {
            font-size: 14px !important;
            max-width: 100% !important;
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

