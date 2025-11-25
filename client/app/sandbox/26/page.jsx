"use client"
 
import { useEffect, useRef, useState } from "react"

/* helper (redeclared for JSX usage) */
function polar(r, deg) {
  const rad = (deg * Math.PI) / 180
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r }
}

function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.2 + 0.04,
        size: Math.random() * 1.2 + 0.2,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 15, 25, 0.98)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.opacity += (Math.random() - 0.5) * 0.015

        if (p.opacity < 0.04) p.opacity = 0.04
        if (p.opacity > 0.25) p.opacity = 0.25

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.fillStyle = `rgba(242, 242, 242, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}


function Hero() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const circles = svg.querySelectorAll("circle")
          circles.forEach((circle, i) => {
            circle.style.strokeDasharray = `${circle.r.baseVal.value * 2 * Math.PI}`
            circle.style.strokeDashoffset = `${circle.r.baseVal.value * 2 * Math.PI}`
            circle.style.animation = `drawCircle 3s linear ${i * 0.4}s forwards`
          })
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(svg)

    const style = document.createElement("style")
    style.textContent = `
      @keyframes drawCircle {
        to { stroke-dashoffset: 0; }
      }
    `
    document.head.appendChild(style)

    return () => {
      observer.disconnect()
      style.remove()
    }
  }, [])

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* LAYER_1: BACKGROUND_FIELD - particle drift with magnetic distortion */}
      <div
        data-layer="1"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(10, 166, 160, 0.02) 0%, transparent 70%)",
          opacity: 0.8,
        }}
      />

      {/* LAYER_2: SACRED GEOMETRY OVERLAY - 2x size, behind content */}
      <svg
        ref={svgRef}
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.1,
          zIndex: 1,
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(720,450)">
          {/* LARGE 3 orbit rings (2x scale) */}
          <circle r="360" stroke="#0aa6a0" strokeWidth="1.2" fill="none" />
          <circle r="280" stroke="#0aa6a0" strokeWidth="0.8" fill="none" opacity="0.6" />
          <circle r="180" stroke="#0aa6a0" strokeWidth="0.6" fill="none" opacity="0.4" />

          {/* Diagonal axis lines + radial geometry */}
          <line x1="-420" y1="0" x2="420" y2="0" stroke="#0aa6a0" strokeWidth="0.6" opacity="0.2" />
          <line x1="0" y1="-420" x2="0" y2="420" stroke="#0aa6a0" strokeWidth="0.6" opacity="0.2" />
          <line x1="-300" y1="-300" x2="300" y2="300" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.15" />
          <line x1="-300" y1="300" x2="300" y2="-300" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.15" />

          {/* Pentagonal core - large */}
          <polygon
            points="0,-140 133,-44 82,114 -82,114 -133,-44"
            stroke="#0aa6a0"
            strokeWidth="1.2"
            fill="none"
            opacity="0.25"
          />

          {/* Inner pentagonal ring */}
          <polygon
            points="0,-60 57,-19 35,49 -35,49 -57,-19"
            stroke="#0aa6a0"
            strokeWidth="0.6"
            fill="none"
            opacity="0.15"
          />

          {/* Radial spokes for emphasis */}
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 200
            const y = Math.sin(rad) * 200
            return <line key={angle} x1="0" y1="0" x2={x} y2={y} stroke="#0aa6a0" strokeWidth="0.3" opacity="0.1" />
          })}
        </g>
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT - in front of geometry */}
      <div
        data-layer="3"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "1440px", width: "100%", padding: "0 32px", textAlign: "center" }}>
          {/* Supertag */}
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "rgba(230, 238, 240, 0.4)",
                border: "1px solid rgba(10, 166, 160, 0.2)",
                padding: "8px 24px",
                textTransform: "uppercase",
              }}
            >
              Quantum Ritual Chamber
            </div>
          </div>

          {/* H1 Title */}
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginBottom: "32px",
              color: "#e6eef0",
              lineHeight: 1.1,
            }}
          >
            BOSON
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 300,
              marginBottom: "32px",
              color: "rgba(230, 238, 240, 0.7)",
              maxWidth: "720px",
              margin: "0 auto 32px",
              lineHeight: 1.4,
            }}
          >
            A Method to Reengineer Human Existence
          </h2>

          {/* Descriptive line */}
          <p
            style={{
              fontSize: "16px",
              textAlign: "center",
              color: "rgba(230, 238, 240, 0.5)",
              maxWidth: "560px",
              margin: "0 auto 64px",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            A disciplined framework for structuring ambition, intention, and human direction.
          </p>

          {/* CTA Group - rectilinear buttons */}
          <div
            style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "64px", flexWrap: "wrap" }}
          >
            <button
              style={{
                padding: "12px 32px",
                border: "1px solid #0aa6a0",
                background: "#0aa6a0",
                color: "#05080b",
                fontSize: "12px",
                letterSpacing: "0.08em",
                fontWeight: 300,
                cursor: "pointer",
              }}
            >
              ENTER FRAMEWORK
            </button>
            <button
              style={{
                padding: "12px 32px",
                border: "1px solid rgba(10, 166, 160, 0.3)",
                background: "transparent",
                color: "#e6eef0",
                fontSize: "12px",
                letterSpacing: "0.08em",
                fontWeight: 300,
                cursor: "pointer",
              }}
            >
              VIEW AXIOMS
            </button>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.3,
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="#e6eef0" strokeWidth="0.8">
              <path d="M12 4v16" />
              <path d="M4 20l8 8 8-8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

function Manifesto() {
  const directives = [
    "Reduksi sebelum arah.",
    "Waktu menentukan geometri.",
    "Energi itu terbatas.",
    "Struktur adalah bentuk setia pada masa depan.",
    "Teknologi tunduk pada manusia.",
  ]
 
  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_1: BACKGROUND_FIELD */}
      <div data-layer="1" />
 
      {/* LAYER_2: BLUEPRINT_OVERLAY */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.08,
        }}
        preserveAspectRatio="none"
      >
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#0aa6a0"
          strokeWidth="0.5"
          strokeDasharray="4,4"
          opacity="0.3"
        />
        <line x1="0" y1="0" x2="100%" y2="0" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.2" />
        <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.2" />
 
        {/* Horizontal reference lines between items */}
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="48%" y1={`${y}%`} x2="52%" y2={`${y}%`} stroke="#0aa6a0" strokeWidth="0.3" opacity="0.15" />
        ))}
      </svg>
 
      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(232, 240, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Quantum Directives
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2, textTransform: "uppercase" }}>
            Micro Manifesto
          </h2>
        </div>
 
        {/* Directive stack - blueprint bullets */}
        <div style={{ maxWidth: "720px", borderLeft: "0.5px solid rgba(10, 166, 160, 0.2)", paddingLeft: "24px" }}>
          {directives.map((directive, idx) => (
            <div
              key={idx}
              style={{
                paddingBottom: "24px",
                marginBottom: "24px",
                borderBottom: idx < directives.length - 1 ? "0.5px dashed rgba(10, 166, 160, 0.15)" : "none",
                transition: "all 900ms linear 300ms",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget).style.background = "rgba(10, 166, 160, 0.03)"
                const p = e.currentTarget.querySelector("p") 
                if (p) p.style.color = "rgba(10, 166, 160, 0.9)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget).style.background = "transparent"
                const p = e.currentTarget.querySelector("p") 
                if (p) p.style.color = "#e8f0f0"
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  background: "rgba(10, 166, 160, 0.4)",
                  border: "0.5px solid #0aa6a0",
                  marginTop: "7px",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: "18px",
                  color: "#e8f0f0",
                  lineHeight: 1.6,
                  fontWeight: 300,
                  margin: 0,
                  transition: "all 900ms linear 300ms",
                }}
              >
                {directive}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
 }

 function Framework() {
  const [expanded, setExpanded] = useState(null)

  const layers = [
    {
      level: "LAYER 1",
      name: "The Lens",
      principle: "Causality, systems, time, human-nature logic",
      elements: ["Causality", "Systems Theory", "Temporal Dynamics", "Human Nature Logic"],
    },
    {
      level: "LAYER 2",
      name: "The Method",
      principle: "Reduction, constraints, leverage, temporal positioning",
      elements: ["Reduction", "Constraint Geometry", "Asymmetric Leverage", "Temporal Positioning"],
    },
    {
      level: "LAYER 3",
      name: "The Practice",
      principle: "Branding, architecture, writing, negotiation, product",
      elements: ["Branding", "Architecture", "Writing", "Negotiation", "Product Design"],
    },
  ]

  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_2: BLUEPRINT_OVERLAY */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.08,
        }}
        preserveAspectRatio="none"
      >
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.25" />
        <circle cx="50%" cy="25%" r="2" fill="none" stroke="#0aa6a0" strokeWidth="0.3" opacity="0.2" />
        <circle cx="50%" cy="50%" r="2" fill="none" stroke="#0aa6a0" strokeWidth="0.3" opacity="0.2" />
        <circle cx="50%" cy="75%" r="2" fill="none" stroke="#0aa6a0" strokeWidth="0.3" opacity="0.2" />
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(232, 240, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Tri-Layer Engineering Diagram
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2, textTransform: "uppercase" }}>Framework</h2>
        </div>

        <div style={{ border: "1px solid rgba(10, 166, 160, 0.2)" }}>
          {layers.map((layer, idx) => (
            <div
              key={idx}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              style={{
                borderBottom: idx < layers.length - 1 ? "1px solid rgba(10, 166, 160, 0.2)" : "none",
                padding: "32px",
                cursor: "pointer",
                transition: "all 900ms linear 300ms",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget).style.background = "rgba(10, 166, 160, 0.05)"
                ;(e.currentTarget).style.borderColor = "rgba(10, 166, 160, 0.4)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget).style.background = "transparent"
                ;(e.currentTarget).style.borderColor = "rgba(10, 166, 160, 0.2)"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "8px",
                  fontSize: "9px",
                  color: "rgba(10, 166, 160, 0.15)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                x{idx + 1}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      color: "rgba(10, 166, 160, 0.35)",
                      textTransform: "uppercase",
                    }}
                  >
                    {layer.level}
                  </span>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: 300,
                      marginTop: "8px",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {layer.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(232, 240, 240, 0.4)", fontWeight: 300 }}>
                    {layer.principle}
                  </p>
                </div>
                <div style={{ fontSize: "32px", fontWeight: 300, color: "rgba(232, 240, 240, 0.08)" }}>
                  {String(idx + 1)}
                </div>
              </div>

              {/* Element tags - blueprint micro-diagrams */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
                {layer.elements.map((el, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "11px",
                      padding: "8px 12px",
                      border: "1px solid rgba(10, 166, 160, 0.25)",
                      color: "rgba(232, 240, 240, 0.45)",
                      transition: "all 900ms linear 300ms",
                    }}
                  >
                    {el}
                  </span>
                ))}
              </div>

              {expanded === idx && (
                <div
                  style={{ marginTop: "24px", paddingTop: "24px", borderTop: "0.5px dashed rgba(10, 166, 160, 0.1)" }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "rgba(232, 240, 240, 0.45)",
                      lineHeight: 1.6,
                      fontWeight: 300,
                      maxWidth: "720px",
                    }}
                  >
                    This layer integrates {layer.elements.join(", ")} into a unified operational model.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function MethodPreview() {
  const kernels = [
    { name: "Pattern Locking", mechanic: "Reveal underlying geometry in problems" },
    { name: "Structural Reduction", mechanic: "Strip complexity to essential forces" },
    { name: "Intent Vectoring", mechanic: "Align intention with directional flow" },
    { name: "Constraint Geometry", mechanic: "Use limits as generative force" },
    { name: "Temporal Positioning", mechanic: "Align action with temporal dynamics" },
    { name: "Dimensional Mapping", mechanic: "Chart system topology and field dynamics" },
  ]

  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_2: BLUEPRINT_OVERLAY - gridlines inside panels */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.05,
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="panelGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="40" y2="0" stroke="#0aa6a0" strokeWidth="0.3" />
            <line x1="0" y1="0" x2="0" y2="40" stroke="#0aa6a0" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#panelGrid)" />
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(232, 240, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Tactical Kernel Grid
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2, textTransform: "uppercase" }}>
            Method Preview
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            border: "1px solid rgba(10, 166, 160, 0.2)",
          }}
        >
          {kernels.map((kernel, idx) => (
            <div
              key={idx}
              style={{
                padding: "32px 24px",
                borderRight: idx % 3 !== 2 ? "1px solid rgba(10, 166, 160, 0.2)" : "none",
                borderBottom: idx < 3 ? "1px solid rgba(10, 166, 160, 0.2)" : "none",
                transition: "all 900ms linear 300ms",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget).style.background = "rgba(10, 166, 160, 0.06)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget).style.background = "transparent"
              }}
            >
              <div
                style={{
                  marginBottom: "16px",
                  width: "24px",
                  height: "24px",
                  position: "relative",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="2" y1="8" x2="22" y2="8" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.3" />
                  <line x1="2" y1="12" x2="22" y2="12" stroke="#0aa6a0" strokeWidth="1" opacity="0.5" />
                  <line x1="2" y1="16" x2="22" y2="16" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.3" />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="#0aa6a0" strokeWidth="1" opacity="0.6" />
                </svg>
              </div>
              <h3 style={{ fontSize: "13px", fontWeight: 300, marginBottom: "8px", textTransform: "uppercase" }}>
                {kernel.name}
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(232, 240, 240, 0.45)", lineHeight: 1.6, fontWeight: 300 }}>
                {kernel.mechanic}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FieldsOfPractice() {
  // 8 sectors as specified
  const sectors = [
    "System Architecture",
    "Decision Geometry",
    "Narrative Mechanics",
    "Network Dynamics",
    "Cognitive Positioning",
    "Human-Ambition Systems",
    "Vector Intelligence",
    "Structural Evolution",
  ]

  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_2: BLUEPRINT_OVERLAY - Star-map grid field */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.08,
        }}
        preserveAspectRatio="none"
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#0aa6a0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(230, 238, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Sector Navigation Map
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2 }}>Fields of Practice</h2>
        </div>

        {/* Sector map layout - NOT a grid table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            border: "1px solid rgba(10, 166, 160, 0.2)",
            background: "rgba(10, 166, 160, 0.02)",
          }}
        >
          {sectors.map((sector, idx) => (
            <div
              key={idx}
              style={{
                padding: "48px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "180px",
                border: "1px solid rgba(10, 166, 160, 0.15)",
                position: "relative",
                transition: "all 900ms linear 300ms",
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = "rgba(10, 166, 160, 0.06)"
                el.style.borderColor = "rgba(10, 166, 160, 0.4)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = "transparent"
                el.style.borderColor = "rgba(10, 166, 160, 0.15)"
              }}
            >
              {/* Coordinate marker in corner */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "4px",
                  height: "4px",
                  background: "rgba(10, 166, 160, 0.3)",
                  border: "1px solid rgba(10, 166, 160, 0.2)",
                }}
              />

              {/* Sector label - centered inside block */}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "#e6eef0",
                  lineHeight: 1.4,
                  letterSpacing: "0.02em",
                }}
              >
                {sector}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom legend */}
        <div
          style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(10, 166, 160, 0.1)",
            display: "flex",
            gap: "48px",
            fontSize: "11px",
            color: "rgba(230, 238, 240, 0.3)",
            letterSpacing: "0.05em",
          }}
        >
          <div>SECTORS: 8</div>
          <div>TOPOLOGY: Star-Map Navigation Field</div>
          <div>STATUS: Active Deployment</div>
        </div>
      </div>
    </section>
  )
}

function BosonSignature() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elements = svg.querySelectorAll("circle, line, polygon")
          elements.forEach((el, i) => {
            const el_ = el
            el_.style.strokeDasharray = "500"
            el_.style.strokeDashoffset = "500"
            el_.style.animation = `drawStroke 2.8s ease-in-out ${i * 0.15}s forwards`
          })
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(svg)

    const style = document.createElement("style")
    style.textContent = `
      @keyframes drawStroke {
        to { stroke-dashoffset: 0; }
      }
    `
    document.head.appendChild(style)

    return () => {
      observer.disconnect()
      style.remove()
    }
  }, [])

  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px", minHeight: "560px" }}>
      {/* LAYER_2: BLUEPRINT_OVERLAY */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.1,
        }}
        preserveAspectRatio="none"
      >
        <circle cx="50%" cy="50%" r="300" fill="none" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.25" />
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(232, 240, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Sacred Geometry Core
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2, textTransform: "uppercase" }}>
            Boson Signature
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "128px" }}>
          <svg ref={svgRef} width="480" height="480" viewBox="0 0 480 480" style={{ maxWidth: "100%", height: "auto" }}>
            <g transform="translate(240,240)">
              {/* Orbital rings - increased opacity */}
              <circle cx="0" cy="0" r="200" fill="none" stroke="#0aa6a0" strokeWidth="1" opacity="0.35" />
              <circle cx="0" cy="0" r="150" fill="none" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.28" />
              <circle cx="0" cy="0" r="100" fill="none" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.22" />

              {/* Secondary rings - NEW */}
              <circle
                cx="0"
                cy="0"
                r="175"
                fill="none"
                stroke="#0aa6a0"
                strokeWidth="0.4"
                opacity="0.12"
                strokeDasharray="2,3"
              />
              <circle
                cx="0"
                cy="0"
                r="125"
                fill="none"
                stroke="#0aa6a0"
                strokeWidth="0.4"
                opacity="0.12"
                strokeDasharray="2,3"
              />

              {/* Pentagon geometry */}
              <polygon
                points="0,-80 75,-25 46,65 -46,65 -75,-25"
                fill="none"
                stroke="#0aa6a0"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="70" fill="none" stroke="#0aa6a0" strokeWidth="1.2" opacity="0.95" />
              <circle cx="0" cy="0" r="95" fill="none" stroke="#0aa6a0" strokeWidth="0.5" opacity="0.15" />
              <circle cx="0" cy="0" r="120" fill="none" stroke="#0aa6a0" strokeWidth="0.5" opacity="0.1" />

              {/* Coordinate axes + radial measurement lines - NEW */}
              <line x1="0" y1="-220" x2="0" y2="220" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.55" />
              <line x1="-220" y1="0" x2="220" y2="0" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.55" />
              <line x1="-155" y1="-155" x2="155" y2="155" stroke="#0aa6a0" strokeWidth="0.6" opacity="0.35" />
              <line x1="155" y1="-155" x2="-155" y2="155" stroke="#0aa6a0" strokeWidth="0.6" opacity="0.35" />

              {/* Tick marks around circle - NEW */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                const rad = (angle * Math.PI) / 180
                const x1 = Math.cos(rad) * 210
                const y1 = Math.sin(rad) * 210
                const x2 = Math.cos(rad) * 225
                const y2 = Math.sin(rad) * 225
                return (
                  <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0aa6a0" strokeWidth="0.5" opacity="0.2" />
                )
              })}

              {/* Inner pentagonal lattice - NEW */}
              {[0, 72, 144, 216, 288].map((angle) => {
                const rad = (angle * Math.PI) / 180
                const x = Math.cos(rad) * 90
                const y = Math.sin(rad) * 90
                return (
                  <g key={angle}>
                    <circle cx={x} cy={y} r="3" fill="none" stroke="#0aa6a0" strokeWidth="0.4" opacity="0.15" />
                    <line x1="0" y1="0" x2={x} y2={y} stroke="#0aa6a0" strokeWidth="0.3" opacity="0.08" />
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Classification label */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "720px",
            margin: "0 auto",
            borderTop: "1px solid rgba(10, 166, 160, 0.15)",
            paddingTop: "48px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "rgba(232, 240, 240, 0.45)",
              marginBottom: "32px",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            The unified geometric field for intention, structure, and systemic causality.
          </p>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "rgba(232, 240, 240, 0.25)",
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            BOSON SIG/PRIME_01 — Classified experimental geometry
          </p>
        </div>
      </div>
    </section>
  )
}

function DHNNInfinityDiagram() {
  const svgRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const paths = svg.querySelectorAll('path, circle, line')
    paths.forEach((p) => {
      // prepare strokes for draw animation
      if (p.tagName === 'path' || p.tagName === 'circle' || p.tagName === 'line') {
        const length = (p.getTotalLength && p.getTotalLength()) || 500
        p.style.strokeDasharray = length
        p.style.strokeDashoffset = length
        p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.9,.2,1)'
      }
    })

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // stagger reveal
            paths.forEach((p, i) => {
              const delay = i * 120
              setTimeout(() => {
                p.style.strokeDashoffset = '0'
                p.style.opacity = p.getAttribute('data-target-opacity') || 1
              }, delay)
            })
            obs.disconnect()
          }
        })
      },
      { threshold: 0.25 }
    )

    obs.observe(svg)

    // subtle breathing for the whole block (soft pulse)
    const el = wrapperRef.current
    let raf = null
    let t = 0
    function pulse() {
      t += 0.01
      const op = 0.04 + Math.sin(t) * 0.01
      if (el) el.style.setProperty('--bg-overlay-opacity', op.toString())
      raf = requestAnimationFrame(pulse)
    }
    raf = requestAnimationFrame(pulse)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  // geometry helper for ticks/arrows
  const polar = (r, deg) => {
    const rad = (deg * Math.PI) / 180
    return { x: Math.cos(rad) * r, y: Math.sin(rad) * r }
  }

  // local image path from user's uploaded file (kept as subtle overlay reference)
  const referenceImage = '/mnt/data/Screenshot 2025-11-20 at 20.14.29.png'

  return (
    <section
      ref={wrapperRef}
      style={{
        minHeight: '820px',
        width: '100%',
        padding: '56px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111217', // dark canvas
        color: 'rgba(255,255,255,0.92)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle reference overlay (can remove) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${referenceImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.02,
          pointerEvents: 'none',
          filter: 'grayscale(1) blur(2px) contrast(0.9)',
        }}
      />

      {/* soft vignette + animated subtle overlay controlled by JS */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1200px 600px at 50% 35%, rgba(255,255,255,var(--bg-overlay-opacity,0.04)), rgba(0,0,0,0.06))',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      {/* container */}
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
              WAY OF DOING
            </div>
            <h1 style={{ fontSize: 42, margin: 0, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Our Process
            </h1>
          </div>

          <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.24)', fontSize: 13 }}>15 years — DHNN</div>
        </div>

        {/* SVG DIAGRAM */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg
            ref={svgRef}
            width="100%"
            viewBox="-720 -360 1440 720"
            style={{ maxWidth: 1200, height: '520px', display: 'block' }}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" opacity="0.9" />
              </marker>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feBlend in="SourceGraphic" in2="blur" mode="screen" />
              </filter>
            </defs>

            {/* grid background (thin) */}
            <g opacity="0.065">
              {[...Array(9)].map((_, i) => {
                const x = -600 + i * 150
                return <line key={`vx-${i}`} x1={x} y1={-320} x2={x} y2={320} stroke="#ffffff" strokeWidth="1" />
              })}
              {[...Array(7)].map((_, i) => {
                const y = -300 + i * 100
                return <line key={`hy-${i}`} x1={-720} y1={y} x2={720} y2={y} stroke="#ffffff" strokeWidth="1" />
              })}
            </g>

            {/* center cross and guide diagonals */}
            <g opacity="0.12" stroke="#ffffff" strokeWidth="1">
              <line x1={0} y1={-360} x2={0} y2={360} strokeDasharray="4 8" />
              <line x1={-720} y1={0} x2={720} y2={0} strokeDasharray="4 8" />
              <line x1={-440} y1={-260} x2={440} y2={260} strokeDasharray="3 8" opacity="0.08" />
              <line x1={-440} y1={260} x2={440} y2={-260} strokeDasharray="3 8" opacity="0.08" />
            </g>

            {/* left circle path (infinity left) */}
            <g transform="translate(-180,0)">
              <path
                d="M -240 0
                   A 240 240 0 1 1 240 0"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                opacity="0.45"
                strokeLinecap="round"
                data-target-opacity="0.45"
              />
            </g>

            {/* right circle path (infinity right) */}
            <g transform="translate(180,0)">
              <path
                d="M 240 0
                   A 240 240 0 1 1 -240 0"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                opacity="0.45"
                strokeLinecap="round"
                data-target-opacity="0.45"
              />
            </g>

            {/* intersection cross center - subtle */}
            <g>
              <circle cx="0" cy="0" r="8" fill="#ffffff" opacity="0.95" />
              <rect x={-34} y={-18} width={68} height={36} rx={18} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" />
              <text x={0} y={6} fontSize={12} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontWeight={700}>
                Test
              </text>
            </g>

            {/* directional arrows: follow path feel - left loop */}
            <g stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.9">
              <path d="M -160 -180 C -240 -120 -240 120 -160 180" stroke="rgba(255,255,255,0.6)" strokeWidth="1.0" markerEnd="url(#arrow)" data-target-opacity="0.6" />
              <path d="M 160 -180 C 240 -120 240 120 160 180" stroke="rgba(255,255,255,0.6)" strokeWidth="1.0" markerEnd="url(#arrow)" data-target-opacity="0.6" />
            </g>

            {/* numbered nodes positioned along the loops */}
            {/* node styling boxes + number circles */}
            {[
              { id: '01', x: -240, y: -30, label: 'Empathize', desc: 'Define the challenge and explore the human context' },
              { id: '02', x: -120, y: 170, label: 'Define', desc: 'Research, observe, create a point of view' },
              { id: '03', x: 240, y: -40, label: 'Ideate', desc: "Brainstorm broadly; don't stop at the obvious" },
              { id: '04', x: 120, y: 170, label: 'Prototype', desc: 'Start creating, experiment fast, fail cheap' },
            ].map((n, i) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`} opacity={1}>
                <circle cx={0} cy={0} r={18} fill="#111217" stroke="rgba(255,255,255,0.95)" strokeWidth="2" data-target-opacity="1" />
                <text x={0} y={6} fontSize={12} textAnchor="middle" fill="#ffffff" fontWeight={700}>
                  {n.id}
                </text>

                {/* connector line to label */}
                <line x1={24} y1={0} x2={120} y2={0} stroke="rgba(255,255,255,0.18)" strokeWidth="1" data-target-opacity="0.18" />
                <g transform="translate(136,-18)">
                  <rect x={0} y={0} width={220} height={48} rx={6} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" />
                  <text x={12} y={16} fontSize={13} fill="rgba(255,255,255,0.92)" fontWeight={700}>
                    {n.label}
                  </text>
                  <text x={12} y={34} fontSize={11} fill="rgba(255,255,255,0.34)">
                    {n.desc}
                  </text>
                </g>
              </g>
            ))}

            {/* subtle outer ticks around whole shape */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
              const p = polar(300, angle)
              const q = polar(320, angle)
              return <line key={`tick-${idx}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            })}

            {/* subtle guide labels left/right columns */}
            <g transform="translate(-520,-180)" opacity="0.22">
              <text x={0} y={0} fontSize={12} fill="rgba(255,255,255,0.9)" fontWeight={700}>Empathize</text>
            </g>
            <g transform="translate(360,-180)" opacity="0.22">
              <text x={0} y={0} fontSize={12} fill="rgba(255,255,255,0.9)" fontWeight={700}>Ideate</text>
            </g>

            {/* bottom small captions */}
            <g transform="translate(-520,260)" opacity="0.12">
              <text x={0} y={0} fontSize={11} fill="rgba(255,255,255,0.9)">Way of thinking</text>
            </g>
          </svg>
        </div>

        {/* footer explanatory caption centered */}
        <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.36)', fontSize: 13 }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <p style={{ margin: 0 }}>
              A structured infinity loop representing cyclical product thinking: Empathize → Define → Ideate → Prototype → Test.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function BosonSignature_Cosmic({ referenceImage = null }) {
  const svgRef = useRef(null)
  const wrapperRef = useRef(null)
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const rectRef = useRef({ left: 0, top: 0, width: 480, height: 480 })
  const ghostsRef = useRef([])
  const elementsRef = useRef([])
  const styleId = 'boson-signature-styles'

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // --- Inject style once ---
    let style = document.getElementById(styleId)
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      style.dataset.boson = 'true'
      style.textContent = `
        @keyframes slow-scan {
          0% { transform: translateX(-40%); opacity: 0; }
          6% { opacity: 0.05; }
          50% { transform: translateX(40%); opacity: 0.12; }
          94% { opacity: 0.05; }
          100% { transform: translateX(140%); opacity: 0; }
        }
        @keyframes ghost-drift {
          0% { opacity: 0.06; transform: translateY(0px) scale(1); }
          50% { opacity: 0.18; transform: translateY(-1.6px) scale(1.002); }
          100% { opacity: 0.06; transform: translateY(0px) scale(1); }
        }
        .boson-scan { animation: slow-scan 9s linear infinite; mix-blend-mode: screen }
        .boson-ghost-drift { animation: ghost-drift 6s ease-in-out infinite }
        .boson-smooth-transform { transition: transform 120ms linear; }
      `
      document.head.appendChild(style)
    }

    // --- Stroke-draw setup ---
    const selectable = svg.querySelectorAll('circle, line, polygon, path')
    elementsRef.current = Array.from(selectable)
    elementsRef.current.forEach((el) => {
      try {
        const L = el.getTotalLength ? el.getTotalLength() : 0
        const dash = L > 0 ? `${L} ${L}` : '1 0'
        el.style.strokeDasharray = dash
        el.style.strokeDashoffset = L > 0 ? `${L}` : '0'
        el.style.opacity = 0.001
        el.style.transition =
          'stroke-dashoffset 1.8s cubic-bezier(.2,.9,.2,1), opacity 300ms'
      } catch (e) {}
    })

    // --- IntersectionObserver initial reveal ---
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          elementsRef.current.forEach((el, i) => {
            setTimeout(() => {
              try {
                el.style.strokeDashoffset = '0'
                el.style.opacity = el.getAttribute('data-target-opacity') || 1
              } catch (e) {}
            }, i * 80)
          })
          obs.disconnect()
        }
      },
      { threshold: 0.18 },
    )
    obs.observe(svg)

    // --- Ghost elements ---
    ghostsRef.current = Array.from(svg.querySelectorAll('[data-ghost="true"]'))

    // --- ResizeObserver for rect caching ---
    function updateRect() {
      const r = svg.getBoundingClientRect()
      rectRef.current = {
        left: r.left,
        top: r.top,
        width: r.width || 480,
        height: r.height || 480,
      }
    }
    updateRect()
    const ro = new ResizeObserver(() => updateRect())
    ro.observe(svg)

    // --- Animation loop ---
    let last = performance.now()
    const gMain = svg.querySelector('#gMain')
    const rings = svg.querySelector('#ringsGroup')
    const lattice = svg.querySelector('#latticeGroup')

    const CENTER_X = 240
    const CENTER_Y = 240
    const curPos = { x: 0, y: 0 }

    function loop(now) {
      const dt = (now - last) / 1000
      last = now
      timeRef.current += dt

      // parallax transform
      if (gMain) {
        const rect = rectRef.current
        const m = mouseRef.current

        const cx = rect.width / 2
        const cy = rect.height / 2

        const nx = rect.width ? (m.x - cx) / rect.width : 0
        const ny = rect.height ? (m.y - cy) / rect.height : 0

        const tx = nx * 12
        const ty = ny * 8

        const ease = 0.08
        curPos.x += (tx - curPos.x) * ease
        curPos.y += (ty - curPos.y) * ease

        const angle = Math.sin(timeRef.current * 0.12) * 0.18

        gMain.setAttribute(
          'transform',
          `translate(${CENTER_X + curPos.x},${CENTER_Y + curPos.y}) rotate(${angle})`,
        )
      }

      // rings rotation
      if (rings) {
        const rAngle = Math.sin(timeRef.current * 0.08) * 0.35
        rings.setAttribute('transform', `rotate(${rAngle})`)
      }

      // lattice breathing
      if (lattice) {
        const b = 0.06 + Math.max(0, Math.sin(timeRef.current * 0.9)) * 0.08
        lattice.style.opacity = b.toString()
      }

      // ghost dashoffset movement
      ghostsRef.current.forEach((g, idx) => {
        try {
          if (!g.getTotalLength) return
          const L = g.getTotalLength()
          if (!L || Number.isNaN(L)) return

          const drift = (timeRef.current * (0.8 + idx * 0.12)) % L
          g.style.strokeDashoffset = `${-drift}`
        } catch (e) {}
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    // --- pointer movement ---
    function onPointerMove(e) {
      const rect = rectRef.current
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
    }
    function onPointerLeave() {
      mouseRef.current.active = false
      setTimeout(() => {
        const rect = rectRef.current
        mouseRef.current.x = rect.width / 2
        mouseRef.current.y = rect.height / 2
      }, 700)
    }

    svg.addEventListener('pointermove', onPointerMove)
    svg.addEventListener('pointerleave', onPointerLeave)

    // cleanup
    return () => {
      try {
        obs.disconnect()
        ro.disconnect()
      } catch (e) {}
      cancelAnimationFrame(rafRef.current)
      svg.removeEventListener('pointermove', onPointerMove)
      svg.removeEventListener('pointerleave', onPointerLeave)
      const s = document.getElementById(styleId)
      if (s && s.dataset && s.dataset.boson === 'true') s.remove()
    }
  }, [])

  return (
    <section
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '140px 32px',
        minHeight: '640px',
        background:
          'linear-gradient(180deg, rgba(3,6,7,0.95) 0%, rgba(1,2,3,0.99) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      {referenceImage ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `url("${referenceImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.02,
            filter: 'grayscale(1) blur(3px) contrast(0.9)',
          }}
        />
      ) : null}

      {/* Scanline */}
      <div
        aria-hidden
        className="boson-scan"
        style={{
          position: 'absolute',
          left: '-40%',
          top: 0,
          width: '200%',
          height: '100%',
          pointerEvents: 'none',
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.035) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.035) 55%, rgba(255,255,255,0.00) 100%)',
          opacity: 0.08,
        }}
      />

      {/* subtle fog */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 42%, rgba(20,200,190,0.035), rgba(0,0,0,0) 30%), radial-gradient(circle at 28% 62%, rgba(255,255,255,0.02), rgba(0,0,0,0) 25%)',
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
        <div style={{ marginBottom: '84px', maxWidth: '720px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: 'rgba(232,240,240,0.28)',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            Sacred Geometry Core
          </div>
          <h2
            style={{
              fontSize: '64px',
              fontWeight: 300,
              lineHeight: 1.2,
              textTransform: 'uppercase',
              color: 'rgba(232,240,240,0.98)',
            }}
          >
            Boson Signature
          </h2>
        </div>

        {/* MAIN SVG */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '120px' }}>
          <svg
            ref={svgRef}
            width="520"
            height="520"
            viewBox="0 0 480 480"
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.6))',
            }}
          >
            <defs>
              <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.2" result="gb" />
                <feMerge>
                  <feMergeNode in="gb" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="ghostGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#8ff5f0" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#8ff5f0" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="coreGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#bffaf6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#7eeae2" stopOpacity="0.65" />
              </linearGradient>
            </defs>

            {/* gMain */}
            <g id="gMain" transform="translate(240,240)">
              {/* rings */}
              <g id="ringsGroup">
                <circle cx="0" cy="0" r="200" fill="none" stroke="url(#coreGrad)" strokeWidth="1" opacity="0.85" />
                <circle cx="0" cy="0" r="150" fill="none" stroke="#8ff5f0" strokeWidth="0.8" opacity="0.6" />
                <circle cx="0" cy="0" r="100" fill="none" stroke="#8ff5f0" strokeWidth="0.8" opacity="0.52" />
                <circle data-ghost="true" cx="0" cy="0" r="175" fill="none" stroke="url(#ghostGrad)" strokeWidth="0.6" opacity="0.18" strokeDasharray="6,10" />
                <circle data-ghost="true" cx="0" cy="0" r="125" fill="none" stroke="url(#ghostGrad)" strokeWidth="0.5" opacity="0.14" strokeDasharray="6,10" />
              </g>

              {/* pentagon */}
              <g id="pentagonGroup" style={{ filter: 'url(#bloom)' }}>
                <polygon
                  points="0,-80 75,-25 46,65 -46,65 -75,-25"
                  fill="none"
                  stroke="#a7fff9"
                  strokeWidth="1.4"
                  data-target-opacity="0.95"
                />
                <circle cx="0" cy="0" r="70" fill="none" stroke="#bffaf6" strokeWidth="1.1" opacity="0.98" />
                <circle cx="0" cy="0" r="95" fill="none" stroke="#bffaf6" strokeWidth="0.5" opacity="0.18" />
                <circle cx="0" cy="0" r="120" fill="none" stroke="#bffaf6" strokeWidth="0.5" opacity="0.12" />
              </g>

              {/* axes */}
              <g id="axesGroup" opacity="0.7" stroke="#9ff5ee">
                <line x1="0" y1="-220" x2="0" y2="220" strokeWidth="0.9" opacity="0.55" />
                <line x1="-220" y1="0" x2="220" y2="0" strokeWidth="0.9" opacity="0.55" />
                <line x1="-155" y1="-155" x2="155" y2="155" strokeWidth="0.65" opacity="0.35" />
                <line x1="155" y1="-155" x2="-155" y2="155" strokeWidth="0.65" opacity="0.35" />
              </g>

              {/* ticks */}
              <g id="ticksGroup" opacity="0.55" stroke="#9ff5ee">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = Math.cos(rad) * 210
                  const y1 = Math.sin(rad) * 210
                  const x2 = Math.cos(rad) * 225
                  const y2 = Math.sin(rad) * 225
                  return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.6" opacity="0.22" />
                })}
              </g>

              {/* breathing lattice */}
              <g id="latticeGroup" opacity="0.15">
                {[0, 72, 144, 216, 288].map((angle) => {
                  const rad = (angle * Math.PI) / 180
                  const x = Math.cos(rad) * 90
                  const y = Math.sin(rad) * 90
                  return (
                    <g key={angle}>
                      <circle cx={x} cy={y} r="3" fill="none" stroke="#a7fff9" strokeWidth="0.35" opacity="0.18" />
                      <line x1="0" y1="0" x2={x} y2={y} stroke="#a7fff9" strokeWidth="0.25" opacity="0.08" />
                    </g>
                  )
                })}
              </g>

              {/* ghost aura */}
              <g id="ghostAura" opacity="0.18" className="boson-ghost-drift">
                <circle cx="0" cy="0" r="210" fill="none" stroke="url(#ghostGrad)" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="130" fill="none" stroke="url(#ghostGrad)" strokeWidth="0.8" />
              </g>
            </g>
          </svg>
        </div>

        {/* footer text */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
            borderTop: '1px solid rgba(160, 245, 238, 0.08)',
            paddingTop: '44px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(232,240,240,0.56)',
              marginBottom: '28px',
              lineHeight: 1.7,
            }}
          >
            The unified geometric field for intention, structure, and systemic
            causality.
          </p>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: 'rgba(232,240,240,0.32)',
              textTransform: 'uppercase',
            }}
          >
            BOSON SIG/PRIME_01 — Classified experimental geometry
          </p>
        </div>
      </div>
    </section>
  )
}



