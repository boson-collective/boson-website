'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'

export default function WhoWeAre() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState([])
  const [time, setTime] = useState(0)

  useAnimationFrame((t) => setTime(t / 1000))

  useEffect(() => {
    const generated = Array.from({ length: 40 }).map(() => ({
      cx: Math.random() * 1920,
      cy: Math.random() * 1080,
      r: Math.random() * 2 + 0.5,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 3,
    }))
    setParticles(generated)

    const updateDimensions = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    updateDimensions()

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', updateDimensions)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [mouseX, mouseY])

  const rotateX = useTransform(mouseY, [0, dimensions.height || 1], [8, -8])
  const rotateY = useTransform(mouseX, [0, dimensions.width || 1], [-8, 8])

  const orbits = [
    { radius: 360, speed: 0.1, count: 4 },
    { radius: 520, speed: 0.07, count: 5 },
    { radius: 700, speed: 0.05, count: 6 },
  ]

  const imageBands = [
    'https://images.unsplash.com/photo-1707058665477-560297ffe913?auto=format&fit=crop&q=60&w=900',
    'https://images.unsplash.com/photo-1736590559824-17b0962c94c1?auto=format&fit=crop&q=60&w=900',
    'https://images.unsplash.com/photo-1634662463723-187914625f50?auto=format&fit=crop&q=60&w=900',
  ]

  return (
    <motion.section
      className="relative w-full min-h-screen overflow-hidden bg-black text-white flex flex-col justify-center px-10 md:px-14 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800" />

      {/* Orbit Background */}
      <motion.div style={{ rotateX, rotateY }} className="absolute inset-0 opacity-70 will-change-transform">
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="softLight" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="circleStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>

          <rect width="1920" height="1080" fill="url(#softLight)" />
          {orbits.map((o, i) => (
            <circle
              key={i}
              cx="960"
              cy="540"
              r={o.radius}
              fill="none"
              stroke="url(#circleStroke)"
              strokeWidth="0.8"
              filter="drop-shadow(0 0 6px rgba(255,255,255,0.15))"
            />
          ))}

          <g>
            {particles.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="rgba(255,255,255,0.12)"
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
              />
            ))}
          </g>

          <g>
            {orbits.map((orbit, oi) => {
              const { radius, speed, count } = orbit
              const nodes = Array.from({ length: count }).map((_, i) => {
                const angle = time * speed + (i * (Math.PI * 2)) / count
                const x = 960 + Math.cos(angle) * radius
                const y = 540 + Math.sin(angle) * radius
                return { x, y, id: `${oi}-${i}` }
              })
              return nodes.map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill="rgba(255,255,255,0.25)"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.2))' }}
                />
              ))
            })}
          </g>
        </svg>
      </motion.div>

      {/* Foreground Content */}
      <motion.div
        className="relative z-10 space-y-10 max-w-8xl mx-auto text-left"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 0.5, ease: 'easeOut' }}
      >
        <div className="space-y-4 text-[6rem] md:text-[7rem] font-light leading-[0.95] tracking-wide w-full">
          {/* Line 1 */}
          <div className="flex items-center justify-between w-full gap-4">
            <span className="flex-[1.3]">WE ARE A COLLECTIVE</span>
            <div className="flex-[1.7] h-[110px] overflow-hidden">
              <img src={imageBands[0]} className="w-full h-full object-cover opacity-90" />
            </div>
          </div>

          {/* Line 2 */}
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex-[1.4] h-[110px] overflow-hidden">
              <img src={imageBands[1]} className="w-full h-full object-cover opacity-90" />
            </div>
            <span className="flex-[1.6] text-right">OF CONSCIOUS CREATORS</span>
          </div>

          {/* Line 3 */}
          <div className="flex items-center justify-between w-full gap-4">
            <span className="flex-[1.4]">CRAFTING POSSIBILITY</span>
            <div className="flex-[1.6] h-[120px] overflow-hidden">
              <img src={imageBands[2]} className="w-full h-full object-cover opacity-90" />
            </div>
          </div>
        </div>

        <div className="w-full border-b border-neutral-700 mt-12 mb-6 opacity-50" />

        <div className="text-sm md:text-base text-gray-300 max-w-md ml-auto text-right">
          <p className="uppercase tracking-[0.2em] text-gray-400 mb-3">
            A safe space for independent thinkers
          </p>
          <p>
            Boson is a collective that empowers conscious creators to merge reason and emotion,
            structure and intuition. We believe true design is not aesthetic — it’s awareness made visible.
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
