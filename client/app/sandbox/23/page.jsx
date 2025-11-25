  "use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Galery from '../22/page.jsx'
import WhatWeDo from '../24/page.jsx'
import MethodPreview from '../25/page.jsx'
import dynamic from "next/dynamic"; 
import * as THREE from "three";
import gsap from "gsap";

const GradientPage = dynamic(() => import("../../../components/organisms/GradientPage.jsx"), {
  ssr: false,
});



function SubtleGridBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, points;
    let uniforms = {};

    const init = () => {
      const container = containerRef.current;

      const w = container.clientWidth;
      const h = container.clientHeight;

      // === Renderer ===
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000);
      container.appendChild(renderer.domElement);

      // === Scene & Camera ===
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
      camera.position.z = 150;

      // === Grid Points — identical but container-sized ===
      const spacing = 1;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);
      const positions = [];

      for (let y = -rows / 2; y < rows / 2; y++) {
        for (let x = -cols / 2; x < cols / 2; x++) {
          positions.push(x * spacing, y * spacing, 0);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      // === Uniforms with additional uFade ===
      uniforms = {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(9999, 9999) },
        uPixelRatio: { value: window.devicePixelRatio || 1.0 },
        uFade: { value: 0.0 }, // NEW — fade-in controller
      };

      // === Mouse Tracking (unchanged) ===
      window.addEventListener("pointermove", (e) => {
        const x = (e.clientX / w) * 2 - 1;
        const y = -(e.clientY / h) * 2 + 1;
        uniforms.uMouse.value.set(x, y);
      });

      // === Shader Material — original + small fade addition ===
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPos;
          varying vec2 vScreen;

          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            vUv = position.xy;
            vPos = position;

            vec3 pos = position;

            vec2 norm = (position.xy + vec2(500.0)) / 1000.0;
            float lightZone = smoothstep(0.0, 0.3, 1.0 - abs(norm.x - norm.y));

            float chaos = random(position.xy * 0.4 + uTime * 0.1);

            float orderly = sin((pos.x + pos.y) * 0.05 + uTime * 0.8) * 5.0;
            float disorder = (chaos - 0.5) * 50.0;

            float zOffset = mix(disorder, orderly, lightZone);
            pos.z += zOffset;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

            vScreen = gl_Position.xy / gl_Position.w;

            gl_PointSize = 2.4;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uFade;

          varying vec2 vUv;
          varying vec3 vPos;
          varying vec2 vScreen;

          void main() {
            vec2 norm = (vUv + vec2(500.0)) / 1000.0;
            float lightZone = smoothstep(0.0, 0.3, 1.0 - abs(norm.x - norm.y));

            vec3 bright = vec3(0.8, 0.8, 0.85);
            vec3 dark   = vec3(0.45, 0.45, 0.5);
            vec3 color  = mix(dark, bright, lightZone);

            float ndcDist = distance(vScreen, uMouse);
            float hover = smoothstep(0.035, 0.0, ndcDist);
            float boostMask = smoothstep(0.25, 1.0, lightZone);
            float brightnessBoost = hover * boostMask * 0.9;

            color += brightnessBoost;

            float alpha = 0.45 + 0.25 * sin(vPos.x * 0.05 + vPos.y * 0.05);

            // === Apply global fade ===
            color *= uFade;
            alpha *= uFade;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      // === Animate Fade-In ===
      gsap.to(uniforms.uFade, {
        value: 1,
        duration: 0.8,       // same as Hero headline animation
        ease: "power2.out",
        delay: 0,            // appear together
      });


      // === Resize Handler ===
      const resize = () => {
        const newW = container.clientWidth;
        const newH = container.clientHeight;

        renderer.setSize(newW, newH);
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("resize", resize);

      // === Loop ===
      const animate = (time = 0) => {
        uniforms.uTime.value = time * 0.001;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();
    };

    init();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        zIndex: 1,
      }}
    />
  );
}
/**
 * BOSON INDEX V4.4 — CLEAN + FIXED
 * - Full-page
 * - All sections separated into functions
 * - All minor JSX / Tailwind / transform bugs fixed
 * - Fully pasteable into Next.js app
 */

