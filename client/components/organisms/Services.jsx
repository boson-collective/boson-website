"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";

// === THREE FIELD ===
function EnergyField({ hoverIndex }) {
  const pointsRef = useRef();
  const count = 1000;
  const colors = ["#ffffff", "#6bb8ff", "#e66ee5", "#f5c542", "#8affb4"];

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  const colorLerp = new THREE.Color();
  const tempColor = new THREE.Color();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;

    const mat = pointsRef.current.material;
    const targetColor = tempColor.set(colors[hoverIndex % colors.length]);
    colorLerp.lerpColors(mat.color, targetColor, 0.05);
    mat.color.set(colorLerp);

    pointsRef.current.rotation.y = t * 0.08;
    mat.opacity = 0.45 + Math.sin(t * 2) * 0.15;

    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      const dx = pos[i] * 0.05;
      const dy = pos[i + 1] * 0.05;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pos[i + 2] = Math.sin(dist - t * 2) * 1.4;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={colors[hoverIndex % colors.length]}
        size={0.05}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// === MAIN SECTION ===
export default function Services() {
  const [hoverIndex, setHoverIndex] = useState(0);

  const services = [
    {
      id: "01",
      title: "Brand Architecture",
      desc: "We structure meaning, not appearance. Every identity starts from energy that demands form.",
    },
    {
      id: "02",
      title: "Digital Experience",
      desc: "We design systems that move with emotion — seamless, responsive, aware.",
    },
    {
      id: "03",
      title: "Visual Language",
      desc: "We shape universal signals — minimal, symbolic, human.",
    },
    {
      id: "04",
      title: "Cultural Engineering",
      desc: "We align creative logic with the pulse of society and time.",
    },
    {
      id: "05",
      title: "Growth Intelligence",
      desc: "We build strategies where reason and empathy accelerate evolution.",
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex overflow-hidden">
      {/* === BACKGROUND FIELD === */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 70], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 30]} intensity={1.2} />
          <EnergyField hoverIndex={hoverIndex} />
        </Canvas>
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 flex flex-col w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-40 py-24">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          <h3 className="text-xs md:text-sm uppercase text-gray-500 tracking-[0.3em] mb-6 md:mb-0">
            Services
          </h3>
          <p className="max-w-xl text-gray-300 leading-relaxed text-sm md:text-base text-right">
            Boson doesn’t provide services — we provide transformation.
            Each project is an experiment in precision, purpose, and presence.
          </p>
        </div>

        {/* TABLE */}
        <div className="divide-y divide-white/10">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="flex flex-col sm:flex-row justify-between sm:items-center py-8 cursor-pointer group"
              onHoverStart={() => setHoverIndex(i)}
              onHoverEnd={() => setHoverIndex(0)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-6 sm:gap-10 mb-4 sm:mb-0">
                <span className="text-gray-600 font-mono text-sm sm:text-base">
                  {s.id}.
                </span>
                <h4 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight group-hover:text-yellow-300 transition-colors duration-300">
                  {s.title}
                </h4>
              </div>

              <div className="flex items-center gap-6 max-w-3xl">
                <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {s.desc}
                </p>
                <motion.span
                  className="text-gray-600 group-hover:text-yellow-300 text-xl"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FOOTER */}
        <p className="mt-20 text-xs md:text-sm text-gray-500 tracking-[0.25em] uppercase text-center md:text-left">
          “Design is the crystallization of consciousness.”
        </p>
      </div>
    </section>
  );
}
