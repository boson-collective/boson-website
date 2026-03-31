"use client";

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";



import { LoaderContext } from "../components/atoms/LoaderGate";

/* ==================================================
   SECTIONS / COMPONENTS
================================================== */
import HeroJoin from "../components/organisms/HeroJoin";
import Heading from "../components/atoms/Heading";
import Footer from "../components/organisms/Footer";

import BosonNarrative from "../components/organisms/BosonNarrative";
import Projects from "../components/organisms/Projects";
import Description from "../components/organisms/Description";
import VideoSection from "../components/organisms/VideoSection";
import ServicesHero from "../components/organisms/ServicesHero";
import BigHeading from "../components/organisms/BigHeading";
import ProjectShowcase from "../components/organisms/ProjectShowcase";
import WorksList from "../components/organisms/WorksList";
import ClientsList from "../components/organisms/ClientsList";
import Galery from "../components/organisms/Galery";

export default function Page() {
  const ready = useContext(LoaderContext);

  const bgRef = useRef(null);
  const footerRef = useRef(null);

  const [footerHeight, setFooterHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* ==================================================
     DETECT MOBILE
  ================================================== */
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };

    check();
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  /* ==================================================
     RESET SCROLL
  ================================================== */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ==================================================
     MEASURE FOOTER HEIGHT (ONLY DESKTOP)
  ================================================== */
  useLayoutEffect(() => {
    if (!ready) return;
    if (isMobile) return; // 🚫 kill di mobile

    const footer = footerRef.current;
    if (!footer) return;

    const measure = () => {
      const rect = footer.getBoundingClientRect();
      setFooterHeight(rect.height);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(footer);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ready, isMobile]);

  /* ==================================================
     SCROLL-DRIVEN FOOTER REVEAL (DESKTOP ONLY)
  ================================================== */
  useEffect(() => {
    if (!ready) return;
    if (!footerHeight) return;
    if (isMobile) return; // 🚫 kill di mobile

    const footer = footerRef.current;
    if (!footer) return;

    const OFFSET = window.innerHeight * 0.5;

    footer.style.transform = `translateY(${OFFSET}px)`;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      const start = docH - viewportH - footerHeight;
      const end = docH - viewportH;

      let progress = (scrollY - start) / (end - start);
      progress = Math.min(Math.max(progress, 0), 1);

      const y = OFFSET * (1 - progress);
      footer.style.transform = `translateY(${y}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [ready, footerHeight, isMobile]);

  if (!ready) return null;

  return (
    <div
      ref={bgRef}
      className="chayay"
      style={{
        width: "100%",
        background: "black",
        position: "relative",
      }}
    >
      {/* ==================================================
         HERO / TOP
      ================================================== */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          background: "#000",
        }}
      >
        <HeroJoin />
      </div>

      <Heading />

      <div
        data-theme="dark"
        style={{ position: "relative", zIndex: 2, width: "100%" }}
      >
        <BosonNarrative />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <Projects />
      </div>
 

      {/* ==================================================
         DESCRIPTION
      ================================================== */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Description />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <VideoSection />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <ServicesHero />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <BigHeading />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <ProjectShowcase />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <WorksList />
      </div>
      
      
      <div style={{ position: "relative", zIndex: 2 }}>
        <ClientsList/>
      </div>

      {/* ==================================================
         GALERY
      ================================================== */}
      <div className="bg-neutral-950" style={{ position: "relative", zIndex: 2 }}>
        <Galery />
      </div>

      {/* ==================================================
         EXTRA SCROLL DEPTH (DESKTOP ONLY)
      ================================================== */}
      {!isMobile && <div style={{ height: footerHeight }} />}

      {/* ==================================================
         FOOTER
         - MOBILE: normal flow
         - DESKTOP: fixed + reveal
      ================================================== */}
      {isMobile ? (
        <div style={{ position: "relative", zIndex: 2 }}>
          <Footer />
        </div>
      ) : (
        <div
          ref={footerRef}
          className="fixed bottom-0 left-0 w-full z-0"
          style={{ willChange: "transform" }}
        >
          <Footer />
        </div>
      )}

      {/* ==================================================
         GLOBAL STYLE
      ================================================== */}
      <style jsx global>{`
        body {
          background: #000;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
