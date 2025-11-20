"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, Html } from "@react-three/drei";
import * as THREE from "three";



/* ===========================================================
   LIGHT SWEEP SHADER — BOSON ENGINE V2
   - breathing curve
   - dual-layer sweep
   - subtle pulse spine
=========================================================== */
const LightSweepMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uEnergy: { value: 0 },
    uWidthSoft: { value: 0.45 },
    uWidthPulse: { value: 2.8 },
    uIntensitySoft: { value: 0.9 },
    uIntensityPulse: { value: 1.65 },
  },
  vertexShader: `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vPos;
    uniform float uTime;
    uniform float uEnergy;
    uniform float uWidthSoft;
    uniform float uWidthPulse;
    uniform float uIntensitySoft;
    uniform float uIntensityPulse;

    void main() {

      // --- engine breathing modulation ---
      float breathe = sin(uTime * 0.8) * 0.07;

      // --- sweep position ---
      float sweep = mix(-20.0, 20.0, uEnergy + breathe);

      // distance
      float dist = abs(vPos.y - sweep);

      // --- Soft Layer (wide body) ---
      float softGlow = exp(-dist * uWidthSoft) * uIntensitySoft;

      // --- Pulse Layer (thin spine) ---
      float pulse = exp(-dist * uWidthPulse) * uIntensityPulse;

      // combine
      float glow = softGlow + pulse * 0.35;

      gl_FragColor = vec4(vec3(glow), glow);
    }
  `,
  transparent: true,
};



/* ===========================================================
   HOOK: SCROLL → ENERGY (0 → 1)
=========================================================== */
function useSectionEnergy(ref) {
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // section mulai terlihat = rect.top <= vh
      // section lewat total = rect.bottom <= 0

      const visible =
        rect.top <= vh && rect.bottom >= 0;

      if (!visible) {
        setEnergy(0);
        return;
      }

      // progress scroll di dalam section
      const total = rect.height + vh;
      const scrolled = vh - rect.top;

      let t = scrolled / total;
      t = Math.min(Math.max(t, 0), 1);

      setEnergy(t);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);

  return energy;
}


/* ===========================================================
   GRID BASE (SEGMENTED — CALM STRUCTURE)
=========================================================== */
function GridPlane({ energy }) {
  const matRef = useRef();

  const size = 20;
  const step = 2;

  const geom = useMemo(() => {
    const lines = [];
    for (let i = -size; i <= size; i += step) {
      // horizontal
      lines.push(
        new THREE.Vector3(-size, i, 0),
        new THREE.Vector3(size, i, 0)
      );
      // vertical
      lines.push(
        new THREE.Vector3(i, -size, 0),
        new THREE.Vector3(i, size, 0)
      );
    }
    return new THREE.BufferGeometry().setFromPoints(lines);
  }, [size, step]);

  useFrame(() => {
    if (!matRef.current) return;
    const base = 0.04;
    const boost = 0.22 * energy;
    matRef.current.opacity = base + boost;
  });

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial
        ref={matRef}
        color="white"
        opacity={0.05}
        transparent
      />
    </lineSegments>
  );
}

/* ===========================================================
   GLOW LINE — NOW WITH BOSON LIGHT SWEEP SHADER
=========================================================== */
function GlowLine({ start, end, energy }) {
  const matRef = useRef();
  const smoothed = useRef(0);

  const geom = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start[0], start[1], start[2] ?? 0),
      new THREE.Vector3(end[0], end[1], end[2] ?? 0),
    ]);
  }, [start, end]);

  useFrame((state) => {
    if (!matRef.current) return;

    const t = state.clock.getElapsedTime();

    // inertia smoothing
    smoothed.current = THREE.MathUtils.lerp(
      smoothed.current,
      energy,
      0.06
    );

    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uEnergy.value = smoothed.current;
  });

  return (
    <line geometry={geom}>
      <shaderMaterial
        ref={matRef}
        args={[LightSweepMaterial]}
        transparent
      />
    </line>
  );
}



/* ===========================================================
   GRID GLOW LAYER — ONLY VERTICAL LINES HAVE LIGHT SWEEP
=========================================================== */
function GridGlow({ energy }) {
  const size = 20;
  const step = 4;

  const horizontals = [];
  const verticals = [];

  for (let y = -size; y <= size; y += step) {
    horizontals.push([
      [-size, y, 0],
      [size, y, 0],
    ]);
  }

  for (let x = -size; x <= size; x += step) {
    verticals.push([
      [x, -size, 0],
      [x, size, 0],
    ]);
  }

  return (
    <group>

      {/* ======================
          HORIZONTAL = STATIC
         ====================== */}
      {horizontals.map(([start, end], idx) => (
        <line key={`h-${idx}`}
          geometry={
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(start[0], start[1], 0),
              new THREE.Vector3(end[0], end[1], 0),
            ])
          }
        >
          <lineBasicMaterial
            color="white"
            opacity={0.06}
            transparent
          />
        </line>
      ))}

      {/* ======================
          VERTICAL = LIGHT SWEEP
         ====================== */}
      {verticals.map(([start, end], idx) => (
        <GlowLine
          key={`v-${idx}`}
          start={start}
          end={end}
          energy={energy}
        />
      ))}

    </group>
  );
}

  
 

