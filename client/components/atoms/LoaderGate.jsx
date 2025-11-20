'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoaderGate({ children }) {
  const [ready, setReady] = useState(false)
  const [boot, setBoot] = useState(0)

  // Simulate subtle boot messaging
  useEffect(() => {
    let step = 0
    const seq = setInterval(() => {
      step += 1
      setBoot(step)
      if (step >= 3) clearInterval(seq)
    }, 420)
  }, [])

  useEffect(() => {
    const handleReady = () => {
      setTimeout(() => setReady(true), 900) // delay for elegance
    }
    if (document.readyState === 'complete') handleReady()
    else window.addEventListener('load', handleReady)
    return () => window.removeEventListener('load', handleReady)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 bg-black z-[9999] pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* GRID SCAN LIGHT */}
            <motion.div
              className="absolute inset-0"
              initial={{ y: '60%', opacity: 0 }}
              animate={{ y: '-60%', opacity: 0.27 }}
              transition={{
                duration: 1.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.07),transparent)]" />
            </motion.div>

            {/* BOOT TEXT */}
            <div className="absolute bottom-10 left-10 text-[12px] tracking-[0.08em] font-light text-white/40">
              {boot === 0 && 'Calibrating system...'}
              {boot === 1 && 'Initializing structure...'}
              {boot === 2 && 'Preparing environment...'}
              {boot >= 3 && 'Launching Boson…'}
            </div>

            {/* SPLIT GATE */}
            {/* LEFT PANEL */}
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-black"
              initial={{ x: '0%' }}
              animate={{ x: '-100%' }}
              transition={{
                duration: 1.4,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {/* RIGHT PANEL */}
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 bg-black"
              initial={{ x: '0%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.4,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
