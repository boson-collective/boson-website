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
import Team from '../../components/organisms/Team'
import WhyBoson from '../../components/organisms/WhyBoson'
const WhoWeAre = dynamic(() => import('../../components/organisms/WhoWeAre'), { ssr: false })
import BosonWorld from '../../components/organisms/WorldOfBoson'
import HeroPage2 from '../../components/organisms/HeroPage2'
import Clients from '../../components/organisms/Clients'
import Services from '../../components/organisms/Services'
const SoleNoir = dynamic(() => import("../../components/organisms/SoleNoir"), { ssr: false });
import Beginning from '../sandbox/13/page'

import Chadash from '../sandbox/29/page'

export default function Page() {
  return (
    <>
    <Chadash/>
    </>
  )
}
