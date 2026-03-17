import { useEffect, useRef, useState } from "react";

/* =========================
   🔹 PLAIN (MOBILE SAFE)
========================= */
function BosonNarrativePlain({ text }) {
  return (
    <div
      className="bg-black w-full relative flex"
      style={{
        padding: "72px 6vw",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.96)",
          width: "100%",
          whiteSpace: "pre-wrap",
          fontSize: "clamp(34px, 4.5vw, 104px)",
          lineHeight: 1.25,
          wordSpacing: 0,
          fontWeight: 400,
          textAlign: "left",
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* =========================
   🔹 FULL EFFECT (DESKTOP)
========================= */
function BosonNarrativeFull({ text }) {
  const wrap = useRef(null);
  const textLayer = useRef(null);

  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const targetPos = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    let frame;

    const animate = () => {
      setPos((prev) => {
        const dx = targetPos.current.x - prev.x;
        const dy = targetPos.current.y - prev.y;

        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1,
        };
      });

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMove = (e) => {
    if (!textLayer.current) return;

    const rect = textLayer.current.getBoundingClientRect();

    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

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

  return (
    <div
      ref={wrap}
      onMouseMove={handleMove}
      className="bg-black w-full relative overflow-hidden flex"
      style={{
        minHeight: "100vh",
        alignItems: "center",
        padding: "120px 6vw",
      }}
    >
      <div
        ref={textLayer}
        style={{
          position: "relative",
          color: "rgba(255,255,255,0.285)",
          ...baseTextStyle,
        }}
      >
        {text}

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
      </div>
    </div>
  );
}

/* =========================
   🔹 MAIN SWITCHER
========================= */
function BosonNarrative() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(mq);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const text = `In the beginning, there is only possibility, a space where uncertainty sharpens into clarity, and the first contours of meaning begin to form, tracing the subtle forces that shape everything that follows`;

  return isMobile ? (
    <BosonNarrativePlain text={text} />
  ) : (
    <BosonNarrativeFull text={text} />
  );
}

export default BosonNarrative;