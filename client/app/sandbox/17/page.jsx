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

      // === Shader Material ===
      uniforms = {
        uTime: { value: 0.0 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPos;

          // noise sederhana berbasis sin/cos
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            vUv = position.xy;
            vPos = position;

            vec3 pos = position;

            // normalisasi posisi ke 0..1 ruang "layar"
            vec2 norm = (position.xy + vec2(500.0)) / 1000.0;

            // area terang (kiri atas & kanan bawah)
            float lightZone = smoothstep(0.0, 0.3, 1.0 - abs(norm.x - norm.y));

            // noise chaotic untuk area gelap
            float chaos = random(position.xy * 0.4 + uTime * 0.1);

            // kombinasi gerak wave & chaos
            float orderly = sin((pos.x + pos.y) * 0.05 + uTime * 0.8) * 5.0;
            float disorder = (chaos - 0.5) * 50.0;

            // blend dua dunia: beraturan dan acak
            float zOffset = mix(disorder, orderly, lightZone);
            pos.z += zOffset;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 2.4;
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          uniform float uTime;

          void main() {
            vec2 norm = (vUv + vec2(500.0)) / 1000.0;

            // area terang diagonal (dua arah)
            float lightZone = smoothstep(0.0, 0.3, 1.0 - abs(norm.x - norm.y));

            // warna dan alpha
            vec3 bright = vec3(0.8, 0.8, 0.85);
            vec3 dark = vec3(0.45, 0.45, 0.5);
            vec3 color = mix(dark, bright, lightZone);

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
