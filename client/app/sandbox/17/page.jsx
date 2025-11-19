"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SubtleGridBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, points;
    let uniforms = {};

    const init = () => {
      const container = containerRef.current;

      // === Renderer ===
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000);
      container.appendChild(renderer.domElement);

      // === Scene & Camera ===
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 150;

      // === Grid Points ===
      const spacing = 1;
      const cols = Math.ceil(window.innerWidth / spacing);
      const rows = Math.ceil(window.innerHeight / spacing);
      const positions = [];

      for (let y = -rows / 2; y < rows / 2; y++) {
        for (let x = -cols / 2; x < cols / 2; x++) {
          positions.push(x * spacing, y * spacing, 0);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      // === Shader Uniforms ===
      uniforms = {
        uTime: { value: 0.0 },
        // mouse in NDC (-1..1) — we'll compare with vScreen (also NDC)
        uMouse: { value: new THREE.Vector2(9999, 9999) },
        uPixelRatio: { value: window.devicePixelRatio || 1.0 },
      };

      // === Track Mouse (NDC) ===
      window.addEventListener("pointermove", (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        uniforms.uMouse.value.set(x, y);
      });

      // === Shader Material ===
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPos;
          varying vec2 vScreen; // clip-space / NDC position to fragment

          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            vUv = position.xy;
            vPos = position;

            vec3 pos = position;

            vec2 norm = (position.xy + vec2(500.0)) / 1000.0;
            float lightZone = smoothstep(0.0, 0.3, 1.0 - abs(norm.x - norm.y));

            float chaos = random(position.xy * 0.4 + uTime * 0.1);

            float orderly = sin((pos.x + pos.y) * 0.05 + uTime * 0.8) * 5.0;
            float disorder = (chaos - 0.5) * 50.0;

            float zOffset = mix(disorder, orderly, lightZone);
            pos.z += zOffset;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

            // compute NDC screen position (x,y) after projection, to account for perspective & zOffset
            vScreen = gl_Position.xy / gl_Position.w;

            gl_PointSize = 2.4;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uMouse; // NDC mouse
          varying vec2 vUv;
          varying vec3 vPos;
          varying vec2 vScreen;

          void main() {
            // diagonal light zone (kept original logic)
            vec2 norm = (vUv + vec2(500.0)) / 1000.0;
            float lightZone = smoothstep(0.0, 0.3, 1.0 - abs(norm.x - norm.y));

            // base colors
            vec3 bright = vec3(0.8, 0.8, 0.85);
            vec3 dark   = vec3(0.45, 0.45, 0.5);
            vec3 color  = mix(dark, bright, lightZone);

            // ----------------------
            // ACCURATE SCREEN-SPACE HOVER
            // ----------------------
            // vScreen is NDC (-1..1) of the point after projection (includes zOffset)
            // uMouse is NDC (-1..1) from pointer
            float ndcDist = distance(vScreen, uMouse);

            // radius in NDC units — tweak for tighter/looser hover
            // 0.02 is tiny, 0.04 is larger. We pick a value that respects both density and feel.
            float hover = smoothstep(0.035, 0.0, ndcDist);

            // optionally mask with bright diagonal zone to keep original behavior
            float boostMask = smoothstep(0.25, 1.0, lightZone);

            float brightnessBoost = hover * boostMask * 0.9;

            color += brightnessBoost;

            float alpha = 0.45 + 0.25 * sin(vPos.x * 0.05 + vPos.y * 0.05);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      window.addEventListener("resize", onResize);
      animate();
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = (time = 0) => {
      requestAnimationFrame(animate);
      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
    };

    init();

    return () => {
      window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        zIndex: -1,
        overflow: "hidden",
      }}
    />
  );
}
