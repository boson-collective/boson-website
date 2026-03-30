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
    const isMobile = () => window.innerWidth < 768;

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    lastWidth.current = window.innerWidth;

    const getProfile = () => {
      const w = window.innerWidth;
      if (w < 640) return { factor: 0.08, clamp: 10, scrub: 0.08 };
      if (w < 1024) return { factor: 0.4, clamp: 28, scrub: 0.4 };
      return { factor: 1, clamp: null, scrub: 0.6 };
    };

    const getStart = () => {
      return window.innerWidth < 768 ? "top 92%" : "top 85%";
    };

    const safeRefresh = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };

    const clean = () => {
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      if (ctxRef.current) ctxRef.current.revert();
      ctxRef.current = null;
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

      if (isMobile()) {
        clean();
        return;
      }

      const PROFILE = getProfile();

      const move = (v) => {
        const raw = v * PROFILE.factor;
        return PROFILE.clamp
          ? gsap.utils.clamp(-PROFILE.clamp, PROFILE.clamp, raw)
          : raw;
      };

      clean();

      ctxRef.current = gsap.context(() => {
        const PARALLAX_ST = {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "bottom 45%",
          scrub: PROFILE.scrub,
        };

        // ===== TITLE =====
        const titleSplit = SplitText.create(titleRef.current, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });

        splitsRef.current.push(titleSplit);

        gsap.from(titleSplit.lines, {
          yPercent: 35,
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.to(titleRef.current, {
          y: move(-20),
          ease: "none",
          scrollTrigger: PARALLAX_ST,
        });

        // ===== DIVIDER =====
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: getStart(),
              once: true,
            },
          }
        );

        // 🔥 FIX: DIVIDER IKUT PARALLAX
        gsap.to(dividerRef.current, {
          y: move(-20),
          ease: "none",
          scrollTrigger: PARALLAX_ST,
        });

        // ===== BODY =====
        bodyRef.current.querySelectorAll("[data-animate]").forEach((p) => {
          const split = SplitText.create(p, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          });

          splitsRef.current.push(split);

          gsap.from(split.lines, {
            yPercent: 24,
            opacity: 0,
            duration: 0.9,
            stagger: 0.04,
            ease: "power1.out",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              once: true,
            },
          });

          gsap.to(p, {
            y: move(-30),
            ease: "none",
            scrollTrigger: PARALLAX_ST,
          });
        });

        // ===== STATS =====
        const stats = statsRef.current.querySelectorAll("[data-stat]");

        gsap.from(stats, {
          opacity: 0,
          y: 12,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: getStart(),
            once: true,
          },
        });

        gsap.to(stats, {
          y: move(-18),
          ease: "none",
          scrollTrigger: PARALLAX_ST,
        });

        /* ================= 🔥 COLLAPSE END ================= */
        gsap.to(sectionRef.current, {
          scale: 0.96,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 40%",
            end: "bottom top",
            scrub: true,
          },
        });
      }, sectionRef);

      safeRefresh();
    };

    if (isMobile()) {
      build();
    } else {
      document.fonts.ready.then(build);
    }

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
      clean();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="w-full bg-[#F3F4F5] text-neutral-900 py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 xl:px-16">

        {/* TITLE */}
        <div>
          <h1
            ref={titleRef}
            className="font-[Code_Pro] font-bold tracking-tight leading-[1.05] max-w-[22ch] sm:max-w-none"
            style={{
              fontSize: "clamp(32px, 4.6vw, 120px)",
            }}
          >
            We're a digital agency that helps brands stay{" "}
            <span className="font-light">consistent</span> online. We keep
            everything on track so you can stay{" "}
            <span className="font-light">focused</span> on what matters
          </h1>

          <div
            ref={dividerRef}
            className="mt-8 lg:mt-10 h-[1.5px] w-full bg-neutral-300"
          />
        </div>

        {/* CONTENT */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16">

          {/* STATS */}
          <div
            ref={statsRef}
            className="lg:col-span-6 font-[Code_Pro]"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-2">

              <div data-stat>
                <div className="text-[30px] lg:text-[42px] font-semibold leading-none">
                  100+
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  Projects delivered
                </div>
              </div>

              <div data-stat>
                <div className="text-[30px] lg:text-[42px] font-semibold leading-none">
                  3
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  Countries served
                </div>
              </div>

              <div data-stat className="col-span-2 sm:col-span-3 lg:col-span-2">
                <div className="text-[30px] lg:text-[42px] font-semibold leading-none">
                  2.5m+
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  Total audience reach
                </div>
              </div>

            </div>
          </div>

          {/* BODY */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div
              ref={bodyRef}
              className="text-neutral-800 text-[16px] sm:text-[17px] leading-[1.7] max-w-[36ch] sm:max-w-[520px]"
            >
              <p data-animate>
                Boson is an agency based in Bali, working with brands across
                Qatar, Malaysia, and beyond. We build digital experiences that stay
                sharp and consistent across every touchpoint — combining design,
                development, and brand operations into one cohesive system.
              </p>

              <p data-animate className="mt-6">
                This means fewer revisions, clearer decisions, and content that keeps
                working even as your brand scales. Every layer is designed to reduce
                friction and maintain clarity as complexity grows.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Description;