/* ===========================================================
   LOOP GLOW (LIGHT RUNNER ELEGANT)
=========================================================== */
function LoopGlow({ energy }) {
  const loopRefL = useRef();
  const loopRefR = useRef();
  const matL = useRef();
  const matR = useRef();

  const geom = useMemo(() => {
    const ellipse = new THREE.EllipseCurve(
      0,
      0,
      3.8,
      7.2,
      0,
      Math.PI * 2,
      false,
      0
    ).getPoints(320);

    return new THREE.BufferGeometry().setFromPoints(
      ellipse.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
  }, []);

  useEffect(() => {
    if (loopRefL.current) loopRefL.current.computeLineDistances();
    if (loopRefR.current) loopRefR.current.computeLineDistances();
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const offset = -(t * 0.16 + energy * 1.0);

    if (matL.current) {
      matL.current.dashOffset = offset;
      matL.current.needsUpdate = true;
      matL.current.opacity = 0.14 + energy * 0.35;
    }
    if (matR.current) {
      matR.current.dashOffset = offset;
      matR.current.needsUpdate = true;
      matR.current.opacity = 0.14 + energy * 0.35;
    }
  });

  return (
    <>
      <lineLoop ref={loopRefL} geometry={geom} position={[-6, 0, 0]}>
        <lineDashedMaterial
          ref={matL}
          color="white"
          transparent
          dashSize={0.32}
          gapSize={3.6}
        />
      </lineLoop>

      <lineLoop ref={loopRefR} geometry={geom} position={[6, 0, 0]}>
        <lineDashedMaterial
          ref={matR}
          color="white"
          transparent
          dashSize={0.32}
          gapSize={3.6}
        />
      </lineLoop>
    </>
  );
}

 

/* ===========================================================
   SCENE WRAPPER
=========================================================== */
function MethodScene({ energy }) {
  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={50} />

      {/* base structure */}
      <GridPlane energy={energy} />

      {/* glow layers */}
      <GridGlow energy={energy} />
      <LoopGlow energy={energy} />

    </>
  );
}

/* ===========================================================
   FINAL SECTION EXPORT
=========================================================== */
export default function MethodV3() {
  const sectionRef = useRef(null);
  const energy = useSectionEnergy(sectionRef);

  const steps = [
    {
      id: 1,
      title: "Observe",
      text: "Collect signals and context — qualitative user cues, market friction, and constraints.",
    },
    {
      id: 2,
      title: "Construct",
      text: "Define scaffolding and rules — the architecture that will guide production and decisions.",
    },
    {
      id: 3,
      title: "Design",
      text: "Encode behavior into assets and systems — visual rules, interaction grammar, content recipes.",
    },
    {
      id: 4,
      title: "Operate",
      text: "Run, measure, iterate, scale — the machine executes; we refine the system by data.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full text-white py-52 px-6 md:px-20 overflow-hidden"
    >
      {/* THREE.JS MIDGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.75]">
        <Canvas>
          <MethodScene energy={energy} />
        </Canvas>
      </div>
  
      {/* DARKEN TOP EDGE ONLY */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-black/70 to-transparent" />
      </div>
  
      {/* FOREGROUND CONTENT */}
      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-32">
          <h2 className="text-[3rem] md:text-[3.6rem] font-extralight tracking-[-0.03em] text-white/90">
            The System Behind Boson
          </h2>
          <p className="text-gray-500 mt-4 max-w-[68ch] mx-auto text-[15px]">
            Structure → Behavior → Iteration. A calm, systemic engine beneath
            every output.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mt-28">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`space-y-3 ${
                i === 1
                  ? "translate-y-8"
                  : i === 2
                  ? "-translate-y-6"
                  : i === 3
                  ? "translate-y-3"
                  : ""
              }`}
            >
              <div className="text-[3.4rem] font-extralight text-white/70 tracking-[-0.05em] leading-none">
                {s.id}
              </div>
              <div className="text-xl font-light text-white/90 tracking-[-0.01em]">
                {s.title}
              </div>
              <p className="text-gray-400 text-[14px] max-w-[26ch] leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>
  
        <div className="mt-24 text-center">
          <a href="/method" className="text-gray-300 text-sm underline">
            View Full Methodology →
          </a>
        </div>
      </div>
    </section>
  );
  
  
}
