"use client";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Image from "next/image";
import * as THREE from "three";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

/* -----------------------
   Constants & util
   ----------------------- */
const MAX_TEXTURE_SIZE = 2048;
const SLIDES = [
  { id: "b", src: "/clients/dwm/mockup.png" },
  { id: "a", src: "/clients/marrosh/mockup.png" },
  { id: "c", src: "/clients/tender-touch/mockup.png" },
];

const SLIDE_COUNT = SLIDES.length;
const SEGMENT = 1 / SLIDE_COUNT;
const ease = (t) => t * t * (3 - 2 * t);

// Simple heuristic: detect device tier (0 = low, 1 = high)
const detectLowTier = () => {
  if (typeof navigator === "undefined") return 1; // default aman di server

  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/.test(ua);

  const cores = navigator.hardwareConcurrency || 4; // hint CPU
  const memory = navigator.deviceMemory || 4; // hint RAM (GB, di browser yang support)

  // Rule kasar: kalau iOS lama / core <=4 / RAM <=4 → anggap low tier
  const isLowEndGPU = isIOS || cores <= 4 || memory <= 4;
  return isLowEndGPU ? 0 : 1; // 0 = Low Quality, 1 = High Quality
};


/* -----------------------
   CanvasMirror
   ----------------------- */
const CanvasMirror = ({ index, src, onTextureReady }) => {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const textureRef = useRef(null);
  const mountedRef = useRef(true);
  const redrawScheduledRef = useRef(false);

  const scheduleRedraw = () => {
    if (redrawScheduledRef.current) return;
    redrawScheduledRef.current = true;
    requestAnimationFrame(() => {
      redrawScheduledRef.current = false;
      redraw();
    });
  };

  const redraw = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    if (!img.naturalWidth || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = img.naturalWidth;
    let h = img.naturalHeight;
    const scale = Math.min(1, MAX_TEXTURE_SIZE / Math.max(w, h));
    w = Math.floor(w * scale);
    h = Math.floor(h * scale);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    try {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    } catch (err) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    }

    if (!textureRef.current) {
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      textureRef.current = tex;
    }

    textureRef.current.needsUpdate = true;

    onTextureReady(index, {
      texture: textureRef.current,
      width: w,
      height: h,
      canvas,
      src,
    });
  };

  useEffect(() => {
    mountedRef.current = true;
    const img = imgRef.current;
    if (!img) return;

    let loadHandler = null;
    let safetyTimer = null;

    const safeSchedule = () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      safetyTimer = setTimeout(() => {
        if (mountedRef.current) scheduleRedraw();
      }, 120);
    };

    const handleLoad = () => {
      scheduleRedraw();
    };

    if (img.complete && img.naturalWidth && img.naturalWidth > 0) {
      if (img.decode && typeof img.decode === "function") {
        img
          .decode()
          .then(() => {
            if (mountedRef.current) scheduleRedraw();
          })
          .catch(() => {
            if (mountedRef.current) scheduleRedraw();
          });
      } else {
        scheduleRedraw();
      }
    } else {
      loadHandler = () => handleLoad();
      img.addEventListener("load", loadHandler, { passive: true });
      if (img.decode && typeof img.decode === "function") {
        img
          .decode()
          .then(() => {
            if (mountedRef.current) scheduleRedraw();
          })
          .catch(() => {});
      }
      safeSchedule();
    }

    const mountSafety = setTimeout(() => {
      if (mountedRef.current) scheduleRedraw();
    }, 250);

    return () => {
      mountedRef.current = false;
      if (loadHandler) img.removeEventListener("load", loadHandler);
      if (safetyTimer) clearTimeout(safetyTimer);
      clearTimeout(mountSafety);
      try {
        if (textureRef.current) {
          textureRef.current.dispose();
          textureRef.current = null;
        }
      } catch (e) {}
    };
  }, [src]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-99999px",
        top: "-99999px",
        width: "1px",
        height: "1px",
        visibility: "hidden",
        overflow: "hidden",
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        crossOrigin="anonymous"
        style={{ width: "auto", height: "auto", display: "block" }}
      />
      <canvas ref={canvasRef} />
    </div>
  );
};

