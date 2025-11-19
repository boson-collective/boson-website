"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ============================================================================
   CosmicParticles — ORIGINAL ENGINE (dipertahankan 100%)
   Hanya 1 perubahan besar:
   → Scroll sekarang menggerakkan kamera MUNDUR SANGAT JAUH (Z: 12 → -120)
   → Tidak pakai pathSegments
   ============================================================================
*/
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

  // Time system
  const GlobalTime = {
    t: 0,
    update(dt) {
      this.t += dt;
    },
  };

  // Phase system
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

      const coreTarget = Math.tanh(base);
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

  // HSL → RGB
  function hslToRgb(h, s, l) {
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

    /* -------------------------------------------------------
       SCENE + CAMERA
    ------------------------------------------------------- */
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x000012, 0.035);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;

    /* -------------------------------------------------------
       RENDERER
    ------------------------------------------------------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.max(1, window.devicePixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* -------------------------------------------------------
       PARTICLES
    ------------------------------------------------------- */
    const maxParticles = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const opacities = new Float32Array(maxParticles);
    const scales = new Float32Array(maxParticles);

    const innerRadius = 6;
    const outerRadius = 30;

    for (let i = 0; i < maxParticles; i++) {
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      opacities[i] = i < 40 ? 1 : 0;
      scales[i] = 1 + Math.random() * 0.8;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    alphaAttrRef.current = geometry.getAttribute("alpha");

    /* -------------------------------------------------------
       SHADER MATERIAL
    ------------------------------------------------------- */
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
        varying float vDepth;
        varying float vScale;
        void main() {
          vec3 pos = position;

          pos.x += sin(uTime * 0.00035 + position.y * 0.22) * 0.08;
          pos.y += sin(uTime * 0.0004 + position.x * 0.18) * 0.08;
          pos.z += sin(uTime * 0.0005 + position.z * 0.2) * 0.08;

          vAlpha = alpha;
          vScale = scale;
          vDepth = length(pos);

          gl_PointSize = 1.4 * scale;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vDepth;
        uniform float uTime;
        uniform float uPhaseShell;
        uniform float uHueBase;

        vec3 hsl2rgb(vec3 hsl){
          vec3 rgb = clamp(abs(mod(hsl.x*6.0 + vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);
          return hsl.z + hsl.y*(rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
        }

        void main(){
          vec2 p=gl_PointCoord-0.5;
          float d=length(p);
          if(d>0.5)discard;

          float depthFade=smoothstep(6.0,30.0,vDepth);
          float glow=0.6+0.4*(1.0-depthFade);

          float hue=mod(uHueBase+vDepth*0.02 +0.05*sin(uTime*0.0005 + uPhaseShell*0.6),1.0);
          vec3 col=hsl2rgb(vec3(hue,0.88,0.6));

          float emiss=0.5+0.5*abs(sin(uPhaseShell*1.8+vDepth*0.12));
          vec3 finalCol=mix(vec3(1.0),col,0.78)*(0.6+emiss*0.4);

          float a=vAlpha*(1.0-depthFade)*(0.7+0.3*emiss);
          gl_FragColor=vec4(finalCol, a*glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    /* -------------------------------------------------------
       LIGHTING (original minimal)
    ------------------------------------------------------- */
    const key = new THREE.PointLight(0xffdcb3, 1.2, 40, 2);
    key.position.set(4, 2, 6);
    const rim = new THREE.PointLight(0x99caffe, 0.9, 40, 2);
    rim.position.set(-3, 1, -4);
    const fill = new THREE.PointLight(0xffffff, 0.35, 12, 2);
    fill.position.set(0, -2, 3);
    scene.add(key, rim, fill);
    scene.add(new THREE.AmbientLight(0x222222, 0.6));

    /* -------------------------------------------------------
       MetaCore (tetap ada, tidak jadi pusat)
    ------------------------------------------------------- */
    const coreGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1, 1, 1),
      opacity: 0.85,
      transparent: true,
    });
    const metaCore = new THREE.Mesh(coreGeo, coreMat);

    const haloGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1, 1, 1),
      opacity: 0.05,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const metaHalo = new THREE.Mesh(haloGeo, haloMat);
    metaCore.add(metaHalo);
    scene.add(metaCore);

    /* -------------------------------------------------------
       SCROLL → ZOOM B2 (12 → -120)
    ------------------------------------------------------- */
    let scrollProgress = 0;
    let targetScroll = 0;

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      targetScroll = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* -------------------------------------------------------
       RESIZE
    ------------------------------------------------------- */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* -------------------------------------------------------
       ANIMATION LOOP
    ------------------------------------------------------- */
    let prev = performance.now();
    let simTime = 0;

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      simTime += dt;

      GlobalTime.update(dt);
      GlobalPhase.update(GlobalTime.t, dt);

      material.uniforms.uTime.value = simTime * 1000;
      material.uniforms.uPhaseShell.value = GlobalPhase.shell;
      material.uniforms.uHueBase.value =
        0.55 + 0.08 * Math.sin(GlobalTime.t * 0.06);

      // scroll easing
      scrollProgress += (targetScroll - scrollProgress) * 0.07;

      /* ============================
         B2 CAMERA SINGULARITY ZOOM
         ============================ */
      const z = THREE.MathUtils.lerp(12, -120, scrollProgress);
      camera.position.set(0, 0, z);
      camera.lookAt(0, 0, 0);

      // rotate particles slightly
      if (!paused && pointsRef.current) {
        pointsRef.current.rotation.y += 0.00025;
      }

      // alpha expansion
      const alphaAttr = alphaAttrRef.current;
      const baseVisible = 40;
      const maxP = alphaAttr.array.length;
      const shouldExpand = expandedRef.current;

      if (shouldExpand && delayFramesRef.current < 60) delayFramesRef.current++;
      else if (!shouldExpand) delayFramesRef.current = 0;

      const canExpand = delayFramesRef.current >= 60;
      const targetA = shouldExpand && canExpand ? 1 : 0;
      activationRef.current += (targetA - activationRef.current) * 0.02;

      for (let i = baseVisible; i < maxP; i++) {
        const t = (i - baseVisible) / (maxP - baseVisible);
        const v = clamp(activationRef.current * 2 - t, 0, 1);
        alphaAttr.array[i] = v * v;
      }
      alphaAttr.needsUpdate = true;

      // metaCore animate (tidak jadi pusat singularity)
      const tNorm = scrollProgress;
      const wave = Math.sin(simTime * 0.5) * 0.18;
      metaCore.position.set(
        Math.sin(tNorm * Math.PI * 2) * 4,
        Math.cos(tNorm * Math.PI * 1.5) * 2 + wave,
        4 - tNorm * 2
      );
      metaHalo.scale.setScalar(1 + Math.sin(simTime * 0.9) * 0.2);

      renderer.render(scene, camera);
      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    /* -------------------------------------------------------
       CLEANUP
    ------------------------------------------------------- */
    return () => {
      cancelAnimationFrame(reqRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      scene.remove(points);
      scene.remove(metaCore);
      scene.remove(key);
      scene.remove(rim);
      scene.remove(fill);

      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      haloGeo.dispose();

      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [paused]);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
}

/* ============================================================================
   MAIN (EMPTY) — ONLY RENDERS CosmicParticles FULLSCREEN
   ============================================================================
*/
export default function BosonIntro() {
  return (
    <main className="relative w-full bg-black text-white min-h-screen overflow-hidden">
      <CosmicParticles paused={false} expanded={true} />
      {/* DO NOTHING ELSE → PURE 2-SCENE EXPERIENCE */}
      <div style={{ height: "200vh", width: 1 }} />
    </main>
  );
}
