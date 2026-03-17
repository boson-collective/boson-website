import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";

function BigHeading() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  // 🔥 manual smooth value
  const smoothProgress = useMotionValue(0);

  useEffect(() => {
    let raf;

    const lerp = (a, b, n) => a + (b - a) * n;

    const update = () => {
      const current = smoothProgress.get();
      const target = scrollYProgress.get();

      // angka ini kunci (semakin kecil = semakin smooth tapi delay)
      const next = lerp(current, target, 0.08);

      smoothProgress.set(next);

      raf = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress, smoothProgress]);

  // tetap pakai %
  const topX = useTransform(smoothProgress, [0, 1], ["0%", "-32%"]);
  const bottomX = useTransform(smoothProgress, [0, 1], ["-92%", "-5%"]);

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