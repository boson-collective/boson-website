"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function WhoWeArePage() {
  const [hovered, setHovered] = useState(null);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  // Smooth motion loop for position + rotation
  useEffect(() => {
    const updatePosition = () => {
      target.current.x += (mouse.current.x - target.current.x) * 0.1;
      target.current.y += (mouse.current.y - target.current.y) * 0.1;

      gsap.to(cardRef.current, {
        x: target.current.x - window.innerWidth / 2,
        y: target.current.y - window.innerHeight / 2,
        rotationY: (mouse.current.x - window.innerWidth / 2) * 0.05,
        rotationX: (window.innerHeight / 2 - mouse.current.y) * 0.05,
        duration: 0.3,
        ease: "power2.out",
      });

      requestAnimationFrame(updatePosition);
    };
    updatePosition();
  }, []);

  const handleMouseMove = (e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  };

  // Image URLs
  const imageMap = {
    collective:
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    transform:
      "https://plus.unsplash.com/premium_photo-1673263586782-8fa0713158e0?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    impact:
      "https://images.unsplash.com/photo-1634662463723-187914625f50?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
  };

  // Card animation logic — no opacity transitions
  useEffect(() => {
    if (!cardRef.current) return;

    if (hovered) {
      gsap.killTweensOf(cardRef.current);
      gsap.fromTo(
        cardRef.current,
        { scale: 0.2 },
        { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.2 },
          { scale: 1, duration: 0.8, ease: "power2.out" }
        );
      }
    } else {
      gsap.to(cardRef.current, {
        scale: 0.8,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [hovered]);

  // Adjust z-index based on hovered
  const getZIndex = (key) => {
    if (!hovered) return "z-10";
    return hovered === key ? "z-20" : "z-0";
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden"
      style={{
        backgroundImage: `url('/mnt/data/WhatsApp Image 2025-11-03 at 15.31.48.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>

      {/* Floating Image Card */}
      <div
        ref={cardRef}
        className="absolute left-1/2 top-1/2 w-80 h-[32rem] bg-white/5 border border-white/10 overflow-hidden shadow-2xl pointer-events-none"
        style={{
          zIndex: hovered ? 10 : 5,
          transform: "translate(-50%, -50%) scale(0.2)",
          willChange: "transform",
        }}
      >
        {hovered && (
          <img
            key={hovered}
            ref={imageRef}
            src={imageMap[hovered]}
            alt="hover preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Centered Text */}
      <div className="relative flex flex-col items-center justify-center text-center px-6">
        <h1
          className="font-extrabold leading-[1.05] tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl relative"
        >
          {/* Collective */}
          <span
            className={`block relative cursor-pointer transition-all duration-300 ${getZIndex(
              "collective"
            )}`}
            onMouseEnter={() => setHovered("collective")}
            onMouseLeave={() => setHovered(null)}
          >
            A collective built
          </span>

          {/* Transform */}
          <span
            className={`block relative cursor-pointer transition-all duration-300 ${getZIndex(
              "transform"
            )}`}
            onMouseEnter={() => setHovered("transform")}
            onMouseLeave={() => setHovered(null)}
          >
            to transform
          </span>

          {/* Impact */}
          <span
            className={`block relative cursor-pointer transition-all duration-300 ${getZIndex(
              "impact"
            )}`}
            onMouseEnter={() => setHovered("impact")}
            onMouseLeave={() => setHovered(null)}
          >
            ideas into impact.
          </span>
        </h1>

        <div className="mt-20">
          <button
            className="inline-block px-10 py-4 rounded-full border border-white text-sm uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black"
          >
            Let's create something remarkable
          </button>
        </div>
      </div>
    </div>
  );
}
