"use client";
import React, { useEffect, useContext, useRef, useLayoutEffect, useState } from "react";
import { motion, useSpring, useScroll, useTransform, useAnimationFrame, useAnimation, useReducedMotion, useMotionValue, animate} from "framer-motion";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

import GradientBg from '../../components/organisms/GradientBg'
import * as THREE from "three";
import Image from 'next/image' 

function Webglbg() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const webgl = new GradientBg({
      rendererEl: containerRef.current,
      background: {
        color1: [0.72, 0.72, 0.72],   // light graphite
        color2: [0.38, 0.38, 0.38],   // mid graphite
        color3: [0.06, 0.06, 0.06],   // deep charcoal
        colorAccent: new THREE.Color(0.12, 0.12, 0.12),
        uLinesBlur: 0.34,
        uNoise: 0.03,
        uOffsetX: 0.05,
        uOffsetY: -2.5,
        uLinesAmount: 1.35,
      }
      
    });

    return () => {
      webgl.destroy();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      id="webgl"
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
    />
  );
}

/* ==================================================
   HERO (PURE WEBGL)
================================================== */
function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* WEBGL BACKGROUND */}
      <Webglbg />

      {/* LOGO TOP CENTER */}
      <div className="absolute  -top-5 left-1/2 -translate-x-1/2 z-30">
        <Image
          src="/png/boson-white.png"
          alt="Boson Logo"
          width={120}
          height={40}
          priority
          className="opacity-90"
        />
      </div>

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div
          className="
            mx-4 sm:mx-6
            mb-4 sm:mb-6
            flex items-center justify-between
            rounded-2xl
            px-12 py-2
          "
        >
          <div className="max-w-5xl">
            <h1
              className="font-sans text-white font-medium tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(18px, 2.8vw, 48px)" }}
            >
              <span
                className="
                  hidden lg:inline-block
                  mr-80
                  text-xs uppercase tracking-widest opacity-70
                  align-top relative
                "
              >
                about
              </span>

              Designers, engineers and coders. Driven by exceptional design and
              craftsmanship. We’re digital natives, dedicated heart and soul to
              strategic branding
            </h1>
          </div>

          <div className="w-14 h-14 rounded-full border border-white text-white text-sm font-medium flex flex-col items-center justify-center leading-none">
            <span>20</span>
            <span>25</span>
          </div>
        </div>
      </div>
    </section>
  );
}


function ParallaxImage({
  src,
  alt,
  priority = false,
  strength = 28,
  sizes,
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // satu arah, bukan bolak-balik
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover grayscale contrast-125 brightness-95"
        />
      </motion.div>
    </div>
  )
}

