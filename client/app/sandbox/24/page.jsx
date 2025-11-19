"use client"

import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      // radius jauh di luar layar → cahaya hanya nongol di pinggiran
      const offsetX = 50 + Math.sin(y * 0.003) * 120; 
      const offsetY = 50 + Math.cos(y * 0.003) * 120;

      document.documentElement.style.setProperty("--gx", `${offsetX}%`);
      document.documentElement.style.setProperty("--gy", `${offsetY}%`);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          height: 100%;
        }

        body {
          min-height: 1000vh;

          /* RADIAL OFF-CENTER → LIGHT SPILL HANYA DI TEPI */
          background: radial-gradient(
            160% 160% at var(--gx, 200%) var(--gy, 200%),
            #3a3a3a 0%,
            #1a1a1a 25%,
            #0a0a0a 60%,
            #000 100%
          );

          background-attachment: fixed;
          transition: background 0.25s ease-out;
        }

        .content {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-family: sans-serif;
        }
      `}</style>

      <div className="content"> 
      </div>
    </>
  );
}
