import { useEffect, useRef, useState } from "react";

function BosonNarrative() {
  const wrap = useRef(null);
  const textLayer = useRef(null);

  const pos = useRef({ x: -9999, y: -9999 });
  const targetPos = useRef({ x: -9999, y: -9999 });
  const rectRef = useRef(null);

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
     CACHE BOUNDS (NO THRASH)
  ========================= */
  useEffect(() => {
    if (!textLayer.current) return;

    const updateRect = () => {
      rectRef.current = textLayer.current.getBoundingClientRect();
    };

    updateRect();
    window.addEventListener("resize", updateRect);

    return () => window.removeEventListener("resize", updateRect);
  }, []);

  /* =========================
     SMOOTH FOLLOW (NO RE-RENDER)
  ========================= */
  useEffect(() => {
    if (isMobile) {
      pos.current = { x: -9999, y: -9999 };
      targetPos.current = { x: -9999, y: -9999 };
      return;
    }

    let frame;

    const animate = () => {
      const dx = targetPos.current.x - pos.current.x;
      const dy = targetPos.current.y - pos.current.y;

      pos.current.x += dx * 0.1;
      pos.current.y += dy * 0.1;

      if (textLayer.current) {
        textLayer.current.style.setProperty("--x", `${pos.current.x}px`);
        textLayer.current.style.setProperty("--y", `${pos.current.y}px`);
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  /* =========================
     MOUSE MOVE (NO LAYOUT HIT)
  ========================= */
  const handleMove = (e) => {
    if (!rectRef.current || isMobile) return;

    targetPos.current = {
      x: e.clientX - rectRef.current.left,
      y: e.clientY - rectRef.current.top,
    };
  };

  const text = `In the beginning, there is only possibility, a space where uncertainty sharpens into clarity, and the first contours of meaning begin to form, tracing the subtle forces that shape everything that follows`;

  const baseTextStyle = {
    width: "100%",
    whiteSpace: "pre-wrap",
    fontSize: "clamp(58px, 4.5vw, 134px)",
    lineHeight: 1.1,
    wordSpacing: -5,
    fontWeight: 400,
    textAlign: "justify",
    textAlignLast: "left",
    hyphens: "auto",
  };

  const mobileTextOverride = isMobile
    ? {
        fontSize: "clamp(34px, 4.5vw, 104px)",
        lineHeight: 1.25,
        wordSpacing: 0,
        textAlign: "left",
        hyphens: "none",
      }
    : {};

  return (
    <div
      ref={wrap}
      onMouseMove={handleMove}
      className="bg-black w-full relative overflow-hidden flex"
      style={{
        minHeight: isMobile ? "auto" : "100vh",
        alignItems: isMobile ? "flex-start" : "center",
        padding: isMobile ? "72px 6vw" : "120px 6vw",

        /* 🔥 isolate dari layout global */
        contain: "layout paint",
      }}
    >
      <div
        ref={textLayer}
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

        {!isMobile && (
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              color: "rgba(255,255,255,0.96)",
              ...baseTextStyle,

              /* 🔥 GPU hint */
              willChange: "mask-image",

              WebkitMaskImage: `
                radial-gradient(
                  900px circle at var(--x) var(--y),
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.10) 30%,
                  rgba(255,255,255,0.02) 55%,
                  rgba(255,255,255,0) 100%
                )
              `,
              maskImage: `
                radial-gradient(
                  900px circle at var(--x) var(--y),
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

export default BosonNarrative;