function Axioms() {
  const axioms = [
    "Reduksi sebelum arah.",
    "Waktu menentukan geometri.",
    "Energi itu terbatas.",
    "Struktur adalah bentuk setia pada masa depan.",
    "Teknologi tunduk pada manusia.",
    "Kausalitas mendahului emosi.",
    "Intensi menentukan arah sistem.",
    "Manusia harus tetap menjadi pusat.",
    "Pengukuran menentukan arah.",
    "Batasan menghasilkan evolusi.",
    "Leverage lebih superior dari usaha.",
    "Teknik dimulai dengan filosofi.",
  ]

  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_2: BLUEPRINT_OVERLAY - vertical spine */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.08,
        }}
        preserveAspectRatio="none"
      >
        <line x1="8%" y1="0" x2="8%" y2="100%" stroke="#0aa6a0" strokeWidth="0.5" opacity="0.3" />
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((y) => (
          <line key={y} x1="6%" y1={`${y}%`} x2="10%" y2={`${y}%`} stroke="#0aa6a0" strokeWidth="0.3" opacity="0.15" />
        ))}
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(232, 240, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Doctrinal Article Set
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2, textTransform: "uppercase" }}>
            The 12 Axioms
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            border: "1px solid rgba(10, 166, 160, 0.2)",
          }}
        >
          {axioms.map((axiom, idx) => (
            <div
              key={idx}
              style={{
                padding: "24px",
                display: "flex",
                gap: "16px",
                borderRight: idx % 3 !== 2 ? "1px solid rgba(10, 166, 160, 0.2)" : "none",
                borderBottom: idx < 9 ? "1px solid rgba(10, 166, 160, 0.2)" : "none",
                transition: "all 900ms linear 300ms",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget).style.background = "rgba(10, 166, 160, 0.05)"
                const p = e.currentTarget.querySelector("p")
                if (p) p.style.color = "rgba(10, 166, 160, 0.9)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget).style.background = "transparent"
                const p = e.currentTarget.querySelector("p")
                if (p) p.style.color = "#e8f0f0"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    background: "rgba(10, 166, 160, 0.5)",
                    border: "0.5px solid #0aa6a0",
                    marginTop: "6px",
                  }}
                />
                {idx < axioms.length - 1 && (
                  <div
                    style={{
                      width: "0.5px",
                      height: "32px",
                      background: "transparent",
                      borderLeft: "0.5px dashed rgba(10, 166, 160, 0.2)",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    color: "rgba(10, 166, 160, 0.35)",
                    fontWeight: 300,
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "#e8f0f0",
                    fontWeight: 300,
                    margin: "4px 0 0 0",
                    transition: "all 900ms linear 300ms",
                  }}
                >
                  {axiom}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function Roadmap() {
  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_2: BLUEPRINT_OVERLAY - Engineering flow lines */}
      <svg
        data-layer="2"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.1,
          zIndex: 1,
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#0aa6a0" />
          </marker>
        </defs>

        {/* Horizontal flow connector */}
        <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#0aa6a0" strokeWidth="1" opacity="0.3" />

        {/* Directional arrow segments */}
        <line x1="30%" y1="48%" x2="35%" y2="52%" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.2" />
        <line x1="30%" y1="52%" x2="35%" y2="48%" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.2" />

        <line x1="65%" y1="48%" x2="70%" y2="52%" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.2" />
        <line x1="65%" y1="52%" x2="70%" y2="48%" stroke="#0aa6a0" strokeWidth="0.8" opacity="0.2" />

        {/* Coordinate dots along path */}
        {[10, 25, 40, 50, 60, 75, 90].map((x) => (
          <circle key={x} cx={`${x}%`} cy="50%" r="1" fill="#0aa6a0" opacity="0.15" />
        ))}
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "96px", maxWidth: "720px" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(230, 238, 240, 0.3)",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Engineering Flow Diagram
          </div>
          <h2 style={{ fontSize: "64px", fontWeight: 300, lineHeight: 1.2 }}>Roadmap</h2>
        </div>

        {/* Flow diagram - horizontal node array */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            gap: "48px",
            position: "relative",
          }}
        >
          {/* Foundation Node */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                border: "1px solid rgba(10, 166, 160, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                position: "relative",
                transition: "all 900ms linear 300ms",
                cursor: "pointer",
                background: "rgba(10, 166, 160, 0.01)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "#0aa6a0"
                el.style.background = "rgba(10, 166, 160, 0.08)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "rgba(10, 166, 160, 0.3)"
                el.style.background = "rgba(10, 166, 160, 0.01)"
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "rgba(10, 166, 160, 0.4)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Phase 1
                </div>
                <div style={{ fontSize: "18px", fontWeight: 300, color: "#e6eef0" }}>Foundation</div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(230, 238, 240, 0.4)", lineHeight: 1.5, fontWeight: 300 }}>
              Epistemology, principles, axiom architecture
            </p>
          </div>

          {/* Arrow connector 1 */}
          <div
            style={{
              width: "32px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: "20px",
              fontSize: "12px",
              color: "rgba(10, 166, 160, 0.25)",
              fontWeight: 300,
            }}
          >
            →
          </div>

          {/* Implementation Node */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                border: "1px solid rgba(10, 166, 160, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                position: "relative",
                transition: "all 900ms linear 300ms",
                cursor: "pointer",
                background: "rgba(10, 166, 160, 0.01)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "#0aa6a0"
                el.style.background = "rgba(10, 166, 160, 0.08)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "rgba(10, 166, 160, 0.3)"
                el.style.background = "rgba(10, 166, 160, 0.01)"
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "rgba(10, 166, 160, 0.4)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Phase 2
                </div>
                <div style={{ fontSize: "18px", fontWeight: 300, color: "#e6eef0" }}>Implementation</div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(230, 238, 240, 0.4)", lineHeight: 1.5, fontWeight: 300 }}>
              Methods, fields of practice, structural deployment
            </p>
          </div>

          {/* Arrow connector 2 */}
          <div
            style={{
              width: "32px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: "20px",
              fontSize: "12px",
              color: "rgba(10, 166, 160, 0.25)",
              fontWeight: 300,
            }}
          >
            →
          </div>

          {/* Emergence Node */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                border: "1px solid rgba(10, 166, 160, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                position: "relative",
                transition: "all 900ms linear 300ms",
                cursor: "pointer",
                background: "rgba(10, 166, 160, 0.01)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "#0aa6a0"
                el.style.background = "rgba(10, 166, 160, 0.08)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "rgba(10, 166, 160, 0.3)"
                el.style.background = "rgba(10, 166, 160, 0.01)"
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "rgba(10, 166, 160, 0.4)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Phase 3
                </div>
                <div style={{ fontSize: "18px", fontWeight: 300, color: "#e6eef0" }}>Emergence</div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(230, 238, 240, 0.4)", lineHeight: 1.5, fontWeight: 300 }}>
              System deployment, narrative interface, societal integration
            </p>
          </div>
        </div>

        {/* Blueprint footer */}
        <div
          style={{
            marginTop: "96px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(10, 166, 160, 0.1)",
            display: "flex",
            gap: "48px",
            fontSize: "11px",
            color: "rgba(230, 238, 240, 0.3)",
            letterSpacing: "0.05em",
          }}
        >
          <div>PHASES: 3</div>
          <div>TOPOLOGY: Linear Engineering Flow</div>
          <div>VECTORS: Foundation → Implementation → Emergence</div>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section style={{ position: "relative", width: "100%", padding: "128px 32px" }}>
      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div
        data-layer="3"
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ height: "1px", width: "64px", background: "rgba(10, 166, 160, 0.3)", margin: "0 auto 12px" }} />
        <div
          style={{
            fontSize: "8px",
            letterSpacing: "0.15em",
            color: "rgba(10, 166, 160, 0.2)",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          AXIS_01
        </div>

        <h2
          style={{
            fontSize: "56px",
            fontWeight: 300,
            marginBottom: "32px",
            lineHeight: 1.3,
            textTransform: "uppercase",
          }}
        >
          The future belongs to those who build systems.
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "rgba(232, 240, 240, 0.55)",
            marginBottom: "64px",
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: "0 auto 64px",
            fontWeight: 300,
          }}
        >
          BOSON is not inspiration. It is architecture.
        </p>

        {/* CTA buttons - blueprint style */}
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "80px", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "12px 32px",
              border: "1px solid #0aa6a0",
              background: "#0aa6a0",
              color: "#020508",
              fontSize: "12px",
              letterSpacing: "0.08em",
              fontWeight: 300,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Begin Transmission
          </button>
          <button
            style={{
              padding: "12px 32px",
              border: "1px solid rgba(10, 166, 160, 0.4)",
              background: "transparent",
              color: "#e8f0f0",
              fontSize: "12px",
              letterSpacing: "0.08em",
              fontWeight: 300,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Explore Framework
          </button>
        </div>

        {/* Three pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
            borderTop: "1px solid rgba(10, 166, 160, 0.15)",
            paddingTop: "64px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(10, 166, 160, 0.35)",
                marginBottom: "12px",
                fontWeight: 300,
                textTransform: "uppercase",
              }}
            >
              Philosophy
            </p>
            <p style={{ fontSize: "13px", color: "rgba(232, 240, 240, 0.45)", fontWeight: 300, lineHeight: 1.6 }}>
              Engineering begins with philosophy.
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(10, 166, 160, 0.35)",
                marginBottom: "12px",
                fontWeight: 300,
                textTransform: "uppercase",
              }}
            >
              Discipline
            </p>
            <p style={{ fontSize: "13px", color: "rgba(232, 240, 240, 0.45)", fontWeight: 300, lineHeight: 1.6 }}>
              Systems precede individual effort.
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(10, 166, 160, 0.35)",
                marginBottom: "12px",
                fontWeight: 300,
                textTransform: "uppercase",
              }}
            >
              Direction
            </p>
            <p style={{ fontSize: "13px", color: "rgba(232, 240, 240, 0.45)", fontWeight: 300, lineHeight: 1.6 }}>
              The future is built, not discovered.
            </p>
          </div>
        </div>

        {/* Footer with coordinate label */}
        <div
          style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(10, 166, 160, 0.1)",
            fontSize: "10px",
            color: "rgba(232, 240, 240, 0.25)",
            fontWeight: 300,
          }}
        >
          <p style={{ marginBottom: "8px" }}>BOSON Framework © 2025. Built with precision. Designed for ambition.</p>
          <p
            style={{
              fontSize: "8px",
              letterSpacing: "0.1em",
              color: "rgba(10, 166, 160, 0.15)",
              textTransform: "uppercase",
            }}
          >
            END/AXIS_01
          </p>
        </div>
      </div>
    </section>
  )
}



export default function Home() {
  return (
    <div id="boson" style={{ background: "#05080b", color: "#e6eef0", overflow: "hidden" }}>
      {/* LAYER_1: BACKGROUND_FIELD */}
      <ParticleField />

      {/* LAYER_2: BLUEPRINT_OVERLAY - Global grid (subtle) */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.03,
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0aa6a0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* LAYER_3: FOREGROUND_CONTENT */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <Manifesto />
        <Framework />
        <MethodPreview />
        <FieldsOfPractice />
        <BosonSignature />
        <DHNNInfinityDiagram/>
        <BosonSignature_Cosmic/>
        <Axioms />
        <Roadmap />
        <Closing />
        
        <style jsx global>{`
        /* seluruh CSS lu tempel di sini */
        
:root {
  /* MACHINE-HYBRID MODE: strict color palette for BOSON */
  --bg-primary: #020508;
  --blueprint-line: #0aa6a0;
  --text-primary: #e8f0f0;
  --spacing-unit: 8px;

  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Disable all rounded corners globally */
* {
  border-radius: 0 !important;
}

/* Remove shadows globally */
* {
  box-shadow: none !important;
  text-shadow: none !important;
}

/* Motion profile: minimal, linear, 900ms duration */
* {
  transition: all 900ms linear 300ms;
}

/* Add faint blueprint grid overlay to entire page */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(10, 166, 160, 0.05) 25%,
      rgba(10, 166, 160, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(10, 166, 160, 0.05) 75%,
      rgba(10, 166, 160, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(10, 166, 160, 0.05) 25%,
      rgba(10, 166, 160, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(10, 166, 160, 0.05) 75%,
      rgba(10, 166, 160, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-size: 80px 80px;
  pointer-events: none;
  z-index: -1;
  opacity: 0.4;
}

/* Grid helper for 12-column layout */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: calc(var(--spacing-unit) * 4);
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 calc(var(--spacing-unit) * 2);
}

/* Layer system enforcement */
[data-layer="1"] {
  z-index: 0;
  position: absolute;
  inset: 0;
}

[data-layer="2"] {
  z-index: 1;
  position: absolute;
  inset: 0;
}

[data-layer="3"] {
  z-index: 2;
  position: relative;
}

/* Section container with proper layer isolation */
.section-container {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

/* Blueprint line styling - thin cyan only */
svg line,
svg path {
  stroke: var(--blueprint-line);
  fill: none;
}

svg circle,
svg rect,
svg polygon {
  stroke: var(--blueprint-line);
  fill: none;
}

/* Text styling - no gradients, no decorations */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
  letter-spacing: 0.02em;
  font-family: "Space Grotesk", monospace;
  text-transform: uppercase;
}

p,
li,
span {
  line-height: 1.6;
  letter-spacing: 0.01em;
}

/* Button: rectilinear blueprint style only */
button {
  border: 1px solid var(--blueprint-line);
  background: transparent;
  color: var(--text-primary);
  padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 3);
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0.08em;
  transition: all 900ms linear 300ms;
  text-transform: uppercase;
}

button:hover {
  background: var(--blueprint-line);
  color: var(--bg-primary);
}

button[aria-label*="outline"] {
  background: transparent;
  color: var(--blueprint-line);
}

button[aria-label*="outline"]:hover {
  background: var(--blueprint-line);
  color: var(--bg-primary);
}

/* List marker - blueprint small diamond node */
ul.doctrinal li::before {
  content: "◆";
  color: var(--blueprint-line);
  margin-right: calc(var(--spacing-unit) * 1.5);
  font-size: 8px;
}

/* Vstack/hstack helpers */
.vstack {
  display: flex;
  flex-direction: column;
}

.hstack {
  display: flex;
  flex-direction: row;
}

.center {
  justify-content: center;
  align-items: center;
}

.gap-8 {
  gap: calc(var(--spacing-unit) * 1);
}

.gap-16 {
  gap: calc(var(--spacing-unit) * 2);
}

.gap-32 {
  gap: calc(var(--spacing-unit) * 4);
}

.gap-56 {
  gap: calc(var(--spacing-unit) * 7);
}
      `}</style>
      
      </div>
    </div>
  )
}