/* ======================================================
   TEAM SECTION
====================================================== */
function Team() {
  const sectionRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  /* =========================
     VIEWPORT CHECK
  ========================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const team = [
    {
      name: 'BRAHMA SATYA CARYA',
      roles: ['ACCOUNT MANAGER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896209/Brahma.png',
    },
    {
      name: 'PINGKAN',
      roles: ['PRODUCTION AND CREATIVE DIRECTOR'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896204/PIngkan.png',
    },
    {
      name: 'DEWI ICHSANI',
      roles: ['HUMAN RELATION AND GENERAL AFFAIRS'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896203/Dewi.png',
    },
    {
      name: 'DIPSY',
      roles: ['VIDEOGRAPHER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896203/Dipsy.png',
    },
    {
      name: 'RAHMAT',
      roles: ['VIDEO EDITOR'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896206/Rahmat.png',
    },
    {
      name: 'LINTANG',
      roles: ['WEB DEVELOPER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896208/Lintang.png',
    },
    {
      name: 'BAGAS',
      roles: ['VIDEOGRAPHER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896202/Arli.png',
    },
    {
      name: 'FLAOUDIA',
      roles: ['SOCIAL MEDIA MANAGER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896201/Flaudia.png',
    },
    {
      name: 'DIMAS',
      roles: ['GRAPHIC DESIGNER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896211/Dimas.png',
    },
    {
      name: 'BAGAS',
      roles: ['SOCIAL MEDIA MANAGER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896207/Bagas.png',
    },
    {
      name: 'FAUZI',
      roles: ['VIDEO EDITOR'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896204/Fauzi.png',
    },
    {
      name: 'EKATERINA BELIAEVA',
      roles: ['CHIEF EXECUTIVE OFFICER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896204/Kate.png',
    },
    {
      name: 'MAHMOUD TURKOMANY',
      roles: ['FOUNDER'],
      image:
        'https://res.cloudinary.com/dqdbkwcpu/image/upload/w_auto,f_auto,q_auto/v1768896205/Mahmoud.png',
    },
  ]

  const desktopLayout = [
    { left: '6vw', top: '10vh', width: 30 },
    { left: '58vw', top: '44vh', width: 26 },
    { left: '10vw', top: '106vh', width: 22 },
    { left: '60vw', top: '126vh', width: 34 },
    { left: '5vw', top: '198vh', width: 28 },
    { left: '58vw', top: '232vh', width: 22 },
    { left: '12vw', top: '292vh', width: 34 },
    { left: '54vw', top: '326vh', width: 24 },
    { left: '6vw', top: '392vh', width: 30 },
    { left: '62vw', top: '424vh', width: 22 },
    { left: '10vw', top: '482vh', width: 26 },
    { left: '56vw', top: '516vh', width: 32 },
    { left: '6vw', top: '582vh', width: 28 },
  ]

  /* =========================
     MOBILE (NO PARALLAX)
  ========================= */
  if (isMobile) {
    return (
      <section className="w-full bg-[#f3f4f5] text-black px-4 py-20">
        <div className="flex flex-col space-y-28">
          {team.map((member, index) => (
            <div key={index} className="flex justify-end">
              <div className="w-[82%]">
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 82vw"
                    className="object-cover grayscale contrast-125 brightness-95"
                  />
                </div>

                <div className="mt-6 border-b border-neutral-300 pb-5">
                  <h3 className="text-sm font-medium tracking-[0.32em] uppercase">
                    {member.name}
                  </h3>
                  <div className="mt-3 space-y-1">
                    {member.roles.map((role, i) => (
                      <p
                        key={i}
                        className="text-[11px] tracking-[0.45em] text-neutral-500 uppercase"
                      >
                        {role}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  /* =========================
     DESKTOP (PARALLAX)
  ========================= */
  return (
    <section
      ref={sectionRef}
      className="relative w-screen bg-[#f3f4f5] text-black"
      style={{ height: '670vh' }}
    >
      {team.map((member, index) => (
        <div
          key={index}
          className="absolute flex flex-col"
          style={{
            left: desktopLayout[index].left,
            top: desktopLayout[index].top,
            width: `${desktopLayout[index].width}vw`,
          }}
        >
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <ParallaxImage
              src={member.image}
              alt={member.name}
              priority={index < 2}
              strength={index % 2 === 0 ? 32 : 22}
              sizes={`${desktopLayout[index].width}vw`}
            />
          </div>

          <div className="mt-6 max-w-[90%] pb-5">
            <h3 className="text-sm md:text-base font-semibold tracking-[0.32em] uppercase">
              {member.name}
            </h3>
            <div className="mt-3 space-y-1">
              {member.roles.map((role, i) => (
                <p
                  key={i}
                  className="text-[11px] tracking-[0.45em] text-neutral-500 uppercase"
                >
                  {role}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

function BosonScrollText() {
  const wrapRef = React.useRef(null);
  const hoverRef = React.useRef(null);

  const pointer = React.useRef({ x: 0, y: 0 });
  const isHovering = React.useRef(false);
  const lastSpawn = React.useRef(0);
  const liveImages = React.useRef(new Set());

  const IMAGES = [
    "https://i.pinimg.com/736x/a2/32/3b/a2323b00992937f19158ab588d7b3ae5.jpg",
    "https://i.pinimg.com/736x/41/d8/c2/41d8c260bead65dda136dc36ff050f53.jpg",
    "https://i.pinimg.com/736x/ab/24/1d/ab241d4ee15a8eec9865cfcde25c1928.jpg",
    "https://i.pinimg.com/736x/2f/ef/f9/2feff9fa223efc86f58b0dac8a329b78.jpg",
    "https://i.pinimg.com/736x/81/80/76/818076e4dab04be9bcf90b81af06edfa.jpg",
  ];

  const TEXT = `A clear brand direction and growth that moves the business forward`;

  // ================= SPLIT TEXT =================
  const words = TEXT.trim().split(/(\s+)/);
  const chars = [];
  words.forEach((word) => {
    if (word.trim().length === 0) {
      chars.push({ type: "space", char: " " });
      return;
    }

    chars.push({
      type: "word",
      chars: word.split("").map((c) => ({ char: c })),
    });
  });

  // ================= SCROLL TEXT =================
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const characters = Array.from(wrap.querySelectorAll(".bf-char"));
    const total = characters.length;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 90%",
      end: "+=75%",
      scrub: 0.2,
      onUpdate: (self) => {
        const filled = self.progress * total;
        const full = Math.floor(filled);
        const frac = filled - full;

        characters.forEach((el) => {
          el.classList.remove("filled", "partial");
          el.style.setProperty("--partial", "0%");
        });

        for (let i = 0; i < full; i++) {
          characters[i]?.classList.add("filled");
        }

        if (characters[full]) {
          characters[full].classList.add("partial");
          characters[full].style.setProperty(
            "--partial",
            `${Math.round(frac * 100)}%`
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  // ================= HOVER IMAGE (MOVE-BASED) =================
  React.useEffect(() => {
    const area = hoverRef.current;
    if (!area) return;

    const spawnImage = () => {
      const img = document.createElement("img");
      img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];

      img.style.position = "absolute";
      img.style.left = pointer.current.x + "px";
      img.style.top = pointer.current.y + "px";
      img.style.width = "180px";
      img.style.height = "240px";
      img.style.objectFit = "cover";
      img.style.pointerEvents = "none";
      img.style.zIndex = "40";
      img.style.transform = "translate(-50%, -50%) scale(0.85)";
      img.style.opacity = "0";

      area.appendChild(img);
      liveImages.current.add(img);

      const intro = gsap.to(img, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      });

      const outro = gsap.to(img, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: 0.9,
        ease: "power2.inOut",
        onComplete: () => {
          liveImages.current.delete(img);
          img.remove();
        },
      });

      img._tweens = [intro, outro];
    };

    const onMove = (e) => {
      if (!isHovering.current) return;

      const now = performance.now();
      if (now - lastSpawn.current < 120) return;
      lastSpawn.current = now;

      const rect = area.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;

      spawnImage();
    };

    const onEnter = () => {
      isHovering.current = true;
    };

    const onLeave = (e) => {
      isHovering.current = false;

      // keluar window → jangan bunuh
      if (!e.relatedTarget) return;

      liveImages.current.forEach((img) => {
        if (img._tweens) img._tweens.forEach((t) => t.kill());
        img.remove();
      });

      liveImages.current.clear();
    };

    area.addEventListener("mousemove", onMove);
    area.addEventListener("mouseenter", onEnter);
    area.addEventListener("mouseleave", onLeave);

    return () => {
      area.removeEventListener("mousemove", onMove);
      area.removeEventListener("mouseenter", onEnter);
      area.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="bf-page" ref={hoverRef}>
      <style jsx>{`
        .bf-page {
          position: relative;
          width: 100vw;
          min-height: 101vh;
          background: #f3f4f5;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          overflow: hidden;
        }

        .bf-header {
          padding: 3vh 7.9vw 0;
          text-align: center;
        }

        .bf-header-title {
          font-family: Inter, sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          font-weight: 700;
          text-transform: uppercase;
          color: #0b0f14;
        }

        .bf-header-sub {
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          opacity: 0.75;
        }

        .bf-outer {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10vh 7.9vw;
        }

        .bf-wrap {
          width: min(1300px, 92%);
          text-align: center;
          line-height: 1.05;
        }

        .bf-word {
          display: inline-block;
          white-space: nowrap;
          margin-right: 0.4rem;
        }

        .bf-char {
          display: inline-block;
          font-family: Inter, sans-serif;
          font-weight: 1000;
          font-size: clamp(48px, 18vw, 84px);
          line-height: 0.98;
          color: rgba(0, 0, 0, 0.25);
          background-clip: text;
          -webkit-background-clip: text;
          text-transform: uppercase;
        }

        .bf-char.filled {
          color: #000;
        }

        .bf-char.partial {
          color: transparent;
          background-image: linear-gradient(
            90deg,
            #000 var(--partial),
            rgba(0, 0, 0, 0.25) var(--partial)
          );
        }

        .bf-footer {
          padding: 0 7.9vw 4vh;
          text-align: center;
        }

        .bf-footer-text {
          font-family: Georgia, serif;
          font-size: 14px;
          font-style: italic;
          opacity: 0.85;
        }
      `}</style>

      <header className="bf-header">
        <div className="bf-header-title">
          We Work With The Biggest Brands
        </div>
        <div className="bf-header-sub">From Around the World</div>
      </header>

      <div className="bf-outer">
        <div className="bf-wrap" ref={wrapRef}>
          {chars.map((item, i) =>
            item.type === "space" ? (
              <span key={i}>&nbsp;</span>
            ) : (
              <span className="bf-word" key={i}>
                {item.chars.map((c, j) => (
                  <span key={j} className="bf-char">
                    {c.char}
                  </span>
                ))}
              </span>
            )
          )}
        </div>
      </div>

      <footer className="bf-footer">
        <div className="bf-footer-text">
          And We’re Clued Up on Culture…
        </div>
      </footer>
    </div>
  );
}


function Description() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="w-full bg-white text-neutral-900 py-12 lg:py-20 overflow-hidden"
    >
      <div className="max-w-screen mx-auto px-5 sm:px-6 lg:px-20">
      <h1
            ref={titleRef}
            className="font-sans font-medium tracking-tight leading-[1.05]"
            style={{ fontSize: "clamp(32px, 5vw, 134px)" }}
          >
            <span className="hidden lg:inline mr-80" />
            Designers, engineers and coders.
      Driven by exceptional design and craftsmanship.
      We’re digital natives, dedicated heart and soul to strategic branding.
          </h1>
      </div>
    </section>
  );
}

function Footer() {
  const emailRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    const el = emailRef.current;
    if (!el) return;

    charsRef.current = charsRef.current.filter(Boolean);
    if (!charsRef.current.length) return;

    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) return;

    gsap.set(charsRef.current, { y: 0, opacity: 1 });

    const tl = gsap.timeline({ paused: true });

    tl.to(charsRef.current, {
      y: -36,
      opacity: 0,
      duration: 0.55,
      ease: "power4.in",
      stagger: { amount: 0.22 },
    })
      .set(charsRef.current, { y: 36 })
      .to(charsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "back.out(2.6)",
        stagger: { amount: 0.22 },
      });

    const onPointerEnter = (e) => {
      if (e.pointerType !== "mouse") return;
      tl.restart();
    };

    el.addEventListener("pointerenter", onPointerEnter);

    return () => {
      el.removeEventListener("pointerenter", onPointerEnter);
      tl.kill();
    };
  }, []);

  const email = "boson.sma@gmail.com";

  return (
    <footer
      id="top"
      className="relative bg-neutral-950 text-white overflow-hidden"
    >
      {/* SIGNAL BAR */}
      <div className="px-[6vw] py-4 sm:py-5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] tracking-wide border-b border-white/10 gap-y-2">
        <div className="opacity-50 uppercase">
          GMT +7 · Operating globally
        </div>

        <div className="flex gap-5 sm:gap-6">
          <div className="opacity-80">Our Social</div>
          {["Instagram", "LinkedIn"].map((item) => (
            <a
              key={item}
              href="#"
              className="opacity-50 hover:opacity-100 transition"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-12 gap-y-12 sm:gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <p className="text-neutral-500 max-w-md leading-relaxed text-sm sm:text-base">
              We work with teams building thoughtful digital products
              <br />
              <span className="hidden sm:inline mr-10"></span>
              If you have a project in mind, we would{" "}
              <span className="italic">looove</span> to hear about it
            </p>
          </div>

          <div className="col-span-12 lg:col-span-6 flex lg:justify-end items-start lg:items-end">
            <a
              ref={emailRef}
              href="mailto:boson.sma@gmail.com"
              className="
                inline-block
                font-light
                tracking-tight
                text-white
                cursor-pointer
                text-[clamp(24px,7vw,42px)]
              "
            >
              <span className="inline-flex overflow-hidden">
                {email.split("").map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => (charsRef.current[i] = el)}
                    className="inline-block will-change-transform"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
              <span className="block h-[1px] w-full bg-white/30 mt-1" />
            </a>
          </div>
        </div>
      </div>

      {/* BRAND MASS */}
      <div className="relative px-6 lg:px-12 pt-12 pb-20 sm:pb-24 border-t border-neutral-800">
        <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-y-10 sm:gap-y-12 items-end">
          
          {/* META — MOBILE FIRST */}
          <div className="col-span-12 lg:col-span-5 flex flex-col lg:items-end gap-5 sm:gap-6 text-[11px] sm:text-xs text-neutral-500 order-1 lg:order-2">
            <div className="space-y-1 lg:text-right">
              <div>+62 877 6777 7720</div>
              <div>Bali · Indonesia</div>
            </div>

            <span>Copyright © {new Date().getFullYear()}</span>

            <div className="flex gap-6 sm:gap-8">
              <a href="/imprint" className="hover:text-white">
                Imprint
              </a>
              <a href="#top" className="hover:text-white">
                Back to top ↑
              </a>
            </div>
          </div>

          {/* BRAND LOGO — PINDAH KE PALING BAWAH DI MOBILE */}
          <div className="col-span-12 lg:col-span-7 order-2 lg:order-1">
            <img
              src="/png/boson-white3.png"
              alt="Boson"
              className="w-full max-w-[900px]"
            />
          </div>

        </div>
      </div>
    </footer>
  );
}


/* ==================================================
   PAGE
================================================== */
export default function Page() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      
      {/* <Description/> */}
      
      <Team/>
      
      <BosonScrollText/>
       
      
      <Footer/>

      <style jsx global>{`
        body {
          margin: 0;
          background: #000;
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
}