/* ===========================
Data
=========================== */
const WORKS = [
  {
    id: "marrosh",
    title: "Marrosh",
    subtitle: "Geometry-based brand structure.",
    category: "Logo / System Design",
    location: "Riyadh",
    year: "2024",
    img: "/clients/marrosh/main.jpg",
    collage: [
      "/clients/marrosh/2.jpg",
      "/clients/marrosh/3.jpg",
      "/clients/marrosh/4.jpg",
    ],
  },
  {
    id: "tender-touch",
    title: "Tender Touch",
    subtitle: "Digital brand renewal & social media system.",
    category: "Brand Identity / Motion / Photography",
    location: "Bali",
    year: "2025",
    img: "/clients/tender-touch/main.jpg",
    collage: [
      "/clients/tender-touch/2.jpg",
      "/clients/tender-touch/3.jpg",
      "/clients/tender-touch/4.jpg",
    ],
  },
  {
    id: "dwm",
    title: "Dream Wealth Management",
    subtitle: "Campaign visual system & content production.",
    category: "Campaign / Art Direction",
    location: "Bali",
    year: "2024",
    img: "/clients/dwm/main.jpg",
    collage: [
      "/clients/dwm/3.jpg",
      "/clients/dwm/4.jpg",
      "/clients/dwm/2.jpg",
    ],
  },
];

const CLIENT_LOGOS = [
  "marrosh.png",
  "tender-touch.png",
  "chi.png",
  "equilibrium.png",
  "psr.png",
  "dwm.png",
  "stylish-kitchen.png",
  "sunny-village.png",
];

/* ===========================
Utility: micro drift
=========================== */
// function useMicroDrift(ref, amplitude = 2, speed = 6000) {
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     let raf = null;
//     let start = performance.now();

//     const loop = (t) => {
//       const dt = (t - start) % speed;
//       const phase = Math.sin((dt / speed) * Math.PI * 2);
//       const y = Math.round(phase * amplitude);
//       el.style.transform = `translateY(${y}px)`;
//       raf = requestAnimationFrame(loop);
//     };

//     raf = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(raf);
//   }, [ref, amplitude, speed]);
// }


/* ===========================
UTILITY: micro drift
=========================== */
function useMicroDrift(ref, amplitude = 1.2, speed = 9500) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    let start = performance.now();

    const tick = (t) => {
      const dt = (t - start) % speed;
      const phase = Math.sin((dt / speed) * Math.PI * 2);
      const y = phase * amplitude;
      const x = Math.cos((dt / speed) * Math.PI * 2) * amplitude * 0.35;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, amplitude, speed]);
}


/* ===========================,
   HERO V5.3 — ARC EASING FADE-IN
   =========================== */
   function Hero() {
    const previewRef = useRef(null);
    useMicroDrift(previewRef, 1, 12000);
  
    return (
      <section className="relative min-h-[100vh] flex items-center overflow-hidden px-6 md:px-20 py-28">
  
        {/* GRID BACKGROUND — HANYA DI DALAM HERO */}
        <div className="absolute inset-0 z-[10] pointer-events-none">
          <SubtleGridBackground />
        </div>
  
  
        {/* CONTENT */}
        <div className="max-w-6xl mx-auto w-full relative z-[30]">
          <div className="grid grid-cols-12 gap-10 items-center">
  
            <div className="col-span-12 lg:col-span-7">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[3.8rem] sm:text-[4.8rem] md:text-[6rem] leading-[1.02] font-extralight tracking-[-0.02em] text-white"
              >
                Systems of clarity for Digital Presence
              </motion.h1>
  
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-7 text-gray-300 max-w-[62ch] text-[1.05rem] leading-relaxed"
              >
                We architect systems that transform creative intention into measurable,
                long-term digital presence.
              </motion.p>
  
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="mt-10 flex items-center gap-5"
              >
                <a
                  href="/works"
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.18em] hover:bg-white/10 transition"
                >
                  View our Work
                </a>
                <a
                  href="/method"
                  className="text-sm text-gray-400 hover:text-white transition underline"
                >
                  See our Methodology →
                </a>
              </motion.div>
            </div>
  
          </div>
        </div>
      </section>
    );
  }

  
  function Desc() {
    return (
      <>
        {/* HEADLINE LEFT */}
        <section className="w-full py-36 px-6 md:px-20 xl:px-40  border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 max-w-6xl">
            <div className="md:col-span-7">
              <p className="text-white/90 text-[2rem] md:text-[2.5rem] leading-[1.26] font-light max-w-[60ch]">
                We build <span className="text-white/60">clarity that moves brands</span> <br></br>
                shaping ideas into content, establishing presence, and creating
                measurable long-term impact.
              </p>
            </div>
          </div>
        </section>
  
        {/* BODY RIGHT OFFSET */}
        <section className="w-full py-32 px-6 md:px-20 xl:px-40 border-t border-white/10 ">
          <div className="grid grid-cols-1 md:grid-cols-12 max-w-6xl gap-10">
  
            <div className="md:col-span-7 md:col-start-6 space-y-6">
              <p className="text-white/70 text-[1.15rem] leading-[1.72] font-light tracking-[-0.005em]">
                Boson is a clarity-first studio designing systems for long-term digital 
                presence. We operate at the intersection of identity, content and 
                operational structure — building repeatable processes that transform 
                creative intention into measurable outcomes. 
              </p>
  
              <p className="text-white/70 text-[1.15rem] leading-[1.72] font-light tracking-[-0.005em]">
                Our work focuses on frameworks that scale, not one-off executions; 
                systems that bring calm, consistency and direction across every channel. 
                Everything we design is built to endure — structured for clarity, 
                crafted for long-term momentum, and aligned with the evolution of the brands 
                we work with.
              </p>
            </div>
  
          </div>
        </section>
      </>
    );
  }
  
