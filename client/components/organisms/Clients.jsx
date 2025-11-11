"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const logos = [
  "arabian-bronze.png", "chi.png", "dwm.png", "eight-mansion.png",
  "equilibrium.png", "hey-yolo.png", "isbt.png", "ko-eyewear.png",
  "linea.png", "maison.png", "marrosh.png", "milos.png",
  "psr.png", "sdg.png", "social.png", "solace.png",
  "stylish-kitchen.png", "sunny-village.png", "tender-touch.png", "zai-caffe.png",
];

export default function ClientsPage() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === BASIC SCENE SETUP ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 8, 60);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // === HANDLE CONTEXT LOSS SAFELY ===
    renderer.getContext().canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      console.warn("⚠️ WebGL context lost, reinitializing renderer...");
    });

    // === LIGHTS ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const point = new THREE.PointLight(0xffffff, 1.2);
    scene.add(point);

    // === STARFIELD BACKGROUND ===
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 800 + Math.random() * 1200;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // === LOAD CORE LOGO TEXTURE ===
    const textureLoader = new THREE.TextureLoader();
    const coreTexture = textureLoader.load("/boson-white.png");
    coreTexture.generateMipmaps = false;
    coreTexture.minFilter = THREE.LinearFilter;
    coreTexture.magFilter = THREE.LinearFilter;
    const coreGeo = new THREE.PlaneGeometry(6, 6);
    const coreMat = new THREE.MeshBasicMaterial({
      map: coreTexture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0, 0);
    scene.add(coreMesh);

    // === LOAD CLIENT LOGOS ===
    const textures = logos.map((l) => textureLoader.load(`/clients/${l}`));
    textures.forEach((t) => {
      t.generateMipmaps = false;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
    });

    // === LOGO PLANES ===
    const planeGeo = new THREE.PlaneGeometry(3, 1.5);
    const meshes = [];
    const orbitRadius = [20, 35, 50];
    const speeds = [0.2, -0.12, 0.08];

    orbitRadius.forEach((radius, j) => {
      textures.forEach((tx, i) => {
        const mat = new THREE.MeshBasicMaterial({ map: tx, transparent: true, opacity: 0.9 });
        const mesh = new THREE.Mesh(planeGeo, mat);
        mesh.position.set(
          Math.cos((i / textures.length) * Math.PI * 2) * radius,
          j * 4 - 4,
          Math.sin((i / textures.length) * Math.PI * 2) * radius
        );
        scene.add(mesh);
        meshes.push({ mesh, speed: speeds[j] });
      });
    });

    // === ANIMATION LOOP ===
    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let frameId;
    const animate = () => {
      const targetX = mouse.x * 5;
      const targetY = 8 + mouse.y * 2;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // subtle slow rotation for starfield
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;

      meshes.forEach(({ mesh, speed }) => {
        mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), speed * 0.01);
        mesh.lookAt(camera.position);
      });

      coreMesh.lookAt(camera.position);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // === RESIZE ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // === CLEANUP ===
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", null);
      textures.forEach((t) => t.dispose());
      planeGeo.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      meshes.forEach(({ mesh }) => {
        mesh.material.dispose();
        scene.remove(mesh);
      });
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <main className="relative w-full h-screen bg-black text-white overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between py-16 pointer-events-none">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        > 
          <p className="text-gray-400 mt-3 text-xs uppercase tracking-[0.25em]">
            Partners orbiting our creative gravity
          </p>
        </motion.div>

        <motion.div
          className="text-center text-gray-500 text-xs tracking-[0.25em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          BOSON SYSTEM — Field 03 : Collective Entities
        </motion.div>
      </div>
    </main>
  );
}
