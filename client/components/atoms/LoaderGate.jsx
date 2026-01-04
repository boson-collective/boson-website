"use client";

import { useEffect, useState, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoaderContext = createContext(false);

export default function LoaderGate({ children }) {
  const [ready, setReady] = useState(false);
  const [boot, setBoot] = useState(0);

  // boot text sequencing
  useEffect(() => {
    let step = 0;
    const seq = setInterval(() => {
      step += 1;
      setBoot(step);
      if (step >= 3) clearInterval(seq);
    }, 420);
  }, []);

  // wait for actual page load
  useEffect(() => {
    const handleReady = () => {
      setTimeout(() => setReady(true), 900);
    };

    if (document.readyState === "complete") handleReady();
    else window.addEventListener("load", handleReady);

    return () => window.removeEventListener("load", handleReady);
  }, []);

  return (
    <LoaderContext.Provider value={ready}>
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 bg-white z-[9999] pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* SCAN LIGHT */}
            <motion.div
              className="absolute inset-0"
              initial={{ y: "60%", opacity: 0 }}
              animate={{ y: "-60%", opacity: 0.27 }}
              transition={{
                duration: 1.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.07),transparent)]" />
            </motion.div>

            {/* BOOT TEXT */}
            <div className="absolute bottom-10 left-10 text-[12px] tracking-[0.08em] font-light text-black/40">
              {boot === 0 && "Calibrating system..."}
              {boot === 1 && "Initializing structure..."}
              {boot === 2 && "Preparing environment..."}
              {boot >= 3 && "Launching BOSON"}
            </div>
 
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children fade in AFTER loader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </LoaderContext.Provider>
  );
}
