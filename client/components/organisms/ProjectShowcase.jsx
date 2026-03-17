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

  const projects = [
    {
      title: "Sunny\nDevelopment",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768812919/Sunny_Vilage_-_Imgur_czxdgr.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc: "A property development group delivering residential and hospitality projects with a focus on design, lifestyle, and long-term value",
      igLink: "https://www.instagram.com/sunnyfamilybali",
    },
    {
      title: "Novo\nAmpang",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768812919/Novo_Ampang_-_Imgur_tcf27u.mp4",
      meta: ["REAL ESTATE", "KUALA LUMPUR", "SOCIAL MEDIA MARKETING"],
      desc: "A premium residential development in Kuala Lumpur designed for urban living and investment-driven buyers",
      igLink: "https://www.instagram.com/novo_ampang_kl",
    },
    {
      title: "Hidden \nCity Ubud",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1770884815/hidden-city-ubud-main.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc: "A development firm creating distinctive residential and hospitality projects driven by design, lifestyle, and long-term value",
      igLink: "https://www.instagram.com/hidden_city_ubud",
    },
    {
      title: "Little\nSoho",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1770885309/little-soho-main.mp4",
      meta: ["REAL ESTATE", "BALI", "SOCIAL MEDIA MARKETING"],
      desc: "A property development firm creating distinctive residential and hospitality destinations, driven by design excellence, elevated living experiences, and enduring investment value",
      igLink: "https://www.instagram.com/hidden_city_ubud",
    },
    {
      title: "Marroosh\nBali",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/q_auto,f_auto,vc_auto/v1768898521/marroosh-main.mp4",
      meta: ["FOOD & BEVERAGE", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc: "A Lebanese restaurant in Canggu offering authentic Middle Eastern cuisine in a warm, casual dining setting.",
      igLink: "https://www.instagram.com/marrooshbali",
    },
    {
      title: "Shinobi\nSoirée",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/v1768812920/SHINOBI_-_Imgur_nn6mcd.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MANAGEMENT"],
      desc: "A club in Bali functioning as a music-oriented social venue, defined by its spatial layout, sound, and collective presence",
      igLink: "https://www.instagram.com/shinobi_soiree",
    },
    {
      title: "Tender\nTouch",
      image: "https://res.cloudinary.com/dqdbkwcpu/video/upload/q_auto,f_auto,vc_auto/v1768899602/tender-touch-main.mp4",
      meta: ["HOSPITALITY", "BALI", "SOCIAL MEDIA MARKETING"],
      desc: "A wellness and massage brand in Bali offering premium treatments focused on recovery, relaxation, and holistic care",
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

  useLayoutEffect(() => {
    ctxRef.current?.revert();

    if (!isDesktop) {
      gsap.set([trackRef.current, ".parallax-image", ".parallax-meta"], {
        clearProps: "all",
      });
      return;
    }

    ctxRef.current = gsap.context(() => {
      const slidesCount = randomizedProjects.length;
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
  }, [isDesktop, randomizedProjects.length]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-hidden lg:h-screen"
    >
      <div className="relative lg:absolute lg:inset-0">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row"
          style={{
            width: isDesktop ? `${randomizedProjects.length * 100}vw` : "100%",
          }}
        >
          {randomizedProjects.map((p, i) => (
            <div
              key={i}
              className="relative w-full lg:w-screen min-h-screen flex-shrink-0"
            >
              {/* MOBILE HERO */}
              <div className="lg:hidden w-full h-[65vh] relative">
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

              {/* GRID */}
              <div className="relative mx-auto h-full px-[clamp(3rem,6vw,10rem)] pt-24 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
                
              <span className="hidden lg:block lg:col-span-12 font-[Code_Pro] text-xs tracking-widest text-white/50">
                  PROJECT 0{i + 1}
                </span>

                {/* MOBILE TEXT SYSTEM */}
                <div className="lg:hidden flex flex-col gap-6">
                  
                  {/* GROUP 1 */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] tracking-widest text-white/35">
                      PROJECT 0{i + 1}
                    </span>

                    <h2 className="text-[clamp(3.2rem,9vw,4rem)] leading-[0.88] font-light whitespace-pre-line">
                      {p.title}
                    </h2>
                  </div>

                  {/* GROUP 2 */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/65">
                    {p.meta.map((m) => (
                      <span key={m} className="underline">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* GROUP 3 */}
                  <p className="text-[13px] text-white/50 leading-relaxed max-w-[30ch]">
                    {p.desc}
                  </p>
                </div>

                {/* DESKTOP TITLE */}
                <h1 className="font-[Code_Pro] hidden lg:block absolute left-[35%] top-[25%] -translate-x-1/2 text-[clamp(3.5rem,6vw,6rem)] leading-[0.95] font-base whitespace-pre-line mix-blend-difference pointer-events-none select-none z-30">
                  {p.title}
                </h1>

                {/* DESKTOP IMAGE */}
                <div className="hidden lg:flex lg:col-span-4 lg:col-start-5 z-10 justify-center">
                  <div className="cursor-target parallax-image relative w-[clamp(420px,30vw,680px)] aspect-[3/4]">
                    {isVideo(p.image) ? (
                      <video src={p.image} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline autoPlay />
                    ) : (
                      <img src={p.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    )}
                  </div>
                </div>

                {/* DESKTOP META */}
                <div className="parallax-meta hidden lg:flex lg:col-span-3 lg:col-start-9 flex-col gap-6 justify-end">
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
            <div ref={progressRef} className="h-full bg-white origin-left scale-x-0" />
          </div>
          <div className="mt-4 text-sm">
            [ {activeIndex + 1} — {randomizedProjects.length} ]
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectShowcase;