"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SubtleGridBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, points, planet;
    let uniforms = {};
    const clock = new THREE.Clock();

    const init = () => {
      const container = containerRef.current;

      // === Renderer ===
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000);
      container.appendChild(renderer.domElement);

      // === Scene & Camera ===
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 180;

      // === Visible black planet (soft glow edge) ===
      const planetRadius = 22.0;
      const planetGeom = new THREE.CircleGeometry(planetRadius, 64);
      const planetMat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uColor: { value: new THREE.Color(0x000000) },
          uGlowColor: { value: new THREE.Color(0x0f1b2a) },
          uRadius: { value: planetRadius },
          uSoft: { value: 10.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv * 2.0 - 1.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform vec3 uGlowColor;
          uniform float uRadius;
          uniform float uSoft;
          varying vec2 vUv;
          void main() {
            float d = length(vUv) * uRadius;
            float inner = smoothstep(uRadius * 0.0, uRadius * 0.95, d);
            float rim = 1.0 - smoothstep(uRadius - uSoft, uRadius + uSoft, d);
            vec3 col = mix(uGlowColor * 0.35, uColor, inner);
            float alpha = rim + (1.0 - rim) * 0.96;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });
      planet = new THREE.Mesh(planetGeom, planetMat);
      scene.add(planet);

      // === Chaotic particle distribution (no grid) ===
      const numParticles = 80000;
      const spread = 500;
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);
      const color = new THREE.Color();

      for (let i = 0; i < numParticles; i++) {
        const px = (Math.random() - 0.5) * spread;
        const py = (Math.random() - 0.5) * spread;
        const pz = (Math.random() - 0.5) * 50; // subtle depth variance

        positions[i * 3] = px;
        positions[i * 3 + 1] = py;
        positions[i * 3 + 2] = pz;

        if (Math.random() < 0.08) {
          const starType = Math.random();
          if (starType < 0.33) color.set(0xffe6a3);
          else if (starType < 0.66) color.set(0xaad6ff);
          else color.set(0xffb3b3);
        } else {
          color.set(0xffffff);
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // === Uniforms ===
      uniforms = {
        uTime: { value: 0.0 },
        uPlanetPos: { value: new THREE.Vector2(0.0, 0.0) },
        uPlanetRadius: { value: planetRadius },
        uInfluence: { value: 120.0 },
        uSoftEdge: { value: 36.0 },
        uMinSpeed: { value: 0.015 },
        uMaxSpeed: { value: 0.32 },
        uTurbulence: { value: 0.25 },
      };

      // === ShaderMaterial (same orbit logic, but chaotic positions) ===
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          uniform float uTime;
          uniform vec2 uPlanetPos;
          uniform float uPlanetRadius;
          uniform float uInfluence;
          uniform float uSoftEdge;
          uniform float uMinSpeed;
          uniform float uMaxSpeed;
          uniform float uTurbulence;
          varying vec3 vColor;
          varying float vDist;

          float hash(float n){ return fract(sin(n)*43758.5453); }

          void main() {
            vColor = color;
            vec3 pos = position;

            vec2 rel = pos.xy - uPlanetPos;
            float dist = length(rel);
            vDist = dist;

            float start = uPlanetRadius;
            float end = uInfluence;
            float blend = 1.0 - smoothstep(start, end, dist);
            float orbitMix = smoothstep(0.0, 1.0, blend);

            if (dist > 0.0001) {
              float t = clamp(1.0 - (dist - start) / (end - start), 0.0, 1.0);
              float speed = mix(uMinSpeed, uMaxSpeed, t);
              float phase = hash(pos.x * 12.9898 + pos.y * 78.233) * 6.28318;
              float turb = (hash(pos.x * 0.123 + pos.y * 0.456) - 0.5) * uTurbulence;
              float angle = atan(rel.y, rel.x) + (speed + turb) * uTime + phase * 0.02;
              vec2 rotated = vec2(cos(angle), sin(angle)) * dist;
              vec2 mixed = mix(pos.xy, uPlanetPos + rotated, orbitMix);
              pos.xy = mixed;
            }

            // subtle drift for chaotic non-orbit particles
            pos.x += sin(uTime * 0.05 + pos.y * 0.002) * 0.5;
            pos.y += cos(uTime * 0.04 + pos.x * 0.002) * 0.5;
            pos.z += sin(uTime * 0.1 + pos.x * 0.005) * 0.3;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 1.6 + (1.0 - clamp((dist - uPlanetRadius) / (uInfluence - uPlanetRadius), 0.0, 1.0)) * 2.2;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vDist;
          void main() {
            float m = length(gl_PointCoord - vec2(0.5));
            float shape = smoothstep(0.5, 0.0, m);
            float dim = 1.0 - smoothstep(0.0, 20.0, vDist) * 0.35;
            gl_FragColor = vec4(vColor * dim, shape);
          }
        `,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      // === Animate ===
      const animate = () => {
        requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };

    init();

    return () => {
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
