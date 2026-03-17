import { useRef } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

function BigHeading() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  // smoothing pakai spring (bukan lerp manual)
  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // mapping values
  const topX = useTransform(smooth, [0, 1], [0, -32]);
  const bottomX = useTransform(smooth, [0, 1], [-92, -5]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F3F4F5] overflow-hidden"
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