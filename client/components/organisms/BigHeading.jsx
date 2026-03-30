import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

function BigHeading() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  /**
   * =========================
   * DELAYED START (ENTRY MOMENT)
   * =========================
   */
  const delayed = useTransform(scrollYProgress, [0, 0.15, 1], [0, 0, 1]);

  /**
   * =========================
   * MOBILE SMOOTH
   * =========================
   */
  const mobileSmooth = useSpring(delayed, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const mobileTopX = useTransform(mobileSmooth, [0, 1], [0, -32]);
  const mobileBottomX = useTransform(mobileSmooth, [0, 1], [-92, -5]);

  /**
   * =========================
   * DESKTOP DIRECT
   * =========================
   */
  const desktopTopX = useTransform(delayed, [0, 1], ["0%", "-32%"]);
  const desktopBottomX = useTransform(delayed, [0, 1], ["-92%", "-5%"]);

  const topX = isMobile ? mobileTopX : desktopTopX;
  const bottomX = isMobile ? mobileBottomX : desktopBottomX;

  /**
   * =========================
   * 🔥 COLLAPSE MOMENT (KEY)
   * =========================
   */
  const collapse = useTransform(
    scrollYProgress,
    [0.75, 1],
    [1, 0.9]
  );

  const fade = useTransform(
    scrollYProgress,
    [0.75, 1],
    [1, 0]
  );

  /**
   * =========================
   * 🔥 HARD SWITCH TO BLACK
   * =========================
   */
  const bg = useTransform(
    scrollYProgress,
    [0.9, 1],
    ["#F3F4F5", "#000000"]
  );

  return (
    <motion.section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bg,
        height: isMobile ? "auto" : "max-content",
      }}
    >
      <motion.div
        className="relative w-full pointer-events-none"
        style={{
          scale: collapse,
          opacity: fade,
        }}
      >

        {/* TOP */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: topX,
            fontSize: "clamp(12rem, 40vw, 48rem)",
            lineHeight: 0.9,
            willChange: "transform",
          }}
        >
          WORK - WORK - WORK
        </motion.div>

        {/* LINE (NOW HAS ROLE) */}
        <motion.div
          className="w-full h-px bg-black/30 origin-left"
          style={{
            scaleX: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
          }}
        />

        {/* BOTTOM */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: bottomX,
            fontSize: "clamp(12rem, 40vw, 48rem)",
            lineHeight: 0.9,
            willChange: "transform",
          }}
        >
          EXPERIENCES - EXPERIENCES - EXPERIENCES
        </motion.div>

      </motion.div>
    </motion.section>
  );
}

export default BigHeading;