/* -----------------------
   Pipeline 1 (optimized)
   ----------------------- */
   const CarouselPipeline1 = forwardRef(({ onAllTexturesReady }, ref) => {
    const texturesRef = useRef([]);
    const allReadyRef = useRef(false);
  
    useImperativeHandle(ref, () => ({
      getTextures: () => texturesRef.current,
    }));
  
    const handleTextureReady = (index, data) => {
      texturesRef.current[index] = data;
  
      // Cek kalau semua texture sudah ready
      if (
        !allReadyRef.current &&
        texturesRef.current.length === SLIDE_COUNT &&
        texturesRef.current.every(Boolean)
      ) {
        allReadyRef.current = true;
        if (typeof onAllTexturesReady === "function") {
          // kirim shallow copy ke parent biar aman
          onAllTexturesReady([...texturesRef.current]);
        }
      }
    };
  
    return (
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((s, i) => (
          <CanvasMirror
            key={s.id}
            index={i}
            src={s.src}
            onTextureReady={handleTextureReady}
          />
        ))}
      </div>
    );
  });
  

/* -----------------------
   MAIN COMPONENT
   ----------------------- */
export default function CarouselFullFixed() {
  const mainRef = useRef(null);
  const overlayRef = useRef(null);
  const p1Ref = useRef(null);
  const scrollDriverRef = useRef(null);

  // THREE refs
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const camRef = useRef(null);
  const matRef = useRef(null);
  const quadRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const intersectObserverRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const glContextLostRef = useRef(false);
  const contextListenerRef = useRef(null);


  const texturesRef = useRef([]);
  const [ready, setReady] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);


  // section visibility (buat idle optimization)
  const visibleRef = useRef(true);

  // pointer bubble
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  // main scroll progress
  const domProgress = useMotionValue(0);

  /* -----------------------
     ZOOM PATCH
     ----------------------- */
  const { scrollYProgress } = useScroll({
    target: scrollDriverRef,
    offset: ["start start", "end end"],
  });

  const zoomTransition = useMotionValue(1);
  const zoomScroll = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const zoomCombined = useTransform(
    [zoomScroll, zoomTransition],
    ([a, b]) => a * b
  );

  // current visible segment
  const currentSegmentRef = useRef(0);
  const [currentSegmentUI, setCurrentSegmentUI] = useState(0);

  // anim state for shader
  const uProgressAnimRef = useRef(0);
  const animatingRef = useRef(false);
  const animRafRef = useRef(null);
  const settleAnimRef = useRef(0);

  // transition config
  const TRANSITION_DURATION = 0.75;
  const SETTLE_DURATION = 0.25;
  const TRANSITION_EASE = (t) => t * t * (3 - 2 * t);
 

  // progress bar segments
  const p1 = useTransform(domProgress, [0, SEGMENT], [0, 1]);
  const p2 = useTransform(domProgress, [SEGMENT, SEGMENT * 2], [0, 1]);
  const p3 = useTransform(domProgress, [SEGMENT * 2, 1], [0, 1]);

  /* -----------------------
     pointer move: throttled rAF
     ----------------------- */
  useEffect(() => {
    let frame = null;

    const handleMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;

        const clampedX = Math.max(80, Math.min(window.innerWidth - 80, clientX));
        const clampedY = Math.max(80, Math.min(window.innerHeight - 80, clientY));

        mouseX.set(clampedX - window.innerWidth / 2);
        mouseY.set(clampedY - window.innerHeight / 2);
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mouseX, mouseY]);

  /* -----------------------
     sync scrollYProgress -> domProgress
     ----------------------- */
  useEffect(() => {
    const unsub = scrollYProgress.onChange((v) => {
      domProgress.set(v);
      const raw = v / SEGMENT;
      const seg = Math.max(0, Math.min(SLIDE_COUNT - 1, Math.floor(raw)));
      if (seg !== currentSegmentRef.current && !animatingRef.current) {
        triggerGlitchTransition(seg);
      }
    });
    return () => unsub();
  }, [scrollYProgress, domProgress]);

  /* -----------------------
     Shader code
     ----------------------- */
  const vert = `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
  `;

