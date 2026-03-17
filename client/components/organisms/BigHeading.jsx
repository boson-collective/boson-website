import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

function BigHeading() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  // tetap pakai % (jangan diubah)
  const topXRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-32%"]);
  const bottomXRaw = useTransform(scrollYProgress, [0, 1], ["-92%", "-5%"]);

  // 🔥 smoothing (ini kunci mobile)
  const topX = useSpring(topXRaw, {
    stiffness: 80,
    damping: 25,
    mass: 0.6,
  });

  const bottomX = useSpring(bottomXRaw, {
    stiffness: 80,
    damping: 25,
    mass: 0.6,
  });

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F3F4F5] overflow-hidden"
      style={{ height: "max-content" }}
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
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          WORK - WORK - WORK
        </motion.div>

        <div className="w-full h-px bg-black/20" />

        {/* BOTTOM */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: bottomX,
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          EXPERIENCES - EXPERIENCES - EXPERIENCES
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          section {
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

export default BigHeading;