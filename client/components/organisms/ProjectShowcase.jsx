import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

function ProjectShowcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const ctxRef = useRef(null);
  const cursorRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024
  );

  const [isHoveringTarget, setIsHoveringTarget] = useState(false);
 

  const projects = [
    {
      title: "Sunny\nDevelopment",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775825912/sunny-family-main_mxddal.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A property development group delivering residential and hospitality projects with a focus on design, lifestyle, and long-term value",
      igLink: "https://www.instagram.com/sunnyfamilybali",
    },
    {
      title: "Novo\nAmpang",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775817526/novo-ampang-main_pbi8jb.mp4",
      meta: ["REAL ESTATE", "KUALA LUMPUR", "SOCIAL MEDIA MARKETING"],
      desc:
        "A premium residential development in Kuala Lumpur designed for urban living and investment-driven buyers",
      igLink: "https://www.instagram.com/novo_ampang_kl",
    },
    {
      title: "Hidden \nCity Ubud",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775809847/hidden-city-ubud-main_cwmmiw.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A development firm creating distinctive residential and hospitality projects driven by design, lifestyle, and long-term value",
      igLink: "https://www.instagram.com/hidden_city_ubud",
    },
    {
      title: "Little\nSoho",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775816939/little-soho-main_lbj5qf.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A property development firm creating distinctive residential and hospitality destinations, driven by design excellence, elevated living experiences, and enduring investment value",
      igLink: "https://www.instagram.com/hidden_city_ubud",
    },
    {
      title: "Marroosh\nBali",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775816339/marroosh-main_ea34gz.mp4",
      meta: ["FOOD & BEVERAGE", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc:
        "A Lebanese restaurant in Canggu offering authentic Middle Eastern cuisine in a warm, casual dining setting.",
      igLink: "https://www.instagram.com/marrooshbali",
    },
    {
      title: "Shinobi\nSoirée",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775825741/shinobi-main_rbaib5.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc:
        "A club in Bali functioning as a music-oriented social venue, defined by its spatial layout, sound, and collective presence",
      igLink: "https://www.instagram.com/shinobi_soiree",
    },
    {
      title: "Tender\nTouch",
      image:
        "https://res.cloudinary.com/djgu1bhef/video/upload/v1775823810/tender-touch-main_t6pvnn.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A wellness and massage brand in Bali offering premium treatments focused on recovery, relaxation, and holistic care",
      igLink: "https://www.instagram.com/tendertouch.bali",
    },
  ];

  const randomizedProjects = useMemo(() => {
    const shuffled = [...projects];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 5);
  }, []);

  const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const videos = document.querySelectorAll("video");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videos.forEach((v) => observer.observe(v));

    return () => {
      videos.forEach((v) => observer.unobserve(v));
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || !cursorRef.current) return;

    const cursor = cursorRef.current;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const move = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12,
        ease: "power3.out",
      });
    };

    const show = () => {
      setIsHoveringTarget(true);
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
      });
      document.body.style.cursor = "none";
    };

    const hide = () => {
      setIsHoveringTarget(false);
      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
      });
      document.body.style.cursor = "default";
    };

    const click = () => {
      if (!isHoveringTarget) return;
      const link = randomizedProjects[activeIndex]?.igLink;
      if (link) window.open(link, "_blank", "noopener,noreferrer");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);

    const targets = document.querySelectorAll(".cursor-target");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", show);
      el.addEventListener("mouseleave", hide);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", show);
        el.removeEventListener("mouseleave", hide);
      });
      document.body.style.cursor = "default";
    };
  }, [isDesktop, activeIndex, isHoveringTarget, randomizedProjects]);

  useLayoutEffect(() => {
    ctxRef.current?.revert();

    if (!isDesktop) {
      gsap.set(
        [trackRef.current, ".parallax-image", ".parallax-meta"],
        { clearProps: "all" }
      );
      return;
    }

    ctxRef.current = gsap.context(() => {
      const slidesCount = randomizedProjects.length;
      const track = trackRef.current;
      const progressBar = progressRef.current;

      /* 🔥 FIX 1: ROUND DISTANCE */
      const getScrollDistance = () =>
        Math.round((slidesCount - 1) * window.innerWidth);

      const mainTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1, // 🔥 FIX 2
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true, // 🔥 FIX 3
          onUpdate(self) {
            gsap.set(progressBar, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });

            /* 🔥 FIX 4: STABLE INDEX */
            const index = Math.min(
              slidesCount - 1,
              Math.floor(self.progress * slidesCount)
            );

            setActiveIndex(index);
          },
        },
      });

      const parallax = (selector, fromX, toX) => {
        gsap.utils.toArray(selector).forEach((el) => {
          gsap.fromTo(
            el,
            { x: fromX },
            {
              x: toX,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: mainTween,
                start: "left right",
                end: "right left",
                scrub: 0.6,
              },
            }
          );
        });
      };

      parallax(".parallax-image", 90, -90);
      parallax(".parallax-meta", 140, -140);
    }, sectionRef);

    return () => ctxRef.current?.revert();
  }, [isDesktop, randomizedProjects.length]);

  return (
    <section ref={sectionRef} className="relative w-full bg-black text-white overflow-hidden lg:h-screen">

      {isDesktop && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 z-[9999] pointer-events-none
                     w-[140px] h-[140px] rounded-full bg-white text-black
                     flex items-center justify-center text-xs tracking-wide
                     opacity-0 scale-0"
        >
          <span className="text-center leading-tight">
            VIEW<br />ON INSTAGRAM →
          </span>
        </div>
      )}

      <div className="relative lg:absolute lg:inset-0">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row"
          style={{
            width: isDesktop ? `${randomizedProjects.length * 100}vw` : "100%",
          }}
        >
          {randomizedProjects.map((p, i) => (
            <div key={i} className="relative w-full lg:w-screen min-h-screen flex-shrink-0">

              {/* MOBILE */}
              <div className="block lg:hidden px-5 pt-16 pb-12">
                <div className="w-full max-w-[420px] mx-auto flex flex-col items-start gap-6">

                  <span className="text-xs tracking-widest text-white/50 font-[Code_Pro]">
                    PROJECT 0{i + 1}
                  </span>

                  <h2 className="text-[42px] leading-[0.95] whitespace-pre-line">
                    {p.title}
                  </h2>

                  <div
                    className="cursor-target parallax-image relative w-full aspect-[3/4]"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                  >
                    {isVideo(p.image) ? (
                      <video
                        src={p.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ willChange: "transform", transform: "translateZ(0)" }}
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img src={p.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    )}
                  </div>

                  <div className="parallax-meta flex flex-col gap-4">
                    <div className="space-y-2 text-xs">
                      {p.meta.map((m) => (
                        <p key={m} className="underline font-[Code_Pro]">{m}</p>
                      ))}
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed max-w-[34ch]">
                      {p.desc}
                    </p>
                  </div>

                </div>
              </div>

              {/* DESKTOP */}
              <div className="hidden lg:grid relative mx-auto h-full px-[clamp(3rem,6vw,10rem)] pt-24 pb-32 grid-cols-12 gap-0">

                <span className="col-span-12 font-[Code_Pro] text-xs tracking-widest text-white/50">
                  PROJECT 0{i + 1}
                </span>

                <h1 className="font-[Code_Pro] absolute left-[35%] top-[25%] -translate-x-1/2 text-[clamp(3.5rem,6vw,6rem)] leading-[0.95] whitespace-pre-line mix-blend-difference pointer-events-none select-none z-30">
                  {p.title}
                </h1>

                <div className="col-span-4 col-start-5 z-10 flex justify-center">
                  <div
                    className="cursor-target parallax-image relative w-[clamp(420px,30vw,680px)] aspect-[3/4]"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                  >
                    {isVideo(p.image) ? (
                      <video
                        src={p.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ willChange: "transform", transform: "translateZ(0)" }}
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img src={p.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    )}
                  </div>
                </div>

                <div className="parallax-meta col-span-3 col-start-9 flex flex-col gap-6 justify-end">
                  <div className="space-y-2 text-xs">
                    {p.meta.map((m) => (
                      <p key={m} className="underline font-[Code_Pro]">{m}</p>
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed max-w-[34ch]">
                    {p.desc}
                  </p>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default ProjectShowcase;