const frag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uProgressAnim;
  uniform float uSettleAnim;
  uniform float uTime;
  uniform float uQuality;
  uniform vec2 uFocus; // << ADD THIS
  uniform vec2 uAspect; // << PATCH: aspect uniform

  float easeF(float t){ return t*t*(3.0 - 2.0*t); }
  vec2 clampUV(vec2 uv){ return clamp(uv, 0.0, 1.0); }

  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i + vec2(0.0, 0.0));
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for(int i=0;i < 5 ; i++){
      v += a * noise(p);
      p = m * p * 1.9;
      a *= 0.55;
    }
    return v;
  }

  void main(){
    float trans = easeF(uProgressAnim);
    float settle = uSettleAnim;
    float globalIntensity = (trans * (1.0 - trans)) + settle * 0.35;
    float wavePos = mix(0.0, 1.18, trans);
    float BAND_HALF = 0.20;
    float lowEdge  = wavePos - BAND_HALF;
    float midEdge  = wavePos;
    float highEdge = wavePos + BAND_HALF;

    float band = smoothstep(lowEdge, midEdge, vUv.y) * (1.0 - smoothstep(midEdge, highEdge, vUv.y));
    band *= globalIntensity;
    float topFade = smoothstep(0.80, 1.00, vUv.y);
    band *= (1.0 - topFade);
    float mask = 1.0 - step(wavePos, vUv.y);

    // PATCH: aspect-corrected UV untuk sampling texture
    vec2 baseUv = ((vUv - uFocus) * uAspect) + uFocus; // << UPDATED


    vec3 baseFrom = texture2D(uFrom, baseUv).rgb;
    vec3 baseTo   = texture2D(uTo,   baseUv).rgb;
    vec3 cleanComposite = mix(baseFrom, baseTo, mask);

    if (band < 0.0005) {
      gl_FragColor = vec4(cleanComposite, 1.0);
      return;
    }

    float t = uTime * 0.9;

    float organic;
    float pull;
    float shard;

    if (uQuality > 0.5) {
      // HIGH quality: full fbm detail
      float n1 = fbm(vec2(vUv.x * 2.0, vUv.y * 4.0 + t * 0.35));
      float n2 = fbm(vec2(vUv.x * 6.0, vUv.y * 8.0 + t * 1.1));
      float n3 = fbm(vec2(vUv.x * 18.0, vUv.y * 22.0 + t * 2.6));
      organic = mix(n1, n2, 0.5) * 0.55 + n3 * 0.15;

      pull = pow(1.0 - vUv.y, 2.6) * 0.65 * band;
      shard = smoothstep(0.25, 0.75, fract(n2 * 10.0)) * 0.06 * band;
    } else {
      // LOW quality: lebih ringan, 1x noise saja
      organic = noise(vUv * 4.0 + t * 0.3) * 0.4;
      pull = 0.0;
      shard = 0.0;
    }

    float curvature = pow(vUv.y * 1.05, 1.6) * 0.48 * band;
    float waveA = sin((vUv.x * 8.5)  - t * 1.6) * 0.12;
    float waveB = sin((vUv.x * 22.0) + t * 2.2) * 0.045;
    float waveC = sin((vUv.x * 44.0) - t * 3.8) * 0.018;
    float combinedWave = (waveA + waveB + waveC) * (0.9 + organic * 0.8) * band;

    vec2 disp = vec2(
      combinedWave * 0.9 + shard,
      -pull - curvature * 0.9
    );

    float waveFollow = smoothstep(lowEdge - 0.12, midEdge + 0.12, vUv.y);
    disp += vec2(sin(t * 1.2 + vUv.x * 6.0) * 0.03 * band * waveFollow, 0.0);

    float CHROMA = (uQuality > 0.5)
      ? 0.09 * (0.6 + organic * 0.8) * band
      : 0.0;

    // PATCH: semua sampling berbasis baseUv, bukan vUv langsung
    vec2 rUV = clampUV(baseUv + disp + vec2(CHROMA, 0.0));
    vec2 gUV = clampUV(baseUv + disp);
    vec2 bUV = clampUV(baseUv + disp - vec2(CHROMA, 0.0));

    vec3 fromR = texture2D(uFrom, rUV).rgb;
    vec3 fromG = texture2D(uFrom, gUV).rgb;
    vec3 fromB = texture2D(uFrom, bUV).rgb;
    vec3 colFrom = vec3(fromR.r, fromG.g, fromB.b);

    vec3 toR = texture2D(uTo, rUV).rgb;
    vec3 toG = texture2D(uTo, gUV).rgb;
    vec3 toB = texture2D(uTo, bUV).rgb;
    vec3 colTo = vec3(toR.r, toG.g, toB.b);

    float localWipe = smoothstep(lowEdge, highEdge, vUv.y);
    float compMix = clamp(trans + localWipe * 0.35 * trans, 0.0, 1.0);
    vec3 glitchMain = mix(colFrom, colTo, compMix);

    vec2 smearUV = clampUV(
      baseUv + normalize(vec2(disp.x, max(-disp.y, 0.001))) * (0.06 + organic * 0.08)
    );
    vec3 smear = texture2D(uFrom, smearUV).rgb;
    float smearStrength = (0.4 + organic * 0.6) * band * smoothstep(0.0, 0.6, 1.0 - vUv.y);

    glitchMain += smear * smearStrength;

    vec2 causticUV = clampUV(
      baseUv + disp * 0.33 + vec2(sin(t * 2.2 + vUv.x*10.0) * 0.005, 0.0)
    );
    vec3 caustic = texture2D(uFrom, causticUV).rgb * (0.12 * band * (0.7 + organic * 0.8));
    glitchMain = mix(glitchMain, glitchMain + caustic, 0.25);

    vec3 finalColor = mix(cleanComposite, glitchMain, clamp(band * 3.5, 0.0, 1.0));
    float vign = smoothstep(0.88, 0.20, length(vUv - vec2(0.5, 0.5)));
    finalColor *= mix(1.0, 0.94, vign * 0.45);
    float grain = (hash21(vUv * (200.0 + 600.0 * organic + t * 0.1)) - 0.5) * 0.02 * (0.5 + band * 0.6);
    finalColor += grain;
    finalColor = clamp(finalColor, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

   /* -----------------------
     Wait textures ready -> start three (event-based)
     ----------------------- */
     const handleAllTexturesReady = (allTextures) => {
      // simpan ke ref global Three
      texturesRef.current = allTextures;
      startThree();
      updateAspectUniform(); // << PATCH

    };
  

  /* -----------------------
     triggerGlitchTransition(nextSegment)
     ----------------------- */
  const triggerGlitchTransition = (nextSeg) => {
    if (animatingRef.current) return;
    if (nextSeg < 0 || nextSeg >= SLIDE_COUNT) return;

    const from = currentSegmentRef.current;
    const to = nextSeg;
    if (from === to) return;

    const tFrom = texturesRef.current[from];
    const tTo = texturesRef.current[to];
    if (!tFrom || !tTo) {
      snapToSegment(to);
      return;
    }

    // set shader textures
    if (matRef.current) {
      try {
        matRef.current.uniforms.uFrom.value = tFrom.texture;
        matRef.current.uniforms.uTo.value = tTo.texture;

        if (matRef.current.uniforms.uSettleAnim) {
          matRef.current.uniforms.uSettleAnim.value = 0;
        }
      } catch (e) {}
    }

    animatingRef.current = true;

    // ZOOM TRANSITION PATCH (tetep sama)
    zoomTransition.set(1.05);

    uProgressAnimRef.current = 0;
    settleAnimRef.current = 0;
    let start = null;
    const duration = TRANSITION_DURATION * 1000;

    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      let t = Math.max(0, Math.min(1, elapsed / duration));
      const eased = TRANSITION_EASE(t);
      uProgressAnimRef.current = eased;

      if (matRef.current && matRef.current.uniforms) {
        try {
          matRef.current.uniforms.uProgressAnim.value = uProgressAnimRef.current;
        } catch (e) {}
      }

      if (t < 1) {
        animRafRef.current = requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
        cancelAnimationFrame(animRafRef.current || 0);

        snapToSegment(to);

        // settle-phase
        settleAnimRef.current = 1.0;
        const settleDuration = SETTLE_DURATION * 1000;
        let settleStart = null;

        const settleStep = (ts2) => {
          if (!settleStart) settleStart = ts2;
          const elapsed2 = ts2 - settleStart;
          let tt = Math.max(0, Math.min(1, elapsed2 / settleDuration));
          const eased2 = TRANSITION_EASE(1.0 - tt);
          settleAnimRef.current = eased2;

          if (matRef.current && matRef.current.uniforms) {
            try {
              matRef.current.uniforms.uSettleAnim.value = settleAnimRef.current;
            } catch (e) {}
          }

          if (tt < 1) {
            animRafRef.current = requestAnimationFrame(settleStep);
          } else {
            // settle finished
            settleAnimRef.current = 0;
            uProgressAnimRef.current = 0;

            zoomTransition.set(1);

            if (matRef.current && matRef.current.uniforms) {
              try {
                matRef.current.uniforms.uSettleAnim.value = 0;
                matRef.current.uniforms.uProgressAnim.value = 0;
                matRef.current.uniforms.uFrom.value =
                  texturesRef.current[to].texture;
                matRef.current.uniforms.uTo.value =
                  texturesRef.current[to].texture;
              } catch (e) {}
            }
          }
        };

        animRafRef.current = requestAnimationFrame(settleStep);
      }
    };

    animRafRef.current = requestAnimationFrame(step);
  };

  /* -----------------------
     snapToSegment
     ----------------------- */
     const snapToSegment = (seg) => {
      currentSegmentRef.current = seg;
      setCurrentSegmentUI(seg);
      setActiveSlide(seg); // DOM background ikut pindah
      const snapped = seg * SEGMENT;
      domProgress.set(snapped);
    
      updateAspectUniform(); // << PATCH: sesuaikan aspect tiap ganti slide
      // Per-slide focal point (0–1 range)
const FOCUS_POINTS = [
  { x: 0.45, y: 0.50 }, // Slide 0: TenderTouch - mid slightly left
  { x: 0.60, y: 0.45 }, // Slide 1: Marroosh - shift right + down
  { x: 0.55, y: 0.50 }, // Slide 2: DWM Real Estate - mid-right
];

const fp = FOCUS_POINTS[seg];
if (fp && matRef.current?.uniforms?.uFocus) {
  matRef.current.uniforms.uFocus.value.set(fp.x, fp.y);
}

    };
    
  

    const updateAspectUniform = () => {
      const holder = overlayRef.current;
      const seg = currentSegmentRef.current;
      const tex = texturesRef.current[seg];
      if (!holder || !tex || !matRef.current) return;
    
      const viewportAspect = holder.clientWidth / holder.clientHeight;
      const textureAspect = tex.width / tex.height;
    
      let scaleX = 1;
      let scaleY = 1;
    
      // COVER mode (zoom out / crop if needed)
      if (viewportAspect > textureAspect) {
        // layar lebih lebar → crop horizontal
        scaleY = viewportAspect / textureAspect;
      } else {
        // layar lebih tinggi → crop vertikal
        scaleX = textureAspect / viewportAspect;
      }
    
      try {
        matRef.current.uniforms.uAspect.value.set(scaleX, scaleY);
      } catch (e) {}
    };
    
    
    
  /* -----------------------
     startThree (setup WebGL)
     ----------------------- */
     const startThree = async () => {
      // small delay supaya layout settle dulu
      await new Promise((r) => setTimeout(r, 50));
  
      const holder = overlayRef.current;
      if (!holder) return;
  
      // kalau sebelumnya sudah ada renderer, jangan bikin dobel
      if (rendererRef.current) return;
  
      glContextLostRef.current = false;
  
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(holder.clientWidth, holder.clientHeight);
      renderer.domElement.style.display = "block";
      holder.appendChild(renderer.domElement);
      rendererRef.current = renderer;
  
      const scene = new THREE.Scene();
      sceneRef.current = scene;
  
      const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      cam.position.z = 1;
      camRef.current = cam;
  
      const geometry = new THREE.PlaneGeometry(2, 2);
  
      const uniforms = {
        uFrom: { value: texturesRef.current[0]?.texture || new THREE.Texture() },
        uTo: { value: texturesRef.current[0]?.texture || new THREE.Texture() },
        uProgressAnim: { value: 0 },
        uSettleAnim: { value: 0 },
        uTime: { value: 0 },
        uQuality: { value: detectLowTier() }, // 0 = low tier, 1 = high tier
        uAspect: { value: new THREE.Vector2(1, 1) }, // << ADD THIS
        uFocus: { value: new THREE.Vector2(0.5, 0.5) }, // << ADD THIS

      };
    
  
      const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
  
      matRef.current = material;
  
      const mesh = new THREE.Mesh(geometry, material);
      quadRef.current = mesh;
      scene.add(mesh);
  
      let last = performance.now();
  
      const tick = (now) => {
        const dt = (now - last) / 1000;
        last = now;
  
        // kalau context WebGL sudah hilang, jangan render apa-apa
        if (glContextLostRef.current) {
          rafRef.current = null;
          return;
        }
  
        // kalau section nggak kelihatan, stop loop
        if (!visibleRef.current) {
          rafRef.current = null;
          return;
        }
  
        if (matRef.current && matRef.current.uniforms) {
          try {
            matRef.current.uniforms.uTime.value += dt;
            matRef.current.uniforms.uProgressAnim.value =
              uProgressAnimRef.current;
            matRef.current.uniforms.uSettleAnim.value = settleAnimRef.current;
          } catch (e) {}
        }
  
        try {
          renderer.render(scene, cam);
        } catch (e) {
          // kalau render lempar error karena context lost, matikan loop
          glContextLostRef.current = true;
          rafRef.current = null;
          return;
        }
  
        rafRef.current = requestAnimationFrame(tick);
      };
  
      // ---- WebGL context lost / restored handlers ----
      const handleContextLost = (event) => {
        event.preventDefault();
        glContextLostRef.current = true;
  
        // stop render loop
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
  
      const handleContextRestored = () => {
        glContextLostRef.current = false;
  
        // kalau masih kelihatan di viewport, hidupkan lagi loop
        if (!rafRef.current && visibleRef.current) {
          last = performance.now();
          rafRef.current = requestAnimationFrame(tick);
        }
      };
  
      renderer.domElement.addEventListener(
        "webglcontextlost",
        handleContextLost,
        false
      );
      renderer.domElement.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false
      );
  
      contextListenerRef.current = {
        handleContextLost,
        handleContextRestored,
      };
  
      // ---- Resize handling: debounced ----
      const applyResize = () => {
        if (!holder || !rendererRef.current) return;
        rendererRef.current.setSize(holder.clientWidth, holder.clientHeight);
      };
  
      const scheduleResize = () => {
        if (resizeTimeoutRef.current) return;
  
        resizeTimeoutRef.current = setTimeout(() => {
          resizeTimeoutRef.current = null;
          applyResize();
        }, 150);
      };
  
      window.addEventListener("resize", scheduleResize);
  
      // IntersectionObserver: track apakah overlay (section) kelihatan di viewport
      if ("IntersectionObserver" in window && holder) {
        const io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            const isVisible = entry.isIntersecting;
  
            visibleRef.current = isVisible;
  
            if (isVisible) {
              // kalau baru masuk viewport dan loop lagi mati → hidupkan lagi
              if (!rafRef.current && !glContextLostRef.current) {
                last = performance.now();
                rafRef.current = requestAnimationFrame(tick);
              }
  
              // saat baru kelihatan lagi, pastikan ukuran up to date
              scheduleResize();
            } else {
              // keluar viewport → loop akan berhenti di tick berikutnya
            }
          },
          { threshold: 0.1 }
        );
        io.observe(holder);
        intersectObserverRef.current = io;
      }
  
      // ResizeObserver: juga pakai scheduler, bukan direct apply
      if ("ResizeObserver" in window) {
        resizeObserverRef.current = new ResizeObserver(() => {
          scheduleResize();
        });
        resizeObserverRef.current.observe(holder);
      }
  
      setReady(true);
      updateAspectUniform(); // << ADD THIS
      rafRef.current = requestAnimationFrame(tick);
  
      // ---- CLEANUP ----
      startThree._cleanup = () => {
        // Stop all RAF loops
        cancelAnimationFrame(rafRef.current || 0);
        cancelAnimationFrame(animRafRef.current || 0);
        rafRef.current = null;
  
        // Clear pending resize timer kalau masih ada
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
          resizeTimeoutRef.current = null;
        }
  
        // Disconnect ResizeObserver
        if (resizeObserverRef.current) {
          try {
            resizeObserverRef.current.disconnect();
          } catch (e) {}
          resizeObserverRef.current = null;
        }
  
        // Disconnect IntersectionObserver
        if (intersectObserverRef.current) {
          try {
            intersectObserverRef.current.disconnect();
          } catch (e) {}
          intersectObserverRef.current = null;
        }
  
        // Hapus window resize listener
        window.removeEventListener("resize", scheduleResize);
  
        // Lepas listener context lost/restored
        if (
          contextListenerRef.current &&
          rendererRef.current &&
          rendererRef.current.domElement
        ) {
          const { handleContextLost, handleContextRestored } =
            contextListenerRef.current;
          try {
            rendererRef.current.domElement.removeEventListener(
              "webglcontextlost",
              handleContextLost
            );
            rendererRef.current.domElement.removeEventListener(
              "webglcontextrestored",
              handleContextRestored
            );
          } catch (e) {}
        }
        contextListenerRef.current = null;
  
        // Dispose renderer
        try {
          if (rendererRef.current) {
            rendererRef.current.dispose();
            if (rendererRef.current.forceContextLoss) {
              rendererRef.current.forceContextLoss();
            }
            if (
              rendererRef.current.domElement &&
              rendererRef.current.domElement.parentNode
            ) {
              rendererRef.current.domElement.parentNode.removeChild(
                rendererRef.current.domElement
              );
            }
          }
        } catch (e) {}
        rendererRef.current = null;
  
        // Dispose material & geometry safely
        try {
          if (matRef.current) {
            matRef.current.dispose();
            matRef.current = null;
          }
          if (quadRef.current?.geometry) {
            quadRef.current.geometry.dispose();
          }
        } catch (e) {}
  
        // Dispose textures in cache
        try {
          if (texturesRef.current) {
            texturesRef.current.forEach((t) => {
              if (t?.texture?.dispose) t.texture.dispose();
            });
          }
        } catch (e) {}
  
        texturesRef.current = [];
        glContextLostRef.current = false;
      };
    };
  

  /* -----------------------
     cleanup on unmount
     ----------------------- */
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current || 0);
      cancelAnimationFrame(animRafRef.current || 0);
      if (startThree._cleanup) {
        try {
          startThree._cleanup();
        } catch (e) {}
      }
      try {
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current.forceContextLoss &&
            rendererRef.current.forceContextLoss();
          if (
            rendererRef.current.domElement &&
            rendererRef.current.domElement.parentNode
          ) {
            rendererRef.current.domElement.parentNode.removeChild(
              rendererRef.current.domElement
            );
          }
        }
      } catch (e) {}
      try {
        matRef.current && matRef.current.dispose && matRef.current.dispose();
      } catch (e) {}
      try {
        texturesRef.current &&
          texturesRef.current.forEach(
            (t) => t.texture && t.texture.dispose && t.texture.dispose()
          );
      } catch (e) {}
      if (intersectObserverRef.current) {
        try {
          intersectObserverRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, []);

  /* -----------------------
     Render UI
     ----------------------- */
  return (
    <>
      {/* MAIN: sticky 100vh viewport container (all visible UI sits here) */}
      <main
        ref={mainRef}
        className="sticky -top-px h-screen w-full overflow-hidden bg-black"
        aria-label="carousel main"
      >
        {/* Pipeline 1: hidden canvas -> WebGL */}
        <CarouselPipeline1 ref={p1Ref} onAllTexturesReady={handleAllTexturesReady} />

 


        {/* WebGL overlay (shader) */}
        <motion.div
  ref={overlayRef}
  style={{ scale: zoomCombined }}
  className="absolute inset-0 z-30 pointer-events-none"
  aria-hidden="true"
/>


        {/* Pointer-follow bubble */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
        >
          <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[11px] tracking-widest uppercase text-white/90">
            View
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-[2px] flex gap-2 z-40">
          <div className="relative w-full bg-white/10 overflow-hidden">
            <motion.div style={{ scaleX: p1 }} className="origin-left h-full bg-white" />
          </div>
          <div className="relative w-full bg-white/10 overflow-hidden">
            <motion.div style={{ scaleX: p2 }} className="origin-left h-full bg-white" />
          </div>
          <div className="relative w-full bg-white/10 overflow-hidden">
            <motion.div style={{ scaleX: p3 }} className="origin-left h-full bg-white" />
          </div>
        </div>

        {/* status (debug) */}
        <div className="absolute top-4 right-4 text-white text-xs z-40">
          Pipeline 4 {ready ? "• READY" : "• INIT"} {animatingRef.current ? "• ANIM" : ""}
        </div>
      </main>

      {/* GHOST SCROLL DRIVER */}
      <div
        ref={scrollDriverRef}
        className="h-[1000vh] w-full pointer-events-none opacity-0"
        aria-hidden="true"
      />
    </>
  );
}
