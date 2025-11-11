"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SubtleGridBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, points, material;
    let animationId;

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
      camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        1,
        1000
      );
      camera.position.z = 10;

      // === Grid Points ===
      const spacing = 10;
      const cols = Math.ceil(window.innerWidth / spacing) + 4;
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

      const gridWidth = cols * spacing;

      // === Shader Material ===
      material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0.0 },
          u_aspect: { value: window.innerWidth / window.innerHeight },
          u_gridWidth: { value: gridWidth },
        },
        vertexShader: `
          uniform float u_time;
          uniform float u_gridWidth;
          varying float vChaosZone;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          void main() {
            vec3 pos = position;

            float speed = 30.0;
            float move = mod(u_time * speed, u_gridWidth);

            pos.x = mod(pos.x + move + u_gridWidth / 2.0, u_gridWidth) - u_gridWidth / 2.0;

            float drift = sin(u_time * 0.2 + pos.y * 0.01) * 5.0;
            pos.x += drift;

            float normX = (pos.x + u_gridWidth / 2.0) / u_gridWidth;
            float t1 = smoothstep(0.75, 0.93, normX);
            float t2 = smoothstep(0.7, 0.96, normX);
            float t3 = smoothstep(0.65, 1.0, normX);
            float transition = (t1 * 0.6 + t2 * 0.3 + t3 * 0.1);
            float chaosZone = 1.0 - transition;
            vChaosZone = chaosZone;

            float n1 = hash(pos.xy * 0.3 + u_time * 0.1);
            float n2 = hash(pos.yx * 0.4 + u_time * 0.1);
            float wave = sin(u_time * 0.3 + pos.y * 0.05) * 2.0;

            pos.x += (n1 - 0.5) * chaosZone * 20.0;
            pos.y += (n2 - 0.5) * chaosZone * 20.0 + wave * chaosZone * 0.8;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 4.0; // ukuran partikel 3x lebih besar
          }
        `,
        fragmentShader: `
          varying float vChaosZone;

          void main() {
            vec2 uv = gl_PointCoord;
            float edge = 0.08;
            if (uv.x < edge || uv.x > 1.0 - edge || uv.y < edge || uv.y > 1.0 - edge) discard;

            // Chaos lebih gelap, order tetap terang
            float brightness = mix(0.15, 0.8, 1.0 - vChaosZone);
            gl_FragColor = vec4(vec3(brightness), 0.85);
          }
        `,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      // === Animation Loop ===
      const animate = (t) => {
        material.uniforms.u_time.value = t * 0.001;
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate(0);

      window.addEventListener("resize", onResize);
    };

    const onResize = () => {
      if (!renderer) return;
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (material) {
        const spacing = 10;
        const cols = Math.ceil(window.innerWidth / spacing) + 4;
        material.uniforms.u_aspect.value = window.innerWidth / window.innerHeight;
        material.uniforms.u_gridWidth.value = cols * spacing;
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
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
