import { useEffect, useRef, useState } from "react";

function BosonNarrative() {
  const wrap = useRef(null);

  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const targetPos = useRef({ x: -9999, y: -9999 });

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
     SMOOTH MOUSE FOLLOW (DESKTOP ONLY)
  ========================= */
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
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  /* =========================
     MOUSE MOVE (DESKTOP ONLY)
  ========================= */
  const handleMove = (e) => {
    if (!wrap.current || isMobile) return;
    const rect = wrap.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const text = `In the beginning, there is only possibility, a space where uncertainty sharpens into clarity, and the first contours of meaning begin to form, tracing the subtle forces that shape everything that follows`;

  /* =========================
     BASE TEXT STYLE (DESKTOP)
  ========================= */
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

  /* =========================
     MOBILE OVERRIDE
  ========================= */
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
      className="boson-narrative-container bg-black w-full relative overflow-hidden flex"
      style={{
        minHeight: isMobile ? "auto" : "100vh",
        alignItems: isMobile ? "flex-start" : "center",
        padding: isMobile ? "72px 6vw" : "120px 6vw",
      }}
    >
      {/* =========================
          BASE TEXT (DIM)
      ========================= */}
      <div
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

        {/* =========================
            MASKED TEXT (DESKTOP ONLY)
        ========================= */}
        {!isMobile && (
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              color: "rgba(255,255,255,0.96)",
              ...baseTextStyle,
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
    </div>
  );
}

export default BosonNarrative;