/* ===========================
SECTION: MICRO-PHILOSOPHY
=========================== */ 

function MicroPhilosophy() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let lastScrollY = window.scrollY;
    let raf;

    const update = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY * -0.12; // Boson subtle motion

      track.style.transform = `translateX(${delta}px)`;

      lastScrollY = currentScrollY;
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="w-full py-20 border-t border-white/10 bg-[#050505] overflow-hidden">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap text-white/70 text-[1.4rem] md:text-[1.9rem] font-light tracking-[0.20em] select-none"
      >
        {/* repeated 3x for visual weight */}
        <span className="mx-6">BALI</span>
        <span className="mx-6">•</span>
        <span className="mx-6">QATAR</span>
        <span className="mx-6">•</span>
        <span className="mx-6">MALAYSIA</span>
        <span className="mx-6">•</span>

        <span className="mx-6">	ᬩᬮᬶ</span>
        <span className="mx-6">•</span>
        <span className="mx-6">QATAR</span>
        <span className="mx-6">•</span>
        <span className="mx-6">MALAYSIA</span>
        <span className="mx-6">•</span>

        <span className="mx-6">BALI</span>
        <span className="mx-6">•</span>
        <span className="mx-6">قطر</span>
        <span className="mx-6">•</span>
        <span className="mx-6">MALAYSIA</span>
        <span className="mx-6">•</span>
        
        <span className="mx-6">BALI</span>
        <span className="mx-6">•</span>
        <span className="mx-6">QATAR</span>
        <span className="mx-6">•</span>
        <span className="mx-6">MALAYSIA</span>
        <span className="mx-6">•</span>
      </div>
    </section>
  );
}




