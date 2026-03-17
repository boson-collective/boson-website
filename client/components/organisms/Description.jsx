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
    ScrollTrigger.config({
      ignoreMobileResize: true,
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

        const baseTrigger = isMobile ? sectionRef.current : null;

        // =========================
        // TITLE
        // =========================
        if (isMobile) {
          gsap.from(titleRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: baseTrigger,
              start: getStart(),
              once: true,
            },
          });
        } else {
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
        }

        // =========================
        // DIVIDER
        // =========================
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: isMobile ? 0.6 : 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: isMobile ? baseTrigger : dividerRef.current,
              start: getStart(),
              once: true,
            },
          }
        );

        // =========================
        // STATS
        // =========================
        const stats = statsRef.current.querySelectorAll("[data-stat]");

        gsap.from(stats, {
          opacity: 0,
          y: isMobile ? 18 : 8,
          duration: isMobile ? 0.5 : 0.5,
          stagger: isMobile ? 0.08 : 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: isMobile ? baseTrigger : statsRef.current,
            start: getStart(),
            once: true,
          },
        });

        if (!isMobile) {
          gsap.to(stats, {
            y: move(-22),
            ease: "none",
            scrollTrigger: PARALLAX_ST,
          });
        }

        // =========================
        // BODY
        // =========================
        bodyRef.current.querySelectorAll("[data-animate]").forEach((p) => {
          if (isMobile) {
            gsap.from(p, {
              y: 20,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: baseTrigger,
                start: getStart(),
                once: true,
              },
            });
          } else {
            const split = SplitText.create(p, {
              type: "lines",
              linesClass: "line",
              mask: "lines",
            });

            splitsRef.current.push(split);

            gsap.from(split.lines, {
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
          }
        });

        // SAFETY REFRESH
        ScrollTrigger.refresh();
      }, sectionRef);
    };

    // 🔥 MOBILE: NO FONT BLOCK
    if (window.innerWidth < 768) {
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
      <div className="max-w-screen mx-auto px-5 sm:px-6 lg:px-20">

        <div className="mb-10 lg:mb-14">
          <h1
            ref={titleRef}
            className="font-[Code_Pro] font-bold tracking-tight leading-[1.05] sm:leading-[1.08]"
            style={{
              fontSize: "clamp(32px, 4.9vw, 134px)",
              maxWidth: "100%",
            }}
          >
            We're a digital agency that helps brands stay{" "}
            <span className="font-light">consistent</span> online. We keep
            everything on track so you can stay{" "}
            <span className="font-light">focused</span> on what matters
          </h1>

          <div
            ref={dividerRef}
            className="mt-6 lg:mt-10 h-[1.5px] w-full bg-neutral-300"
          />
        </div>

        <div className="flex flex-col gap-y-12 lg:flex-row lg:gap-x-20">

          <div
            ref={statsRef}
            className="w-full lg:flex-[0_0_42%] font-[Code_Pro]"
          >
            <div className="flex flex-wrap gap-x-8 gap-y-6 text-neutral-600">

              <div data-stat>
                <div className="text-[22px] font-medium text-neutral-900">100+</div>
                <div className="text-xs uppercase tracking-widest">
                  Projects delivered
                </div>
              </div>

              <div data-stat>
                <div className="text-[22px] font-medium text-neutral-900">3</div>
                <div className="text-xs uppercase tracking-widest">
                  Countries served
                </div>
              </div>

              <div data-stat>
                <div className="text-[22px] font-medium text-neutral-900">
                  2.5m+
                </div>
                <div className="text-xs uppercase tracking-widest">
                  Total audience reach
                </div>
              </div>

            </div>
          </div>

          <div
            ref={bodyRef}
            className="w-full lg:flex-[0_0_28rem] lg:ml-auto text-neutral-800 text-[17px] leading-[1.5] sm:leading-[1.6]"
          >
            <p data-animate>
              Boson is an agency based in Bali, working with brands across
              Qatar, Malaysia, and beyond. We build digital experiences that stay
              sharp and consistent across every touchpoint — combining design,
              development, and brand operations into one cohesive system.
              This means fewer revisions, clearer decisions, and content that keeps
              working even as your brand scales.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Description;