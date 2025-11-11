"use client";
import { motion } from "framer-motion";

export default function BosonIntro() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* === Background Video === */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://video.wixstatic.com/video/f0fad4_c5e73af6159647568391799b6d161626/1080p/mp4/file.mp4"
          type="video/mp4"
        />
      </video>

      {/* === Overlay Gradient === */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* === Centered Boson Logo === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          src="/png/boson-white.png"
          alt="Boson Logo"
          className="w-[220px] md:w-[340px] lg:w-[400px] opacity-95 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        />
      </motion.div>
    </section>
  );
}