/* ===========================
SECTION: SELECTED WORKS PREVIEW
=========================== */
function SelectedWorksPreview() {
  return (
    <section className="w-full  py-24 px-6 md:px-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] uppercase text-white/90">
            Selected Works
          </h2>
          <p className="text-gray-500 mt-4 max-w-[60ch] mx-auto">
            A small, curated selection — evidence of systems in practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {WORKS.slice(0, 3).map((w) => (
            <article key={w.id} className="group">
              <div className="aspect-[4/5] w-full rounded-[6px] overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                <img
                  src={w.img}
                  alt={w.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg text-white/95 font-light uppercase">
                  {w.title}
                </h3>
                <p className="text-sm text-white/60 mt-2">
                  {w.location} — {w.year}
                </p>
                <p className="text-sm text-white/70 mt-3">{w.subtitle}</p>

                <a
                  href={`/works/${w.id}`}
                  className="inline-block mt-4 text-sm text-gray-300 underline"
                >
                  View case study →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
SECTION: SERVICES PREVIEW
=========================== */
function ServicesPreview() {
  const services = [
    {
      id: "identity",
      title: "Identity Systems",
      desc: "Design systems, visual language, and rollout playbooks that scale.",
    },
    {
      id: "content",
      title: "Content & Social Ops",
      desc: "Repeatable content engines, cadence, and production pipelines.",
    },
    {
      id: "digital",
      title: "Digital Experience",
      desc: "Interfaces and ecosystems built for behavior and retention.",
    },
  ];

  return (
    <section className="w-full  py-20 px-6 md:px-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-light text-white/90">
            What we do
          </h3>
          <p className="text-gray-500 mt-3 max-w-[60ch] mx-auto">
            Systems we design — practical, repeatable, measurable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.id}
              className="border border-white/[0.06] rounded-lg p-6 bg-white/[0.02]"
            >
              <div className="text-sm uppercase tracking-[0.2em] text-white/60 mb-3">
                {s.title}
              </div>
              <div className="text-white/80 leading-relaxed">{s.desc}</div>
              <div className="mt-6">
                <a
                  href={`/services#${s.id}`}
                  className="text-sm text-gray-300 underline"
                >
                  See details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
SECTION: TRUST GRID
=========================== */
function TrustGrid() {
  const wrapperRef = useRef(null);
  useMicroDrift(wrapperRef, 1.2, 8000);

  return (
    <section className="relative w-full px-8 md:px-24 py-28  border-t border-white/10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-[1.9rem] md:text-[2.4rem] font-light text-white/90">
            Brands we work with
          </h3>
          <p className="text-gray-500 mt-3 max-w-[60ch] mx-auto">
            A curated selection of partners aligned with Boson’s approach.
          </p>
        </div>

        <div
          ref={wrapperRef}
          className="relative z-10 max-w-[1100px] mx-auto flex flex-col items-center gap-16"
        >
          {/* Row 1 */}
          <div className="flex justify-center items-center gap-12 md:gap-20 translate-y-[0px]">
            {CLIENT_LOGOS.slice(0, 3).map((logo, i) => (
              <div
                key={i}
                className="relative group w-[120px] h-[120px] md:w-[160px] md:h-[160px] flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full blur-2xl bg-white/[0.06] opacity-30 group-hover:opacity-40 transition duration-700" />
                <img
                  src={`/clients/${logo}`}
                  alt={logo}
                  className="w-[70%] h-[70%] object-contain grayscale opacity-70 transition duration-700 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex justify-center items-center gap-20 md:gap-28 translate-y-[48px]">
            {CLIENT_LOGOS.slice(3, 5).map((logo, i) => (
              <div
                key={i}
                className="relative group w-[120px] h-[120px] md:w-[160px] md:h-[160px] flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full blur-2xl bg-white/[0.06] opacity-30 group-hover:opacity-40 transition duration-700" />
                <img
                  src={`/clients/${logo}`}
                  alt={logo}
                  className="w-[70%] h-[70%] object-contain grayscale opacity-70 transition duration-700 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex justify-center items-center gap-12 md:gap-20 translate-y-[4px]">
            {CLIENT_LOGOS.slice(5, 8).map((logo, i) => (
              <div
                key={i}
                className="relative group w-[120px] h-[120px] md:w-[160px] md:h-[160px] flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full blur-2xl bg-white/[0.06] opacity-30 group-hover:opacity-40 transition duration-700" />
                <img
                  src={`/clients/${logo}`}
                  alt={logo}
                  className="w-[70%] h-[70%] object-contain grayscale opacity-70 transition duration-700 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ===========================
SECTION: FINAL CTA
=========================== */
function FinalCTA() {
  return (
    <section className="w-full  py-20 px-6 md:px-20 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-light text-white/90">
          Begin a Project.
        </h3>
        <p className="text-gray-400 mt-4">
          Tell us your objectives — we’ll build the system that scales them.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center justify-center border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.18em] hover:bg-white/10 transition"
          >
            Start a Conversation
          </a>

          <a href="/method" className="text-sm text-gray-400 underline">
            View Method →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===========================
FOOTER
=========================== */
function Footer() {
  return (
    <footer className="w-full  py-12 px-6 md:px-20 border-t border-white/10 text-gray-500 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>© BOSON — Structural Clarity in Identity & Digital.</div>
        <div className="space-y-1 text-right">
          <div>Offices</div>
          <div className="text-white/80">Jakarta / Bali / Kuala Lumpur</div>
        </div>
      </div>
    </footer>
  );
}

/* ===========================
MAIN PAGE
=========================== */
export default function BosonIndexV44() {
  const heroPreviewRef = useRef(null);
  const wrapperRef = useRef(null); // tempat gradient ditempel

  // PARALLAX
  useEffect(() => {
    const el = heroPreviewRef.current;
    if (!el) return;

    let raf = null;
    let lastY = 0;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const dist = rect.top + rect.height / 2 - center;
      const y = Math.max(Math.min(dist * -0.02, 6), -6);

      if (Math.abs(y - lastY) > 0.2) {
        el.style.transform = `translateY(${y}px)`;
        lastY = y;
      }

      raf = requestAnimationFrame(onScroll);
    };

    raf = requestAnimationFrame(onScroll);
    return () => cancelAnimationFrame(raf);
  }, []);

  // EDGE-LIGHT BACKGROUND (applied to wrapperRef ONLY)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      const offsetX = 50 + Math.sin(y * 0.003) * 120;
      const offsetY = 50 + Math.cos(y * 0.003) * 120;

      if (wrapperRef.current) {
        wrapperRef.current.style.background = `
          radial-gradient(
            160% 160% at ${offsetX}% ${offsetY}%,
            #3a3a3a 0%,
            #1a1a1a 25%,
            #0a0a0a 60%,
            #000 100%
          )
        `;
        wrapperRef.current.style.backgroundAttachment = "fixed";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial render
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full text-white antialiased">
      <GradientPage/>
      {/* <div ref={heroPreviewRef}>
        <Hero />
      </div> */}
      {/* <Galery/> */}
      {/* <Desc/> */}
      {/* <MicroPhilosophy /> */}
      {/* <WhatWeDo /> */}
      {/* <SelectedWorksPreview /> */}
      {/* <TrustGrid /> */}
      {/* <MethodPreview /> */}
      {/* <FinalCTA /> */}
      {/* <Footer /> */}
    </div>
  );
}