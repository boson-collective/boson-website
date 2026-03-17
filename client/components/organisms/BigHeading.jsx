import { useRef, useEffect } from "react";
import { useScroll } from "framer-motion";

function BigHeading() {
  const ref = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });

  useEffect(() => {
    let raf;

    let current = 0;

    const lerp = (a, b, n) => a + (b - a) * n;

    const update = () => {
      const target = scrollYProgress.get();

      // smooth progress
      current = lerp(current, target, 0.08);

      // convert ke %
      const top = current * -32;
      const bottom = -92 + current * (87); // -92 → -5

      if (topRef.current) {
        topRef.current.style.transform = `translate3d(${top}%,0,0)`;
      }

      if (bottomRef.current) {
        bottomRef.current.style.transform = `translate3d(${bottom}%,0,0)`;
      }

      raf = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F3F4F5] overflow-hidden"
      style={{ height: "max-content" }}
    >
      <div className="relative w-full pointer-events-none">
        {/* TOP */}
        <div
          ref={topRef}
          className="whitespace-nowrap text-black"
          style={{
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          WORK - WORK - WORK
        </div>

        <div className="w-full h-px bg-black/20" />

        {/* BOTTOM */}
        <div
          ref={bottomRef}
          className="whitespace-nowrap text-black"
          style={{
            fontSize: "clamp(14rem, 50vw, 56rem)",
            lineHeight: 0.9,
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          EXPERIENCES - EXPERIENCES - EXPERIENCES
        </div>
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