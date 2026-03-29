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

/* =========================
   IMAGE OPTIMIZER (INJECTED)
========================= */
const IMAGE_CONFIG = {
  quality: "auto",
  format: "auto",
  width: {
    mobile: 480,
    desktop: 900,
  },
};

const buildImageUrl = (url, { isMobile }) => {
  if (!url.includes("cloudinary")) return url;

  const width = isMobile
    ? IMAGE_CONFIG.width.mobile
    : IMAGE_CONFIG.width.desktop;

  const transform = [
    `f_${IMAGE_CONFIG.format}`,
    `q_${IMAGE_CONFIG.quality}`,
    `w_${width}`,
  ].join(",");

  return url.replace("/upload/", `/upload/${transform}/`);
};

export default function WorksList() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const ctxRef = useRef(null);
  const splitsRef = useRef([]);
  const resizeTimer = useRef(null);
  const lastWidth = useRef(0);

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

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    lastWidth.current = window.innerWidth;

    const build = () => {
      const isMobile = window.innerWidth <= 768;

      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];

      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {

        if (isMobile) return;

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
            once: true,
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
            once: true,
          },
        });

      }, sectionRef);
    };

    document.fonts.ready.then(build);

    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastWidth.current) return;

      lastWidth.current = w;

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
      className="bg-black "
      style={{ padding: "6vh 0" }}
    >
      <div
        ref={headerRef}
        className="grid grid-cols-12 items-start border-t border-white/20 gap-y-6 mb-5 lg:mb-32 px-[6vw] py-[4vh] text-white"
      >
        <div
          ref={leftRef}
          className="col-span-12 lg:col-span-3 font-[Code_Pro] font-light text-xs tracking-wide opacity-70"
        >
          Industry Experience{" "}
          <sup className="text-[0.6em] opacity-70">{totalIndex}</sup>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-5">
          <h2 className="font-[Code_Pro] font-normal text-[clamp(28px,2.8vw,34px)] leading-[1.15]">
            Built across industries,
            <br />
            designed to scale.
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col lg:items-end gap-4 text-sm opacity-70">
          <p
            ref={rightRef}
            className="max-w-full lg:max-w-[32ch] lg:text-right"
          >
            This selection represents work developed under different business
            contexts, where constraints, scale, and objectives vary from project
            to project.
          </p>
        </div>
      </div>

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

          <MarqueeOverlay item={item} active={hoveredIndex === i} buildImageUrl={buildImageUrl} isMobile={isMobile} />

          <div className="works-title-wrapper">
            <div className="works-title font-light">
              {item.name}
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .works-title-wrapper {
          z-index: 1;
          grid-column: 2 / span 1;
          display: flex;
          justify-content: center;
        }

        .works-title {
          text-align: center;
          font-size: clamp(32px, 4.5vw, 82px);
          line-height: 1.05;
          letter-spacing: -0.02em;
        }

        @media (max-width: 768px) {
          .works-header {
            grid-template-columns: 1fr !important;
            padding: 0 6vw 4vh !important;
            gap: 2vh;
          }

          .works-row {
            grid-template-columns: 1fr !important;
            padding: 4vh 6vw !important;
          }

          .works-title-wrapper {
            grid-column: auto !important;
            justify-content: flex-start !important;
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


