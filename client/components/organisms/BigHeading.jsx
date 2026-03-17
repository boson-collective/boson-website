import { useRef } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

function BigHeading() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const progress = isMobile
    ? scrollYProgress
    : useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
      });

  // pakai PIXEL bukan %
  const topX = useTransform(progress, [0, 1], [0, -300]);
  const bottomX = useTransform(progress, [0, 1], [-800, -50]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F3F4F5] overflow-hidden"
    >
      <div className="relative w-full pointer-events-none">

        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: topX,
            fontSize: "clamp(8rem, 30vw, 24rem)",
            lineHeight: 0.9,
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitFontSmoothing: "antialiased",
            textRendering: "optimizeSpeed",
          }}
        >
          WORK - WORK - WORK
        </motion.div>

        <div className="w-full h-px bg-black/20" />

        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: bottomX,
            fontSize: "clamp(8rem, 30vw, 24rem)",
            lineHeight: 0.9,
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitFontSmoothing: "antialiased",
            textRendering: "optimizeSpeed",
          }}
        >
          EXPERIENCES - EXPERIENCES
        </motion.div>

      </div>
    </section>
  );
}

export default BigHeading;