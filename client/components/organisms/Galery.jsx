import { useEffect, useLayoutEffect, useRef, useState } from "react"; 
import { SplitText, ScrollTrigger, gsap } from "../../lib/gsap";
 

function Galery() {
  const FRAME_GAP = 10;

  /* =========================
     GRID LOGIC
  ========================= */
  const getGridColumns = () => (window.innerWidth < 640 ? 3 : 5);
  const [gridCols, setGridCols] = useState(getGridColumns());

  /* =========================
     DATA
  ========================= */
  const LANES = [
    {
      col: 1,
      speed: -160,
      items: [
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769891/cta-2.png",
          top: "220vh",
        },
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769894/cta-8.png",
          top: "380vh",
        },
      ],
    },
    {
      col: 2,
      speed: 120,
      items: [
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769911/cta-1.png",
          top: "80vh",
        },
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769890/cta-6.png",
          top: "300vh",
        },
      ],
    },
    {
      col: 3,
      speed: -140,
      items: [
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769901/cta-10.png",
          top: "160vh",
        },
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769899/cta-9.png",
          top: "280vh",
        },
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769914/cta-17.png",
          top: "420vh",
        },
      ],
    },
    {
      col: 4,
      speed: 100,
      items: [
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769902/cta-12.png",
          top: "120vh",
        },
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769912/cta-11.png",
          top: "340vh",
        },
      ],
    },
    {
      col: 5,
      speed: -160,
      items: [
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769897/cta-4.png",
          top: "250vh",
        },
        {
          src: "https://res.cloudinary.com/dqdbkwcpu/image/upload/v1771769906/cta-14.png",
          top: "430vh",
        },
      ],
    },
  ];

  /* =========================
     REFS
  ========================= */
  const sectionRef = useRef(null);
  const textPinRef = useRef(null);
  const headlineRef = useRef(null);
  const getStartedRef = useRef(null);
  const fadeTopRef = useRef(null);
  const fadeBottomRef = useRef(null);
  const gridRef = useRef(null);
  const laneRefs = useRef([]);

  const resizeTimer = useRef(null);

  /* === FLAG PLAY ONCE === */
  const textPlayedRef = useRef(false);

  /* =========================
     RESIZE
  ========================= */
  useEffect(() => {
    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setGridCols(getGridColumns());
        ScrollTrigger.refresh(true);
      }, 150);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* =========================
     GSAP
  ========================= */
  useLayoutEffect(() => {
    let headlineSplit;
    let getStartedSplit;

    const ctx = gsap.context(() => {
      gsap.set(laneRefs.current, { force3D: true });

      gsap.set(sectionRef.current, {
        backgroundColor: "#000",
        color: "#fff",
        borderBottomLeftRadius: "7vw",
        borderBottomRightRadius: "7vw",
      });

      gsap.set(gridRef.current.querySelectorAll(".grid-line"), {
        borderColor: "rgba(255,255,255,0.2)",
      });

      gsap.set([headlineRef.current, getStartedRef.current], { opacity: 0 });

      /* --- BORDER MORPH --- */
      gsap.to(sectionRef.current, {
        borderBottomLeftRadius: "0vw",
        borderBottomRightRadius: "0vw",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom bottom",
          end: "top+=35% top",
          scrub: 2,
        },
      });

      /* --- PARALLAX LANES --- */
      laneRefs.current.forEach((lane, i) => {
        if (!lane) return;
        gsap.fromTo(
          lane,
          { y: LANES[i].speed * -0.35 },
          {
            y: LANES[i].speed,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      /* --- PIN + TEXT (PLAY ONCE) --- */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "70% top",
        pin: textPinRef.current,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (textPlayedRef.current) return;
          textPlayedRef.current = true;

          document.fonts.ready.then(() => {
            gsap.set([headlineRef.current, getStartedRef.current], {
              opacity: 1,
            });

            headlineSplit = new SplitText(headlineRef.current, {
              type: "lines",
              mask: "lines",
            });

            getStartedSplit = new SplitText(getStartedRef.current, {
              type: "words",
            });

            gsap
              .timeline()
              .from(getStartedSplit.words, {
                y: 12,
                opacity: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: "power2.out",
              })
              .from(
                headlineSplit.lines,
                {
                  yPercent: 40,
                  opacity: 0,
                  duration: 1.2,
                  stagger: 0.12,
                  ease: "power2.out",
                },
                "-=0.2"
              );
          });
        },
      });

      /* --- COLOR SHIFT --- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "55% bottom",
            end: "85% bottom",
            scrub: true,
          },
        })
        .fromTo(
          sectionRef.current,
          { backgroundColor: "#000", color: "#fff" },
          { backgroundColor: "#f5f5f5", color: "#111", ease: "none" }
        )
        .fromTo(
          gridRef.current.querySelectorAll(".grid-line"),
          { borderColor: "rgba(255,255,255,0.2)" },
          { borderColor: "rgba(0,0,0,0.15)", ease: "none" },
          0
        )
        .to([fadeTopRef.current, fadeBottomRef.current], { opacity: 0 }, 0);
    }, sectionRef);

    return () => {
      headlineSplit?.revert();
      getStartedSplit?.revert();
      ctx.revert();
    };
  }, [gridCols]);

  /* =========================
     RENDER
  ========================= */
  return (
    <section ref={sectionRef} className="relative min-h-[480vh] overflow-hidden">
      {/* GRID */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-10 pointer-events-none grid"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {Array.from({ length: gridCols }).map((_, i) => (
          <div key={i} className="grid-line border-r last:border-r-0" />
        ))}
      </div>

      {/* PINNED TEXT */}
      <div
        ref={textPinRef}
        className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center z-30 pointer-events-none"
      >
        <div className="text-center max-w-[90vw] px-6">
          <span
            ref={getStartedRef}
            className="block font-[Code_Pro] text-[11px] tracking-[0.22em] opacity-80 mb-6"
          >
            GET STARTED
          </span>

          <h1
            ref={headlineRef}
            className="font-[Code_Pro] leading-[1.08] text-[clamp(40px,5.4vw,68px)]"
          >
            Time to
            <br />
            Make it happen
          </h1>
        </div>
      </div>

      {/* IMAGES */}
      <div
        className="absolute inset-0 z-20 grid"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {LANES.map((lane, i) => (
          <div
            key={i}
            ref={(el) => (laneRefs.current[i] = el)}
            className="relative h-full will-change-transform"
            style={{ gridColumn: Math.min(lane.col, gridCols) }}
          >
            {lane.items.map((item, j) => (
              <figure
                key={j}
                className="absolute w-full overflow-hidden"
                style={{ top: item.top, paddingInline: `${FRAME_GAP}px` }}
              >
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={item.src}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </figure>
            ))}
          </div>
        ))}
      </div>

      {/* FADES */}
      <div
        ref={fadeTopRef}
        className="pointer-events-none absolute top-0 left-0 w-full h-[240px] z-40
                   bg-gradient-to-b from-black via-black/90 to-transparent"
      />
      <div
        ref={fadeBottomRef}
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[360px] z-40
                   bg-gradient-to-t from-black via-black/90 to-transparent"
      />
    </section>
  );
}

export default Galery;
