import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function BigHeading() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  // WORK → geser ke kiri
  const topX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-32%"]
  );

  // EXPERIENCE → start dari kanan
  const bottomX = useTransform(
    scrollYProgress,
    [0, 1],
    ["-92%", "-5%"]
  );

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F3F4F5] overflow-hidden"
      style={{ height: "max-content" }}
    >
      <div className="relative w-full pointer-events-none">
        {/* TOP TEXT */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: topX,
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
          }}
        >
          WORK - WORK - WORK
        </motion.div>

        {/* CENTER LINE */}
        <div className="w-full h-px bg-black/20" />

        {/* BOTTOM TEXT */}
        <motion.div
          className="whitespace-nowrap text-black"
          style={{
            x: bottomX,
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
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
