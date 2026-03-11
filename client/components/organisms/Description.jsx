import { useLayoutEffect, useRef } from "react";
import { SplitText, ScrollTrigger, gsap } from "../../lib/gsap";

function Description() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const dividerRef = useRef(null);
  const statsRef = useRef(null);

  const splitsRef = useRef([]);
  const ctxRef = useRef(null);
  const resizeTimer = useRef(null);
  const lastWidth = useRef(0);

  useLayoutEffect(() => {
    lastWidth.current = window.innerWidth;

    const getProfile = () => {
      const w = window.innerWidth;
      if (w < 640) {
        return { factor: 0.12, clamp: 12, scrub: 0.1 };
      }
      if (w < 1024) {
        return { factor: 0.4, clamp: 28, scrub: 0.4 };
      }
      return { factor: 1, clamp: null, scrub: 0.6 };
    };

    const build = () => {
      if (
        !sectionRef.current ||
        !titleRef.current ||
        !bodyRef.current ||
        !dividerRef.current ||
        !statsRef.current
      )
        return;

      const isMobile = window.innerWidth < 768;
      const PROFILE = getProfile();

      const move = (v) => {
        const raw = v * PROFILE.factor;
        return PROFILE.clamp
          ? gsap.utils.clamp(-PROFILE.clamp, PROFILE.clamp, raw)
          : raw;
      };

      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];

      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {
        const PARALLAX_ST = {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "bottom 45%",
          scrub: PROFILE.scrub,
        };

        // TITLE
        let titleLines = [titleRef.current];

        if (!isMobile) {
          const titleSplit = SplitText.create(titleRef.current, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          });

          splitsRef.current.push(titleSplit);
          titleLines = titleSplit.lines;
        }

        gsap.from(titleLines, {
          yPercent: 35,
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        gsap.to(titleRef.current, {
          y: move(-20),
          ease: "none",
          scrollTrigger: PARALLAX_ST,
        });

        // DIVIDER
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        gsap.to(dividerRef.current, {
          y: move(-30),
          ease: "none",
          scrollTrigger: PARALLAX_ST,
        });

        // BODY
        bodyRef.current.querySelectorAll("[data-animate]").forEach((p) => {
          let lines = [p];

          if (!isMobile) {
            const split = SplitText.create(p, {
              type: "lines",
              linesClass: "line",
              mask: "lines",
            });

            splitsRef.current.push(split);
            lines = split.lines;
          }

          gsap.from(lines, {
            yPercent: 26,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power1.out",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              once: true,
            },
          });

          gsap.to(p, {
            y: move(-40),
            ease: "none",
            scrollTrigger: PARALLAX_ST,
          });
        });

        // STATS
        const stats = statsRef.current.querySelectorAll("[data-stat]");

        gsap.from(stats, {
          opacity: 0,
          y: 8,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.to(stats, {
          y: move(-22),
          ease: "none",
          scrollTrigger: PARALLAX_ST,
        });
      }, sectionRef);

      ScrollTrigger.refresh();
    };

    document.fonts.ready.then(build);

    const onResize = () => {
      const w = window.innerWidth;

      if (w === lastWidth.current) return;

      lastWidth.current = w;

      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(build, 200);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      splitsRef.current.forEach((s) => s.revert());
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="w-full bg-[#F3F4F5] text-neutral-900 py-12 lg:py-14 overflow-hidden"
    >
      {/* markup sama seperti punyamu, tidak diubah */}
    </section>
  );
}

export default Description;