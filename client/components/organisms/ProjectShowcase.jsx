import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
        "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768812919/Sunny_Vilage_-_Imgur_czxdgr.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A property development group delivering residential and hospitality projects with a focus on design, lifestyle, and long-term value",
      igLink: "https://www.instagram.com/sunnyfamilybali",
    },
    {
      title: "Novo\nAmpang",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768812919/Novo_Ampang_-_Imgur_tcf27u.mp4",
      meta: ["REAL ESTATE", "KUALA LUMPUR", "SOCIAL MEDIA MARKETING"],
      desc:
        "A premium residential development in Kuala Lumpur designed for urban living and investment-driven buyers",
      igLink: "https://www.instagram.com/novo_ampang_kl",
    },
    {
      title: "Shinobi\nSoirée",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768812920/SHINOBI_-_Imgur_nn6mcd.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc:
        "A club in Bali functioning as a music-oriented social venue, defined by its spatial layout, sound, and collective presence",
      igLink: "https://www.instagram.com/shinobi_soiree",
    },
    {
      title: "Marroosh\nBali",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/video/upload/q_auto,f_auto,vc_auto/v1768898521/marroosh-main.mp4",
      meta: ["FOOD & BEVERAGE", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc:
        "A Lebanese restaurant in Canggu offering authentic Middle Eastern cuisine in a warm, casual dining setting.",
      igLink: "https://www.instagram.com/marrooshbali",
    },
    {
      title: "Tender\nTouch",
      image:
        "https://res.cloudinary.com/dqdbkwcpu/video/upload/q_auto,f_auto,vc_auto/v1768899602/tender-touch-main.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MARKETING"],
      desc:
        "A wellness and massage brand in Bali offering premium treatments focused on recovery, relaxation, and holistic care",
      igLink: "https://www.instagram.com/tendertouch.bali",
    },
  ];

  const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src);

  /* =========================
     DESKTOP DETECTION
  ========================= */
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* =========================
     CUSTOM CURSOR (NO LEAK)
  ========================= */
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
        ease: "power3.out",
      });
      document.body.style.cursor = "none";
    };

    const hide = () => {
      setIsHoveringTarget(false);
      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power3.out",
      });
      document.body.style.cursor = "default";
    };

    const click = () => {
      if (!isHoveringTarget) return;
      const link = projects[activeIndex]?.igLink;
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
  }, [isDesktop, activeIndex, isHoveringTarget, projects]);

  /* =========================
     GSAP SETUP (ISOLATED)
  ========================= */
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
      const slidesCount = projects.length;
      const track = trackRef.current;
      const progressBar = progressRef.current;

      const getScrollDistance = () =>
        (slidesCount - 1) * window.innerWidth;

      const mainTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            gsap.set(progressBar, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });
            setActiveIndex(
              Math.round(self.progress * (slidesCount - 1))
            );
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
  }, [isDesktop, projects.length]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-hidden lg:h-screen"
    >
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
            width: isDesktop ? `${projects.length * 100}vw` : "100%",
          }}
        >
          {projects.map((p, i) => (
            <div
              key={i}
              className="relative w-full lg:w-screen min-h-screen flex-shrink-0"
            >
              <div className="relative mx-auto h-full px-[clamp(3rem,6vw,10rem)] pt-24 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
                <span className="lg:col-span-12 font-[Code_Pro] text-xs tracking-widest text-white/50">
                  PROJECT 0{i + 1}
                </span>

                <h2 className="lg:hidden text-[42px] leading-[0.95] font-light whitespace-pre-line">
                  {p.title}
                </h2>

                <h1 className="font-[Code_Pro] hidden lg:block absolute left-[35%] top-[25%] -translate-x-1/2 text-[clamp(3.5rem,6vw,6rem)] leading-[0.95] font-base whitespace-pre-line mix-blend-difference pointer-events-none select-none z-30">
                  {p.title}
                </h1>

                <div className="lg:col-span-4 lg:col-start-5 z-10 flex justify-center">
                  <div className="cursor-target parallax-image relative w-[clamp(320px,80vw,680px)] lg:w-[clamp(420px,30vw,680px)] aspect-[3/4]">
                    {isVideo(p.image) ? (
                      <video
                        src={p.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={p.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt=""
                      />
                    )}
                  </div>
                </div>

                <div className="parallax-meta lg:col-span-3 lg:col-start-9 flex flex-col gap-6 lg:justify-end">
                  <div className="space-y-2 text-xs">
                    {p.meta.map((m) => (
                      <p key={m} className="underline font-[Code_Pro]">
                        {m}
                      </p>
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

      {isDesktop && (
        <div className="absolute bottom-0 left-0 right-0 px-28 pb-6">
          <div className="h-px bg-white/20">
            <div
              ref={progressRef}
              className="h-full bg-white origin-left scale-x-0"
            />
          </div>
          <div className="mt-4 text-sm">
            [ {activeIndex + 1} — {projects.length} ]
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectShowcase;
