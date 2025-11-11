'use client'

import dynamic from "next/dynamic"; 
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import HeroPage from '../../components/organisms/HeroPage'
import WhyBoson from '../../components/organisms/WhyBoson'
import WhoWeAre from '../../components/organisms/WhoWeAre'
import BosonWorld from '../../components/organisms/WorldOfBoson'
import Beginning from '../sandbox/13/page'

// Import dengan SSR false karena GSAP & WebGL jalan di client
const SoleNoir = dynamic(() => import("../../components/organisms/SoleNoir"), {
  ssr: false,
});
const GradientPage = dynamic(() => import("../../components/organisms/GradientPage"), {
  ssr: false,
});

export default function Page() {
  const soleRef = useRef(null);
  const gradRef = useRef(null);
  const masterTl = useRef(null);

  useEffect(() => {
    gsap.set(gradRef.current, { autoAlpha: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    const onSoleNoirComplete = () => {
      // Fade out hanya elemen latar, bukan logo
      tl.to([soleRef.current.glowEl, soleRef.current.blackEl], {
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.inOut",
      })
        // Munculkan gradientPage dengan overlap cepat
        .to(gradRef.current, { autoAlpha: 1, duration: 1 }, "-=1.5")
        // Pastikan logo tetap di atas
        .set(soleRef.current.logoEl, { zIndex: 50 });
    };

    window.addEventListener("soleNoirComplete", onSoleNoirComplete);
    masterTl.current = tl;

    return () => {
      window.removeEventListener("soleNoirComplete", onSoleNoirComplete);
      tl.kill();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-10">
        <SoleNoir ref={soleRef} />
      </div>
      <div ref={gradRef} className="absolute inset-0 z-0">
        <GradientPage />
      </div>
    </main>
  );
}





