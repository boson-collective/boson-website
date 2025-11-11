"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

/* ==========================================================
   CosmicParticles — Multi-direction Scroll Cinematic
   (IDENTIKAL DENGAN KODE LO — TIDAK DIUBAH)
   ========================================================== */
function CosmicParticles({ paused, expanded = false }) {
  const mountRef = useRef(null);
  const reqRef = useRef(null);
  const expandedRef = useRef(false);
  const delayFramesRef = useRef(0);
  const activationRef = useRef(0);
  const alphaAttrRef = useRef(null);
  const pointsRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  // -----------------------
  // Lightweight Global systems (time + propagated phase)
  // -----------------------
  const GlobalTime = {
    t: 0,
    update(dt) {
      this.t += dt;
    },
  };
  const GlobalPhase = {
    core: 0,
    shell: 0,
    swarm: 0,
    coreRate: 1.0,
    shellCouple: 0.12,
    shellDamp: 0.92,
    swarmCouple: 0.09,
    swarmDamp: 0.94,
    update(time, dt) {
      const base =
        Math.sin(time * this.coreRate * 1.0) * 0.9 +
        0.25 * Math.sin(time * this.coreRate * 2.7 + 0.8) +
        0.12 * Math.sin(time * this.coreRate * 4.2 + 1.9);
      const coreTarget = Math.tanh(base * 1.0);
      this.core += (coreTarget - this.core) * 0.28;
      const shellDrive = this.core - this.shell;
      this.shell = this.shell * this.shellDamp + shellDrive * this.shellCouple;
      const swarmDrive = this.shell - this.swarm;
      this.swarm = this.swarm * this.swarmDamp + swarmDrive * this.swarmCouple;
      const drift = 0.08 * Math.sin(time * 0.4);
      this.shell += drift * 0.02;
      this.swarm += drift * 0.015;
    },
  };

  // small helper: HSL -> RGB (0..1)
  function hslToRgb(h, s, l) {
    // expects h in [0,1]
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return [f(0), f(8), f(4)];
  }

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- scene / camera / renderer ----------
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // subtle exp2 fog added
    scene.fog = new THREE.FogExp2(0x000012, 0.035);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.max(1, window.devicePixelRatio || 1));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ---------- particles ----------
    const maxParticles = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const opacities = new Float32Array(maxParticles);
    const scales = new Float32Array(maxParticles);

    const innerRadius = 6;
    const outerRadius = 30;

    for (let i = 0; i < maxParticles; i++) {
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      opacities[i] = i < 40 ? 1 : 0;
      scales[i] = 1.0 + Math.random() * 0.8;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    alphaAttrRef.current = geometry.getAttribute("alpha");

    // ---------- shader material (with hue cascade + depth tint) ----------
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPhaseShell: { value: 0 },
        uHueBase: { value: 0.55 },
      },
      vertexShader: `
          attribute float alpha;
          attribute float scale;
          uniform float uTime;
          varying float vAlpha;
          varying float vScale;
          varying float vDepth;
          varying vec3 vPos;
          void main() {
            vec3 pos = position;
            pos.x += sin(uTime * 0.00035 + position.y * 0.22) * 0.08;
            pos.y += sin(uTime * 0.0004 + position.x * 0.18) * 0.08;
            pos.z += sin(uTime * 0.0005 + position.z * 0.2) * 0.08;
            vAlpha = alpha;
            vScale = scale;
            vDepth = length(pos);
            vPos = pos;
            gl_PointSize = 1.4 * scale;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
      fragmentShader: `
          varying float vAlpha;
          varying float vScale;
          varying float vDepth;
          varying vec3 vPos;
          uniform float uTime;
          uniform float uPhaseShell;
          uniform float uHueBase;
  
          // cheap hsl->rgb (small)
          vec3 hsl2rgb(vec3 hsl){
            vec3 rgb = clamp(abs(mod(hsl.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
            return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0*hsl.z - 1.0));
          }
  
          void main() {
            vec2 p = gl_PointCoord - vec2(0.5);
            float d = length(p);
            if (d > 0.5) discard;
  
            // depth falloff
            float depthFade = smoothstep(6.0, 30.0, vDepth);
            float glow = 0.6 + 0.4 * (1.0 - depthFade);
  
            // hue cascade using base + depth + shell phase
            float hue = mod(uHueBase + (vDepth * 0.02) + 0.05 * sin(uTime * 0.0005 + uPhaseShell * 0.6), 1.0);
            vec3 col = hsl2rgb(vec3(hue, 0.88, 0.6));
  
            // layer tint + beat-like emissive
            float emissive = 0.5 + 0.5 * abs(sin(uPhaseShell * 1.8 + vDepth * 0.12));
            vec3 finalCol = mix(vec3(1.0), col, 0.78) * (0.6 + emissive * 0.4);
  
            float alpha = vAlpha * (1.0 - depthFade) * (0.7 + 0.3 * emissive);
            gl_FragColor = vec4(finalCol, alpha * glow);
          }
        `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    // ---------- dynamic mini-lighting (tri-light breathing) ----------
    const keyLight = new THREE.PointLight(0xffdcb3, 1.2, 40, 2);
    keyLight.position.set(4, 2, 6);
    const rimLight = new THREE.PointLight(0x99caffe, 0.9, 40, 2);
    rimLight.position.set(-3, 1, -4);
    const fillLight = new THREE.PointLight(0xffffff, 0.35, 12, 2);
    fillLight.position.set(0, -2, 3);
    scene.add(keyLight, rimLight, fillLight);

    // keep also a faint ambient
    const ambient = new THREE.AmbientLight(0x222222, 0.6);
    scene.add(ambient);

    // ---------- lightweight glow shell (additive) ----------
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x88ccff),
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowGeo = new THREE.SphereGeometry(8, 32, 32);
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.renderOrder = 0;
    // scene.add(glowMesh);

    // ---------- MetaCore (singular particle) ----------
    let metaCore = null;
    let metaHalo = null;
    const initMetaCore = () => {
      const g = new THREE.SphereGeometry(0.035, 16, 16);
      const m = new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        transparent: true,
        opacity: 0.85,
      });
      metaCore = new THREE.Mesh(g, m);

      const haloGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      metaHalo = new THREE.Mesh(haloGeo, haloMat);
      metaCore.add(metaHalo);

      scene.add(metaCore);
    };
    initMetaCore();

    // ---------- scrolling camera path ----------
    let scrollProgress = 0;
    let targetScroll = 0;
    const handleScroll = () => {
      const scrollMax = document.body.scrollHeight - window.innerHeight;
      const normalized = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      targetScroll = normalized;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ---------- resize handler ----------
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(w, h);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", handleResize);

    // pre-defined camera path segments (kept original)
    const pathSegments = [
      {
        start: 0.0,
        end: 0.2,
        from: { x: 0, y: 0, z: 12 },
        to: { x: 0, y: 0, z: 6 },
      },
      {
        start: 0.2,
        end: 0.4,
        from: { x: 0, y: 0, z: 6 },
        to: { x: 4, y: 0, z: 4 },
      },
      {
        start: 0.4,
        end: 0.6,
        from: { x: 4, y: 0, z: 4 },
        to: { x: 6, y: 3, z: 3 },
      },
      {
        start: 0.6,
        end: 0.8,
        from: { x: 6, y: 3, z: 3 },
        to: { x: 6, y: 4, z: 2.5 },
      },
      {
        start: 0.8,
        end: 0.9,
        from: { x: 6, y: 4, z: 2.5 },
        to: { x: 3, y: 2, z: 2.8 },
      },
      {
        start: 0.9,
        end: 1.0,
        from: { x: 3, y: 2, z: 2.8 },
        to: { x: 0, y: 0, z: 3.5 },
      },
    ];

    // ---------- animation loop ----------
    let prevTime = performance.now();
    let simTime = 0; // seconds
    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - prevTime) / 1000); // clamp dt
      prevTime = now;
      simTime += dt;

      // update globals
      GlobalTime.update(dt);
      GlobalPhase.update(GlobalTime.t, dt);

      // original-style time variable kept (but scaled seconds to ms for shader familiarity)
      material.uniforms.uTime.value = simTime * 1000;
      material.uniforms.uPhaseShell.value = GlobalPhase.shell;
      material.uniforms.uHueBase.value =
        0.55 + 0.08 * Math.sin(GlobalTime.t * 0.06);

      // camera path via scroll
      scrollProgress += (targetScroll - scrollProgress) * 0.08;
      const seg =
        pathSegments.find(
          (s) => scrollProgress >= s.start && scrollProgress < s.end
        ) || pathSegments[pathSegments.length - 1];
      const localT = (scrollProgress - seg.start) / (seg.end - seg.start || 1);
      const moveX = THREE.MathUtils.lerp(seg.from.x, seg.to.x, localT);
      const moveY = THREE.MathUtils.lerp(seg.from.y, seg.to.y, localT);
      const moveZ = THREE.MathUtils.lerp(seg.from.z, seg.to.z, localT);
      camera.position.set(moveX, moveY, moveZ);
      camera.lookAt(0, 0, 0);

      // rotation of point cloud when not paused
      if (!paused && pointsRef.current) {
        pointsRef.current.rotation.y += 0.0003;
        pointsRef.current.rotation.x += 0.0001;
      }

      // expand alpha logic (copied & preserved)
      const alphaAttr = alphaAttrRef.current;
      const baseVisible = 40;
      const maxP = alphaAttr.array.length;
      const shouldExpand = expandedRef.current;
      if (shouldExpand && delayFramesRef.current < 60)
        delayFramesRef.current += 1;
      else if (!shouldExpand) delayFramesRef.current = 0;
      const canExpand = delayFramesRef.current >= 60;
      const target = shouldExpand && canExpand ? 1 : 0;
      activationRef.current += (target - activationRef.current) * 0.02;
      for (let i = baseVisible; i < maxP; i++) {
        const t = (i - baseVisible) / (maxP - baseVisible);
        const v = clamp(activationRef.current * 2 - t, 0, 1);
        alphaAttr.array[i] = v * v;
      }
      alphaAttr.needsUpdate = true;

      // ---------------- MetaCore update (path + breathing + color pulse via phase)
      const tNorm = scrollProgress;
      const wave = Math.sin(simTime * 0.5) * 0.18;
      if (metaCore && metaHalo) {
        metaCore.position.set(
          Math.sin(tNorm * Math.PI * 2) * 4,
          Math.cos(tNorm * Math.PI * 1.5) * 2 + wave,
          4 - tNorm * 2
        );
        metaHalo.scale.setScalar(
          1 + Math.sin(simTime * 0.9 + GlobalPhase.swarm * 0.4) * 0.2
        );
        metaHalo.material.opacity =
          0.02 + Math.abs(Math.sin(GlobalPhase.shell * 2.0)) * 0.05;
        const hue =
          (0.55 + GlobalPhase.core * 0.15 + scrollProgress * 0.3) % 1.0;
        const rgb = hslToRgb(hue, 0.9, 0.6);
        metaCore.material.color.setRGB(rgb[0], rgb[1], rgb[2]);
      }

      // lights breathe with the propagated phase/time
      const breathe = 0.5 + Math.sin(GlobalTime.t * 0.9) * 0.5;
      keyLight.intensity =
        1.0 + breathe * 0.45 * (0.6 + Math.abs(GlobalPhase.core) * 0.6);
      rimLight.intensity = 0.9 + breathe * 0.35;
      fillLight.intensity = 0.25 + breathe * 0.25;

      // fog density subtle modulation
      if (scene.fog) {
        scene.fog.density =
          0.032 + 0.007 * Math.sin(GlobalTime.t * 0.33 + GlobalPhase.shell);
      }

      // glow shell dynamics
      glowMesh.scale.setScalar(
        1.0 + 0.08 * Math.sin(GlobalPhase.swarm + GlobalTime.t * 0.2)
      );
      glowMat.opacity =
        0.02 + 0.015 * Math.abs(Math.sin(GlobalPhase.shell * 1.3));

      renderer.render(scene, camera);

      reqRef.current = requestAnimationFrame(animate);
    };

    // start loop
    prevTime = performance.now();
    reqRef.current = requestAnimationFrame(animate);

    // ---------- cleanup ----------
    return () => {
      cancelAnimationFrame(reqRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      // remove objects from scene
      if (metaCore) scene.remove(metaCore);
      if (glowMesh) scene.remove(glowMesh);
      if (points) scene.remove(points);
      if (keyLight) scene.remove(keyLight);
      if (rimLight) scene.remove(rimLight);
      if (fillLight) scene.remove(fillLight);
      if (ambient) scene.remove(ambient);

      // dispose geometries/materials
      try {
        geometry.dispose();
        material.dispose();
        glowGeo.dispose();
        glowMat.dispose();
        if (metaCore) metaCore.geometry.dispose();
        if (metaCore) metaCore.material.dispose();
      } catch (e) {
        // ignore disposal errors in some environments
      }

      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      try {
        renderer.dispose();
      } catch (e) {
        /* ignore */
      }
    };
  }, [paused]);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  return (
    <div ref={mountRef} className="fixed inset-0 z-10 pointer-events-none" />
  );
}

/* ==========================================================
   Scramble Hook
   ========================================================== */
function useScramble(targetText = "", duration = 1800, delay = 2000) {
  const [text, setText] = useState("");
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789⨂⋄⨁𐌋𐌊";
    const startTime = Date.now() + delay;
    let frame;
    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
      if (progress < 0) {
        frame = requestAnimationFrame(animate);
        return;
      }
      const lockCount = Math.floor(progress * targetText.length);
      let output = "";
      for (let i = 0; i < targetText.length; i++) {
        if (i < lockCount) output += targetText[i];
        else output += chars[Math.floor(Math.random() * chars.length)];
      }
      setText(progress < 1 ? output : targetText);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetText, duration, delay]);
  return text;
}

/* ==========================================================
   Main — scramble fades out before scroll phase
   (ADDED: overlay for 4 technical phases — everything else preserved)
   ========================================================== */
   export default function BosonCollectiveIntro() {
    const scrambleMain = useScramble("BOSON COLLECTIVE", 2000, 500);
    const scrambleSub = useScramble("A CREATIVE FORCE BORN FROM ENERGY", 2500, 2000);
  
    // scramble untuk menu navigasi
    const scrambleServices = useScramble("SERVICES", 2000, 1500);
    const scrambleTeam = useScramble("TEAM", 2000, 1800);
    const scrambleClients = useScramble("CLIENTS", 2000, 2100);
    const scrambleContact = useScramble("CONTACT", 2000, 2400);
  
    const [scroll, setScroll] = useState(0);
    useEffect(() => {
      const handleScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setScroll(p);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    const showScramble = scroll < 0.25;
  
    let text = "";
    if (scroll >= 0.2 && scroll < 0.4)
      text = "Boson is not a company. It’s a system translating energy into meaning.";
    else if (scroll >= 0.4 && scroll < 0.6)
      text = "Every creation is a dialogue between silence and intention.";
    else if (scroll >= 0.6 && scroll < 0.8)
      text = "You are not outside this system. Every motion here responds to you.";
  
    const phase =
      scroll < 0.25
        ? 1
        : scroll < 0.5
        ? 2
        : scroll < 0.75
        ? 3
        : scroll < 0.9
        ? 4
        : 5;
  
    const [rippleKey, setRippleKey] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({
      intent: "",
      name: "",
      contact: "",
    });
  
    useEffect(() => {
      if (phase === 5) {
        setRippleKey((k) => k + 1);
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    }, [phase]);
  
    const handleSend = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!formValues.contact.trim() && !formValues.intent.trim()) return;
      setShowForm(false);
      setTimeout(() => setFormValues({ intent: "", name: "", contact: "" }), 3200);
    };
  
    return (
      <main className="relative w-full bg-black text-white min-h-screen overflow-hidden">
        <CosmicParticles paused={false} expanded={true} />
  
        {/* ===========================
            HEADER BAR (logo + menu)
            =========================== */}
        <header className="fixed top-0 left-0 w-full z-30 flex justify-between items-center px-6 md:px-[5%] py-8 bg-transparent  select-none pointer-events-auto">
          {/* Left: Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center"
          >
            <img
              src="/boson-white.png"
              alt="Boson Logo"
              className="h-6 md:h-10 w-auto object-contain select-none pointer-events-auto"
            />
          </motion.div>

  
          {/* Right: Menu */}
          <nav className="hidden md:flex gap-8 text-xs tracking-widest font-light">
            <span>{scrambleServices}</span>
            <span>{scrambleTeam}</span>
            <span>{scrambleClients}</span>
            <span>{scrambleContact}</span>
          </nav>
  
          {/* Responsive (Mobile) */}
          <nav className="md:hidden flex flex-col gap-2 text-xs text-right">
            <span>{scrambleServices}</span>
            <span>{scrambleTeam}</span>
            <span>{scrambleClients}</span>
            <span>{scrambleContact}</span>
          </nav>
        </header>
  
        {/* ===========================
            LEFT TEXT BLOCK
            =========================== */}
        <div className="fixed z-20 select-none pointer-events-auto w-full px-6 md:px-[10%] top-[28vh] md:top-1/2 md:-translate-y-1/2">
          <div className="max-w-[90vw] md:max-w-[50vw]">
            <AnimatePresence mode="wait">
              {showScramble && (
                <motion.div
                  key="scramble"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <motion.p
                    className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl font-light tracking-wide leading-tight text-white"
                    style={{ wordBreak: "break-word", lineHeight: "1.1" }}
                  >
                    {scrambleMain}
                  </motion.p>
  
                  <motion.p className="text-gray-500 mt-3 text-xs tracking-[0.25em] uppercase">
                    {scrambleSub}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
  
            <div className="mt-6 text-gray-500 text-xs sm:text-sm md:text-base min-h-[2.5em]">
              <AnimatePresence mode="wait">
                {!showScramble && text && (
                  <motion.p
                    key={text}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                  >
                    {text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
  
        {/* CONTINUUM (Phase 5) */}
        <div className="fixed inset-0 z-40 pointer-events-none">
          <AnimatePresence>
            {phase === 5 && (
              <motion.div
                key={`continuum-${rippleKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.form
                  key={`form-${rippleKey}`}
                  initial={{ opacity: 0, scale: 0.98, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 8 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ pointerEvents: "auto" }}
                  onSubmit={handleSend}
                  className="w-[90vw] max-w-md mx-auto"
                >
                  <div
                    className="bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl p-5"
                    style={{ boxShadow: "0 6px 30px rgba(0,0,0,0.6)" }}
                  >
                    <div className="text-sm text-white/80 mb-2 font-light">
                      Whisper your intent — the field listens.
                    </div>
                    <textarea
                      value={formValues.intent}
                      onChange={(e) =>
                        setFormValues({ ...formValues, intent: e.target.value })
                      }
                      placeholder="What do you want to create?"
                      className="w-full bg-transparent border border-white/8 rounded-xl p-3 text-sm h-28 outline-none placeholder:text-white/50"
                    />
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <input
                        value={formValues.name}
                        onChange={(e) =>
                          setFormValues({ ...formValues, name: e.target.value })
                        }
                        placeholder="Your name (optional)"
                        className="bg-transparent border border-white/8 rounded-xl p-2 text-sm outline-none placeholder:text-white/50"
                      />
                      <input
                        value={formValues.contact}
                        onChange={(e) =>
                          setFormValues({ ...formValues, contact: e.target.value })
                        }
                        placeholder="Email / WhatsApp"
                        className="bg-transparent border border-white/8 rounded-xl p-2 text-sm outline-none placeholder:text-white/50"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="submit"
                        className="text-sm py-2 px-3 rounded-xl border border-white/20 hover:bg-white/5 transition"
                      >
                        Send a signal
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-xs text-white/60"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* Spacer agar scroll tetap jalan */}
        <div style={{ height: "4600vh", width: "1px" }} />
      </main>
    );
  }
