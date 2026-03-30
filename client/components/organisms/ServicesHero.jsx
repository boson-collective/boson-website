import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SplitText, ScrollTrigger, gsap } from "../../lib/gsap";

/* =========================
   IMAGE OPTIMIZER (UNCHANGED)
========================= */
const IMAGE_CONFIG = {
  quality: "auto",
  format: "auto",
  width: {
    mobile: 480,
    desktop: 800,
  },
};

const buildImageUrl = (url, { isMobile }) => {
  if (!url.includes("cloudinary")) return url;

  const width = isMobile
    ? IMAGE_CONFIG.width.mobile
    : IMAGE_CONFIG.width.desktop;

  const transform = [
    `f_${IMAGE_CONFIG.format}`,
    `q_${IMAGE_CONFIG.quality}`,
    `w_${width}`,
  ].join(",");

  return url.replace("/upload/", `/upload/${transform}/`);
};

function ServicesHero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const pauseRef = useRef(null);

  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const splitsRef = useRef([]);
  const ctxRef = useRef(null);
  const resizeTimer = useRef(null);
  const lastWidth = useRef(0);

  const [hoverIndex, setHoverIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  /* DEVICE DETECTION */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* GSAP */
  useLayoutEffect(() => {
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    lastWidth.current = window.innerWidth;

    const build = () => {
      if (!sectionRef.current || !contentRef.current) return;

      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];

      if (ctxRef.current) ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {

        /* =========================
           BACKGROUND TRANSITION
        ========================== */
        gsap.from(sectionRef.current, {
          backgroundColor: "#111",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 100%",
            end: "top 60%",
            scrub: true,
          },
        });

        /* =========================
           🔥 CONTENT CONTINUITY (KEY FIX)
        ========================== */
        gsap.from(contentRef.current, {
          scale: 0.96,
          opacity: 0.9,
          filter: "blur(2px)", // 🔥 reduced blur
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 60%",
            scrub: true,
          },
        });

        /* =========================
           LABEL + DESC (EARLY)
        ========================== */
        [labelRef.current, descRef.current].forEach((el) => {
          if (!el) return;

          if (window.innerWidth <= 768) {
            gsap.from(el, {
              y: 30,
              opacity: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              },
            });
            return;
          }

          const split = SplitText.create(el, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          });

          splitsRef.current.push(split);

          gsap.from(split.lines, {
            yPercent: 35,
            opacity: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          });
        });

        /* =========================
           🔥 TITLE (DELAYED MOMENT)
        ========================== */
        if (titleRef.current) {
          const split = SplitText.create(titleRef.current, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          });

          splitsRef.current.push(split);

          gsap.from(split.lines, {
            yPercent: 35,
            opacity: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              once: true,
            },
          });
        }

        /* =========================
           SERVICE TITLES
        ========================== */
        const titles = sectionRef.current.querySelectorAll("[data-animate]");

        titles.forEach((el) => {
          if (window.innerWidth <= 768) {
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            });
            return;
          }

          const split = SplitText.create(el, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          });

          splitsRef.current.push(split);

          gsap.from(split.lines, {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              once: true,
            },
          });
        });

        /* =========================
           DIVIDERS
        ========================== */
        const dividers = sectionRef.current.querySelectorAll("[data-divider]");

        dividers.forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 95%",
                once: true,
              },
            }
          );
        });

      }, sectionRef);
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

  const services = [
    {
      label: "Social Media Marketing",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1774779072/Screenshot_2026-01-27_at_10.28.02.png",
    },
    {
      label: "Content Production",
      image:
        "https://i.pinimg.com/736x/2e/14/bd/2e14bda3c06055b6345f718e2ea23620.jpg",
    },
    {
      label: "Brand Strategy",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769484710/Screenshot_2026-01-27_at_10.31.37.png",
    },
    {
      label: "Website Development",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1769484844/Screenshot_2026-01-27_at_10.33.52.png",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F3F4F5] text-neutral-900"
    >
      <div ref={contentRef}>

        {/* 🔥 PAUSE ZONE (REDUCED) */}
        <div ref={pauseRef} style={{ height: "8vh" }} />

        <div className="w-full px-6 sm:px-10 lg:px-20 pb-24">

          {/* TOP */}
          <div className="grid grid-cols-12 items-start mb-20 lg:mb-32 gap-y-6">

            <div
              ref={labelRef}
              className="col-span-12 font-[Code_Pro] lg:col-span-3 text-xs tracking-wide text-neutral-500"
            >
              Our Services
            </div>

            <div className="col-span-12 font-[Code_Pro] lg:col-span-5 lg:col-start-5">
              <h2
                ref={titleRef}
                className="text-start text-[clamp(26px,5vw,42px)] font-medium leading-[1.05]"
              >
                How we make your
                <br />
                brands grow and relevant
              </h2>
            </div>

            <div className="col-span-12 lg:col-span-3 flex flex-col lg:items-end gap-4 text-sm text-neutral-600">
              <p
                ref={descRef}
                className="max-w-full lg:max-w-[260px] lg:text-right"
              >
                We are a digital marketing agency with expertise, and we're on a
                mission to help you take the next step in your business.
              </p>
            </div>

          </div>

          {/* SERVICES */}
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-8 lg:col-start-5">

              {services.map((item, i) => {
                const isHovering = hoverIndex !== null;
                const isActive = hoverIndex === i;

                const words = item.label.split(" ");
                const lastWord = words.at(-1);
                const firstLine = words.slice(0, -1).join(" ");

                const colorState = !isHovering
                  ? "text-neutral-900"
                  : isActive
                  ? "text-neutral-900"
                  : "text-neutral-400";

                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => !isMobile && setHoverIndex(i)}
                    onMouseLeave={() => !isMobile && setHoverIndex(null)}
                    className="relative py-10 lg:py-14"
                  >

                    <div
                      data-divider
                      className="absolute top-0 left-0 w-full h-[1px] bg-black/20"
                    />

                    <div className="flex items-center gap-5 lg:gap-0">

                      {isMobile && (
                        <div className="w-[88px] h-[64px] flex-shrink-0 overflow-hidden rounded-md bg-neutral-200">
                          <img
                            src={buildImageUrl(item.image, { isMobile })}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {!isMobile && (
                        <div
                          className={`hidden xl:block overflow-hidden transition-all duration-300 ease-out
                            w-0 mr-0
                            ${isActive ? "w-[200px] mr-10" : ""}
                          `}
                        >
                          <img
                            src={buildImageUrl(item.image, { isMobile })}
                            alt=""
                            className={`h-[120px] w-full object-cover rounded-md transition-all duration-300
                              ${
                                isActive
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-95"
                              }
                            `}
                          />
                        </div>
                      )}

                      <h3
                        data-animate
                        className={`flex font-[Code_Pro] flex-col tracking-tight transition-colors duration-300 ease-out ${colorState}`}
                      >
                        <span className="text-[13px] lg:text-[26px] font-light opacity-60 mb-1">
                          {firstLine}
                        </span>
                        <span className="font-semibold leading-[1] text-[clamp(28px,7vw,96px)]">
                          {lastWord}
                        </span>
                      </h3>

                    </div>
                  </div>
                );
              })}

              <div data-divider className="w-full h-[1px] bg-black/20" />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ServicesHero;