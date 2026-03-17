import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

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
   * MOBILE (SMOOTH / BERAT)
   * =========================
   */
  const mobileSmooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const mobileTopX = useTransform(mobileSmooth, [0, 1], [0, -32]);
  const mobileBottomX = useTransform(mobileSmooth, [0, 1], [-92, -5]);

  /**
   * =========================
   * DESKTOP (FAST / DIRECT)
   * =========================
   */
  const desktopTopX = useTransform(scrollYProgress, [0, 1], ["0%", "-32%"]);
  const desktopBottomX = useTransform(scrollYProgress, [0, 1], ["-92%", "-5%"]);

  /**
   * =========================
   * FINAL PICK
   * =========================
   */
  const topX = isMobile ? mobileTopX : desktopTopX;
  const bottomX = isMobile ? mobileBottomX : desktopBottomX;

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F3F4F5] overflow-hidden"
      style={{ height: isMobile ? "auto" : "max-content" }}
    >
      <div className="relative w-full pointer-events-none">

        {/* TOP */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: topX,
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
            willChange: "transform",
          }}
        >
          WORK - WORK - WORK
        </motion.div>

        {/* LINE */}
        <div className="w-full h-px bg-black/20" />

        {/* BOTTOM */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: bottomX,
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
            willChange: "transform",
          }}
        >
          EXPERIENCES - EXPERIENCES - EXPERIENCES
        </motion.div>

      </div>
    </section>
  );
}

export default BigHeading;