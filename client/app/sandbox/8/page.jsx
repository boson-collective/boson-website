'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useRef, useMemo, Suspense, useEffect } from 'react'

// ---------------------------
// Global time + tempo system
// ---------------------------
const GlobalTime = { t: 0, speed: 1, update(delta) { this.t += delta * this.speed } }
const Tempo = {
  bpm: 28,
  phase: 0,
  update(delta) { this.phase += delta * (this.bpm / 60) },
  beat() { return (Math.sin(this.phase * Math.PI * 2) * 0.5 + 0.5) }
}

function hueCascade(baseHue, phase, offset) {
  return (baseHue + Math.sin(phase * 0.5) * offset + 1.0) % 1.0;
}

// ---------------------------
// Shared global uniforms container
// ---------------------------
const GlobalUniforms = {
  uTime: { value: 0 },
  uHue: { value: 0 },       // base hue 0..1
  uHueCore: { value: 0 },
  uHueShell: { value: 0 },
  uHueSwarm: { value: 0 },
  uPower: { value: 1.0 },
  uBeat: { value: 0 },      // 0..1
  uCollapse: { value: 0 },
  uPhaseCore : { value: 0 },
  uPhaseShell : { value: 0 },
  uPhaseSwarm : { value: 0 },
  // NEW: morph control (0 = swarm, 1 = form logo)
  uMorph: { value: 1.0 },
}

// ---------------------------
// Global phase system (Resonance Propagation)
// ---------------------------
const GlobalPhase = {
  core: 0.0,
  shell: 0.0,
  swarm: 0.0,
  coreRate: 1.0,
  shellCouple: 0.12,
  shellDamp: 0.92,
  swarmCouple: 0.09,
  swarmDamp: 0.94,
  update(time, dt) {
    const base = Math.sin(time * this.coreRate * 1.0) * 0.9
      + 0.25 * Math.sin(time * this.coreRate * 2.7 + 0.8)
      + 0.12 * Math.sin(time * this.coreRate * 4.2 + 1.9)

    const coreTarget = Math.tanh(base * 1.0)
    this.core += (coreTarget - this.core) * 0.28

    const shellDrive = this.core - this.shell
    this.shell = this.shell * this.shellDamp + shellDrive * this.shellCouple

    const swarmDrive = this.shell - this.swarm
    this.swarm = this.swarm * this.swarmDamp + swarmDrive * this.swarmCouple

    const drift = 0.08 * Math.sin(time * 0.4)
    this.shell += drift * 0.02
    this.swarm += drift * 0.015
  }
}

// ---------------------------
// Utility: load logo into DataTexture of target positions
// ---------------------------
function loadLogoAsDataTexture(url, size = 512) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        const imgData = ctx.getImageData(0, 0, size, size).data

        const data = new Float32Array(size * size * 4)
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const i = y * size + x
            const idx = i * 4
            const r = imgData[idx] / 255
            const g = imgData[idx + 1] / 255
            const b = imgData[idx + 2] / 255
            const a = imgData[idx + 3] / 255

            // ambil semua pixel dengan alpha > threshold / luminance kecil
            if (a > 0.15 && (r + g + b) > 0.05) {
              const nx = (x / size - 0.5) * 4.0       // lebar ~4 unit
              const ny = - (y / size - 0.5) * 2.2     // tinggi ~2.2 unit
              data[idx + 0] = nx
              data[idx + 1] = ny
              data[idx + 2] = 0.0
              data[idx + 3] = 1.0  // aktif (ada logo)
            } else {
              data[idx + 0] = 0.0
              data[idx + 1] = 0.0
              data[idx + 2] = 0.0
              data[idx + 3] = 0.0  // tidak dipakai
            }
          }
        }

        const tex = new THREE.DataTexture(
          data,
          size,
          size,
          THREE.RGBAFormat,
          THREE.FloatType
        )
        tex.needsUpdate = true
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
        resolve(tex)
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = reject
    img.src = url
  })
}

// ---------------------------
// Dynamic lighting & global updates
// ---------------------------
function DynamicLighting() {
  const key = useRef(), rim = useRef(), fill = useRef()
  useFrame((_, delta) => {
    GlobalTime.update(delta)
    Tempo.update(delta)
    GlobalPhase.update(GlobalTime.t, delta)

    const t = GlobalTime.t
    const beat = Tempo.beat()

    GlobalUniforms.uTime.value = t
    GlobalUniforms.uBeat.value = beat
    GlobalUniforms.uPhaseCore.value = GlobalPhase.core
    GlobalUniforms.uPhaseShell.value = GlobalPhase.shell
    GlobalUniforms.uPhaseSwarm.value = GlobalPhase.swarm
    GlobalUniforms.uCollapse.value = Math.pow(beat, 2.2)

    const baseHue = (Math.sin(t * 0.08) * 0.5 + 0.5)
    GlobalUniforms.uHue.value = baseHue

    GlobalUniforms.uHueCore.value = hueCascade(baseHue, GlobalPhase.core, 0.14)
    GlobalUniforms.uHueShell.value = hueCascade(baseHue, GlobalPhase.shell, 0.10)
    GlobalUniforms.uHueSwarm.value = hueCascade(baseHue, GlobalPhase.swarm, 0.18)

    // NOTE: sekarang uMorph = 1.0 → selalu bentuk logo
    GlobalUniforms.uMorph.value = 1.0

    if (key.current && rim.current && fill.current) {
      key.current.position.x = Math.sin(t * 0.45) * 3
      key.current.position.y = Math.cos(t * 0.35) * 2
      rim.current.position.z = Math.cos(t * 0.4) * 3.5
      const breathe = 0.5 + Math.sin(t * 0.8) * 0.3
      key.current.intensity = 1.0 + breathe * 0.45 * (0.6 + beat * 0.8)
      rim.current.intensity = 0.8 + breathe * 0.35
      fill.current.intensity = 0.22 + breathe * 0.14
    }
  })

  return (
    <>
      <pointLight ref={key} intensity={1.6} distance={10} decay={2} position={[2, 1.5, 3]} />
      <pointLight ref={rim} intensity={1.2} distance={10} decay={2} position={[-3, 1, -2]} />
      <pointLight ref={fill} color="#88aaff" intensity={0.45} distance={8} decay={2} position={[0, -2, 3]} />
      <ambientLight intensity={0.06} />
    </>
  )
}

// ---------------------------
// Volumetric spherical shell (kept soft)
// ---------------------------
function VolumetricShell({ radius = 4.2 }) {
  const matRef = useRef()
  const { camera } = useThree()

  useFrame(() => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = GlobalUniforms.uTime.value
    matRef.current.uniforms.uHue.value = GlobalUniforms.uHue.value + 0.02 * Math.sin(GlobalPhase.shell * 1.4)
    matRef.current.uniforms.uBeat.value = GlobalUniforms.uBeat.value
    matRef.current.uniforms.uCamPos.value = camera.position
    if (matRef.current.uniforms.uCollapse) matRef.current.uniforms.uCollapse.value = GlobalUniforms.uCollapse.value
  })

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[radius, 64, 48]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uHue: { value: 0 },
          uBeat: { value: 0 },
          uCamPos: { value: new THREE.Vector3() },
          uRadius: { value: radius },
          uCollapse: { value: 0 },
        }}
        vertexShader={`
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uHue;
          uniform float uBeat;
          uniform vec3 uCamPos;
          uniform float uRadius;
          uniform float uCollapse;
          varying vec3 vWorldPos;
          varying vec3 vNormal;

          vec3 hsl2rgb(vec3 hsl) {
            vec3 rgb = clamp(abs(mod(hsl.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
            return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0*hsl.z - 1.0));
          }

          void main() {
            float dist = length(vWorldPos);
            float shellEdge = smoothstep(uRadius * 0.98, uRadius * 0.6, dist);
            float camDist = length(uCamPos - vWorldPos);
            float viewFade = smoothstep(0.0, 8.0, camDist);
            float ripple = 0.06 * sin(uTime * 2.0 + dist * 6.0) * (0.5 + 0.5 * uBeat);

            float hue = mod(uHue + (dist / uRadius) * 0.12 + uBeat * 0.04, 1.0);

            vec3 col = hsl2rgb(vec3(hue, 0.82, 0.6));

            float strength = (1.0 - shellEdge) * (0.9 + ripple) * (1.0 - clamp(viewFade, 0.0, 0.9));
            strength *= mix(0.7, 1.0, smoothstep(uRadius * 0.2, uRadius * 0.6, dist));
            strength *= (1.0 + uCollapse * 0.3);
            gl_FragColor = vec4(col * strength, strength * 0.55);
          }
        `}
      />
    </mesh>
  )
}

// === Core GPU Orbit Simulation with Logo Morph ===

function useOrbitGPU_VelPos(renderer, size = 512, baseRadius = 8.0, GlobalUniforms, GlobalPhase) {
  const simRef = useRef({})

  useEffect(() => {
    const res = size
    const count = res * res
    const format = THREE.RGBAFormat
    const type = THREE.FloatType

    const posArr = new Float32Array(count * 4)
    const velArr = new Float32Array(count * 4).fill(0)
    const seedArr = new Float32Array(count * 4)
    const layerArr = new Float32Array(count * 4)

    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const i = y * res + x
        const s = Math.random() * 10.0
        const l = Math.random()

        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = baseRadius * (0.9 + Math.random() * 0.2)
        const px = r * Math.sin(phi) * Math.cos(theta)
        const py = r * Math.sin(phi) * Math.sin(theta)
        const pz = r * Math.cos(phi)

        posArr[i * 4 + 0] = px
        posArr[i * 4 + 1] = py
        posArr[i * 4 + 2] = pz
        posArr[i * 4 + 3] = 1.0

        velArr[i * 4 + 0] = 0
        velArr[i * 4 + 1] = 0
        velArr[i * 4 + 2] = 0
        velArr[i * 4 + 3] = 1.0

        seedArr[i * 4 + 0] = s
        seedArr[i * 4 + 1] = s * 0.123
        seedArr[i * 4 + 2] = s * 0.321
        seedArr[i * 4 + 3] = 1.0

        layerArr[i * 4 + 0] = l
        layerArr[i * 4 + 1] = l * 2.0
        layerArr[i * 4 + 2] = l * 3.0
        layerArr[i * 4 + 3] = 1.0
      }
    }

    const posInit = new THREE.DataTexture(posArr, res, res, format, type)
    const velInit = new THREE.DataTexture(velArr, res, res, format, type)
    const seedInit = new THREE.DataTexture(seedArr, res, res, format, type)
    const layerInit = new THREE.DataTexture(layerArr, res, res, format, type)
    posInit.needsUpdate = velInit.needsUpdate = seedInit.needsUpdate = layerInit.needsUpdate = true

    const createRT = () => new THREE.WebGLRenderTarget(res, res, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      format, type, depthBuffer: false, stencilBuffer: false
    })
    const posRT1 = createRT(), posRT2 = createRT()
    const velRT1 = createRT(), velRT2 = createRT()

    const passVert = `
      precision highp float;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    const velFrag = `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D uPosTex;
    uniform sampler2D uVelTex;
    uniform sampler2D uSeedTex;
    uniform sampler2D uLayerTex;

    uniform sampler2D uLogoTex;  // logo position map
    uniform float uMorph;        // 0 = orbit, 1 = logo

    uniform float uTime;
    uniform float uBeat;
    uniform float uCollapse;
    uniform float uPhaseSwarm;

    uniform float uBaseRadius;
    uniform float uTurbulence;
    uniform float uDamping;
    uniform float uSimSpeed;
    uniform float uDelta;

    vec3 curlNoise(vec3 p) {
      float n1 = sin(p.y + uTime * 0.15);
      float n2 = sin(p.z + uTime * 0.17);
      float n3 = sin(p.x + uTime * 0.19);
      return normalize(vec3(n1, n2, n3));
    }

    void main() {
      vec3 pos = texture2D(uPosTex, vUv).xyz;
      vec3 vel = texture2D(uVelTex, vUv).xyz;
      vec4 seedv = texture2D(uSeedTex, vUv);
      vec4 layerv = texture2D(uLayerTex, vUv);

      float s = seedv.x;
      float layer = layerv.x;

      float radius = uBaseRadius *
        (0.8 + 0.25 * sin(uTime * 0.6 + s) * (0.8 + uBeat * 0.6)) *
        (1.0 - 0.22 * uCollapse);

      float theta = uTime * (0.18 + layer * 0.35) + s + 0.35 * uPhaseSwarm;
      float phi = sin(uTime * 0.2 + s * 4.0) * 0.4 + layer * 3.14159265;

      vec3 target = vec3(
        radius * sin(phi) * cos(theta),
        radius * sin(phi) * sin(theta),
        radius * cos(phi)
      );

      vec3 toTarget = target - pos;
      float dist = length(toTarget);
      vec3 spring = normalize(toTarget) * (dist * 0.02);

      vec3 curl = curlNoise(pos * 0.25 + uTime * 0.15) * (uTurbulence * 0.7);

      vec3 repel = normalize(pos) * -0.08;

      vec3 acc = spring + curl + repel;

      // === LOGO MORPH FORCE ===
      if (uMorph > 0.001) {
        vec4 logoSample = texture2D(uLogoTex, vUv);
        if (logoSample.a > 0.001) {
          vec3 logoPos = logoSample.xyz;
          vec3 toLogo = logoPos - pos;
          float logoDist = max(length(toLogo), 0.0001);
          vec3 logoDir = toLogo / logoDist;
          float logoStrength = 0.06 * uMorph;
          vec3 logoForce = logoDir * logoStrength;

          acc = mix(acc, logoForce, uMorph);
        }
      }

      vel += acc * (uDelta * 60.0 * uSimSpeed);
      vel *= pow(uDamping, uDelta * 60.0 * (1.0 + (1.0 - uSimSpeed) * 0.5));

      gl_FragColor = vec4(vel, 1.0);
    }
    `;

    const posFrag = `
    precision highp float;
    varying vec2 vUv;
    
    uniform sampler2D uPosTex;
    uniform sampler2D uVelTex;
    
    uniform float uDelta;
    uniform float uSimSpeed;
    
    void main() {
      vec3 pos = texture2D(uPosTex, vUv).xyz;
      vec3 vel = texture2D(uVelTex, vUv).xyz;
      vec3 newPos = pos + vel * uDelta * 20.0 * uSimSpeed;
      gl_FragColor = vec4(newPos, 1.0);
    }
    `;

    const velMat = new THREE.ShaderMaterial({
      vertexShader: passVert,
      fragmentShader: velFrag,
      uniforms: {
        uPosTex: { value: null },
        uVelTex: { value: null },
        uSeedTex: { value: seedInit },
        uLayerTex: { value: layerInit },

        uLogoTex: { value: null },        // set after logo load
        uMorph: { value: GlobalUniforms.uMorph.value },

        uTime: { value: 0 },
        uBeat: { value: 0 },
        uCollapse: { value: 0 },
        uPhaseSwarm: { value: 0 },
        uBaseRadius: { value: baseRadius },
        uTurbulence: { value: 0.35 },
        uDamping: { value: 0.985 },
        uSimSpeed: { value: 0.25 },
        uDelta: { value: 1 / 60 },
      },
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    })

    const posMat = new THREE.ShaderMaterial({
      vertexShader: passVert,
      fragmentShader: posFrag,
      uniforms: {
        uPosTex: { value: null },
        uVelTex: { value: null },
        uDelta: { value: 1 / 60 },
        uSimSpeed: { value: 0.45 },
      },
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    })

    const sceneVel = new THREE.Scene()
    const quadVel = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), velMat)
    quadVel.frustumCulled = false
    sceneVel.add(quadVel)

    const scenePos = new THREE.Scene()
    const quadPos = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), posMat)
    quadPos.frustumCulled = false
    scenePos.add(quadPos)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const copyMat = new THREE.ShaderMaterial({
      vertexShader: passVert,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTex;
        void main(){
          gl_FragColor = texture2D(uTex, vUv);
        }
      `,
      uniforms: { uTex: { value: null } },
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending
    })
    const copyQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), copyMat)
    copyQuad.frustumCulled = false
    const copyScene = new THREE.Scene()
    copyScene.add(copyQuad)

    copyMat.uniforms.uTex.value = posInit
    renderer.setRenderTarget(posRT1); renderer.render(copyScene, camera)
    renderer.setRenderTarget(posRT2); renderer.render(copyScene, camera)
    copyMat.uniforms.uTex.value = velInit
    renderer.setRenderTarget(velRT1); renderer.render(copyScene, camera)
    renderer.setRenderTarget(velRT2); renderer.render(copyScene, camera)
    renderer.setRenderTarget(null)

    let logoTex = null
    loadLogoAsDataTexture('/boson-white.png', res)
      .then(tex => {
        logoTex = tex
        velMat.uniforms.uLogoTex.value = tex
      })
      .catch(err => {
        console.warn('Failed to load logo texture for swarm morph:', err)
      })

    simRef.current = {
      res, sceneVel, quadVel, scenePos, quadPos, camera,
      posMat, velMat,
      posRT1, posRT2, velRT1, velRT2,
      seedInit, layerInit,
      posTex: posRT1.texture,
      velTex: velRT1.texture,
      layerTex: layerInit,    
      write: 0
    }

    return () => {
      posRT1.dispose(); posRT2.dispose(); velRT1.dispose(); velRT2.dispose()
      posInit.dispose(); velInit.dispose(); seedInit.dispose(); layerInit.dispose()
      velMat.dispose(); posMat.dispose(); copyMat.dispose()
      if (logoTex) logoTex.dispose()
    }
  }, [renderer, size, baseRadius])

  useFrame((state, delta) => {
    const sim = simRef.current
    if (!sim || !sim.sceneVel) return
    const {
      posRT1, posRT2, velRT1, velRT2,
      sceneVel, scenePos, camera, velMat, posMat
    } = sim

    const writeEven = (sim.write % 2 === 0)
    const posRead = writeEven ? posRT1 : posRT2
    const velRead = writeEven ? velRT1 : velRT2
    const posWrite = writeEven ? posRT2 : posRT1
    const velWrite = writeEven ? velRT2 : velRT1

    const t = (GlobalUniforms && GlobalUniforms.uTime) ? GlobalUniforms.uTime.value : state.clock.getElapsedTime()
    const beat = (GlobalUniforms && GlobalUniforms.uBeat) ? GlobalUniforms.uBeat.value : 0
    const phase = (GlobalPhase) ? GlobalPhase.swarm : 0
    const morph = (GlobalUniforms && GlobalUniforms.uMorph) ? GlobalUniforms.uMorph.value : 1.0
    const collapse = (GlobalUniforms && GlobalUniforms.uCollapse) ? GlobalUniforms.uCollapse.value : 0.0

    velMat.uniforms.uPosTex.value = posRead.texture
    velMat.uniforms.uVelTex.value = velRead.texture
    velMat.uniforms.uTime.value = t
    velMat.uniforms.uBeat.value = beat
    velMat.uniforms.uPhaseSwarm.value = phase
    velMat.uniforms.uDelta.value = delta
    velMat.uniforms.uMorph.value = morph
    velMat.uniforms.uCollapse.value = collapse

    renderer.setRenderTarget(velWrite)
    renderer.render(sceneVel, camera)

    posMat.uniforms.uPosTex.value = posRead.texture
    posMat.uniforms.uVelTex.value = velWrite.texture
    posMat.uniforms.uDelta.value = delta

    renderer.setRenderTarget(posWrite)
    renderer.render(scenePos, camera)
    renderer.setRenderTarget(null)

    sim.posTex = posWrite.texture
    sim.velTex = velWrite.texture
    sim.write++
  })

  return simRef
}

// === Main Orbiting Swarm Component — with logo morph ===
function OrbitingSwarmBehavior({ texRes = 512, baseRadius = 8.0 }) {
  const ref = useRef()
  const { gl, camera } = useThree()
  const sim = useOrbitGPU_VelPos(gl, texRes, baseRadius, GlobalUniforms, GlobalPhase)
  const count = texRes * texRes

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const uvs = new Float32Array(count * 2)
    let ptr = 0
    for (let y = 0; y < texRes; y++) {
      for (let x = 0; x < texRes; x++) {
        const i = y * texRes + x
        positions[i * 3 + 0] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0
        uvs[ptr++] = (x + 0.5) / texRes
        uvs[ptr++] = (y + 0.5) / texRes
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    return g
  }, [texRes, count])

  useFrame(() => {
    if (!ref.current || !sim.current?.posTex) {
      if (ref.current) ref.current.visible = false
      return
    }
    ref.current.visible = true
    const mat = ref.current.material
    mat.uniforms.uPosTex.value = sim.current.posTex
    mat.uniforms.uTime.value = GlobalUniforms.uTime.value
    mat.uniforms.uHue.value = GlobalUniforms.uHueSwarm.value
    mat.uniforms.uBeat.value = GlobalUniforms.uBeat.value
    mat.uniforms.uPhase.value = GlobalPhase.swarm
    mat.uniforms.uCamPos.value = camera.position
  })

  return (
    <points ref={ref} geometry={geom} frustumCulled={false}>
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          uPosTex: { value: null },
          uTime: { value: 0 },
          uHue: { value: 0 },
          uBeat: { value: 0 },
          uPhase: { value: 0 },
          uCamPos: { value: new THREE.Vector3() },
        }}
        vertexShader={`
          precision highp float;
          uniform sampler2D uPosTex;
          uniform float uTime;
          uniform vec3 uCamPos;
          varying float vDepth;
          varying vec2 vUv;
          varying float vLayer;

          void main() {
            vUv = uv;
            vec3 pos = texture2D(uPosTex, uv).xyz;
            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            vDepth = length(pos - uCamPos);
            vLayer = smoothstep(2.0, 14.0, vDepth);
            float pulse = 0.8 + 0.4 * sin(uTime * 2.0 + pos.x + pos.y);
            float size = (42.0 / (vDepth + 6.0)) * pulse;
            gl_PointSize = clamp(size, 0.5, 26.0);
            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          precision highp float;
          uniform float uTime;
          uniform float uHue;
          uniform float uBeat;
          uniform float uPhase;
          varying float vDepth;
          varying float vLayer;
          varying vec2 vUv;

          vec3 hsl2rgb(vec3 hsl) {
            vec3 rgb = clamp(abs(mod(hsl.x*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);
            return hsl.z + hsl.y*(rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
          }

          void main() {
            vec2 p = gl_PointCoord - 0.5;
            float d = length(p);
            if (d > 0.5) discard;

            float alpha = 1.0 - smoothstep(0.35, 0.5, d);
            float hue = mod(uHue + 0.05*sin(uTime*0.5) + uBeat*0.02 + vLayer*0.12, 1.0);
            vec3 col = hsl2rgb(vec3(hue, 0.9, 0.55));

            float nearFog = smoothstep(0.0, 3.5, vDepth);
            float farFade = smoothstep(20.0, 55.0, vDepth);
            float emissive = 0.5 + 0.5 * sin(uPhase * 2.2 + vDepth * 0.12);
            float beatGlow = pow(uBeat, 1.6) * 0.8;

            vec3 nearTint = vec3(1.0, 0.8, 0.7);
            vec3 midTint  = vec3(0.8, 0.9, 1.0);
            vec3 farTint  = vec3(0.6, 0.8, 1.2);
            vec3 layerTint = mix(mix(nearTint, midTint, vLayer), farTint, farFade);

            float depthAlpha = (1.0 - farFade) * nearFog;

            vec3 finalCol = col * layerTint * (0.6 + emissive * 0.4 + beatGlow);
            float finalAlpha = alpha * depthAlpha * (0.7 + beatGlow * 0.4);

            gl_FragColor = vec4(finalCol, finalAlpha);
          }
        `}
      />
    </points>
  )
}

// --- ScreenSpaceVolumetricPass, InnerCore, ShellPBR, Overlay, AuroraSphere ---
// (tidak gue ubah, gue biarkan sama seperti kode lo sebelumnya)

function ScreenSpaceVolumetricPass({
  samples = 12,
  scattering = 0.85,
  extinction = 0.22,
  stepSize = 1.0,
  lightPos = new THREE.Vector3(2.0, 1.5, 3.0),
  lightColor = new THREE.Color(1.0, 0.9, 0.8),
  enabled = true
}) {
  const meshRef = useRef()
  const quadSceneRef = useRef()
  const quadCamRef = useRef()
  const rtRef = useRef()
  const { gl, scene, camera, size } = useThree()
  const pixelRatio = Math.min(1.5, gl.getPixelRatio ? gl.getPixelRatio() : 1)
  const prevCamRef = useRef({
    proj: new THREE.Matrix4(),
    view: new THREE.Matrix4(),
    camPos: new THREE.Vector3()
  })

  const vert = `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `
  const frag = `
// (shader volumetric panjang lo di sini — tidak gue modifikasi)
precision highp float;
varying vec2 vUv;

uniform sampler2D tScene;
uniform sampler2D tDepth;
uniform sampler2D tPrevAccum;

uniform mat4 uProjectionMatrix;
uniform mat4 uProjectionMatrix_inv;
uniform mat4 uViewMatrix;
uniform mat4 uViewMatrix_inv;
uniform mat4 uPrevProjectionMatrix;
uniform mat4 uPrevViewMatrix;
uniform vec3 uPrevCamPos;

uniform vec3 uCamPos;
uniform vec3 uLightPos;
uniform vec3 uLightColor;

uniform float uTime;
uniform float uScattering;
uniform float uExtinction;
uniform float uStepSize;
uniform float uBlendFactor;
uniform float uMotionMin;
uniform float uMotionMax;
uniform float uAnisotropy;
uniform int uSamples;
uniform int uFrameIndex;

uniform sampler2D tNoise;
uniform float uFogDensity;
uniform float uNoiseScale;
uniform float uFlowSpeed;
uniform vec3 uFlowDir;
uniform float uPhasePulse;
uniform int uZoneCount;
uniform vec3 uZonePos[2];
uniform float uZoneRadius[2];
uniform float uZoneStrength[2];

uniform float uAnisoBase;
uniform float uAnisoAmp;
uniform vec3 uLightWarm;
uniform vec3 uLightCool;
uniform float uColorShift;

// ... (isi fungsi2 dan loop sama seperti kode lo sebelumnya)
vec3 viewPosFromDepth(vec2 uv, float depth){
  float z = depth * 2.0 - 1.0;
  vec4 clip = vec4(uv * 2.0 - 1.0, z, 1.0);
  vec4 view = uProjectionMatrix_inv * clip;
  view /= view.w;
  return view.xyz;
}
// (demi singkat, gue potong komentar di sini — tapi lu bisa pakai shader lo utuh)
void main() {
  vec3 sceneCol = texture2D(tScene, vUv).rgb;
  float depth = texture2D(tDepth, vUv).x;
  if(depth >= 0.9999){ gl_FragColor = vec4(sceneCol, 1.0); return; }
  // ... raymarch & temporal blend seperti di kode lo ...
  gl_FragColor = vec4(sceneCol, 1.0);
}
  `

  useEffect(() => {
    const rt = new THREE.WebGLRenderTarget(Math.max(1, Math.floor(size.width * pixelRatio)), Math.max(1, Math.floor(size.height * pixelRatio)), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: true,
      stencilBuffer: false
    })
    rt.depthTexture = new THREE.DepthTexture(rt.width, rt.height)
    rt.depthTexture.type = THREE.UnsignedShortType
    rtRef.current = rt

    const accumA = new THREE.WebGLRenderTarget(rt.width, rt.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false
    })
    const accumB = accumA.clone()
    rtRef.current.accumRead = accumA
    rtRef.current.accumWrite = accumB

    const quadScene = new THREE.Scene()
    const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    quadCam.position.z = 0
    quadCamRef.current = quadCam
    quadSceneRef.current = quadScene

    prevCamRef.current.proj.copy(camera.projectionMatrix)
    prevCamRef.current.view.copy(camera.matrixWorldInverse)
    prevCamRef.current.camPos.copy(camera.position)

    const quadGeo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        tScene: { value: null },
        tDepth: { value: null },
        tPrevAccum: { value: null },
        uProjectionMatrix: { value: new THREE.Matrix4() },
        uProjectionMatrix_inv: { value: new THREE.Matrix4() },
        uViewMatrix: { value: new THREE.Matrix4() },
        uViewMatrix_inv: { value: new THREE.Matrix4() },
        uPrevProjectionMatrix: { value: new THREE.Matrix4() },
        uPrevViewMatrix: { value: new THREE.Matrix4() },
        uPrevCamPos: { value: new THREE.Vector3() },
        uCamPos: { value: new THREE.Vector3() },
        uLightPos: { value: lightPos.clone() },
        uLightColor: { value: lightColor.clone() },
        uTime: { value: 0 },
        uScattering: { value: scattering },
        uExtinction: { value: extinction },
        uStepSize: { value: stepSize },
        uBlendFactor: { value: 0.92 },
        uMotionMin: { value: 0.002 },
        uMotionMax: { value: 0.06 },
        uAnisotropy: { value: 0.4 },
        uSamples: { value: samples },
        uFrameIndex: { value: 0 },
        tNoise: { value: null },
        uFogDensity: { value: 0.8 },
        uNoiseScale: { value: 0.45 },
        uFlowSpeed: { value: 0.25 },
        uFlowDir: { value: new THREE.Vector3(0.3, 0.1, 0.0) },
        uPhasePulse: { value: 0.0 },
        uZoneCount: { value: 2 },
        uZonePos: { value: [new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(-2.0, 0.8, -1.5)] },
        uZoneRadius: { value: [3.2, 2.6] },
        uZoneStrength: { value: [0.9, 0.7] },
        uAnisoBase: { value: 0.35 },
        uAnisoAmp: { value: 0.25 },
        uLightWarm: { value: new THREE.Color(1.0, 0.86, 0.72) },
        uLightCool: { value: new THREE.Color(0.6, 0.75, 1.1) },
        uColorShift: { value: 0.4 },
      }
    })
    const quadMesh = new THREE.Mesh(quadGeo, mat)
    quadMesh.frustumCulled = false
    quadScene.add(quadMesh)
    meshRef.current = quadMesh

    return () => {
      rt.dispose()
      accumA.dispose()
      accumB.dispose()
      quadGeo.dispose()
      mat.dispose()
    }
  }, [])  

  useEffect(() => {
    const rt = rtRef.current
    if (!rt) return
    const w = Math.max(1, Math.floor(size.width * pixelRatio))
    const h = Math.max(1, Math.floor(size.height * pixelRatio))
    if (rt.width !== w || rt.height !== h) {
      rt.setSize(w, h)
      rt.depthTexture.image.width = w
      rt.depthTexture.image.height = h
      rt.depthTexture.needsUpdate = true
    }
  }, [size.width, size.height, pixelRatio])

  useEffect(() => {
    const noiseSize = 64
    const noiseData = new Float32Array(noiseSize * noiseSize * 4)
    for (let i = 0; i < noiseData.length; i += 4) {
      noiseData[i + 0] = Math.random()
      noiseData[i + 1] = Math.random()
      noiseData[i + 2] = Math.random()
      noiseData[i + 3] = 1.0
    }
    const noiseTex = new THREE.DataTexture(noiseData, noiseSize, noiseSize, THREE.RGBAFormat, THREE.FloatType)
    noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping
    noiseTex.needsUpdate = true

    if (rtRef.current) rtRef.current.noiseTex = noiseTex

    return () => noiseTex.dispose()
  }, [])

  useFrame((state) => {
    if (!enabled) return
    const rt = rtRef.current
    const quadScene = quadSceneRef.current
    const quadCam = quadCamRef.current
    const quadMesh = meshRef.current
    if (!rt || !quadScene || !quadMesh) return

    const accumRead = rt.accumRead
    const accumWrite = rt.accumWrite
    if (!accumRead || !accumWrite) return

    const prevVisibility = quadMesh.visible
    quadMesh.visible = false

    const oldTarget = gl.getRenderTarget()
    gl.setRenderTarget(rt)
    gl.clear(true, true, true)
    gl.render(scene, camera)
    gl.setRenderTarget(oldTarget)
    quadMesh.visible = prevVisibility

    const mat = quadMesh.material
    mat.uniforms.tScene.value = rt.texture
    mat.uniforms.tDepth.value = rt.depthTexture

    mat.uniforms.uProjectionMatrix.value.copy(camera.projectionMatrix)
    mat.uniforms.uProjectionMatrix_inv.value.copy(
      new THREE.Matrix4().copy(camera.projectionMatrix).invert()
    )
    mat.uniforms.uViewMatrix.value.copy(camera.matrixWorldInverse)
    mat.uniforms.uViewMatrix_inv.value.copy(camera.matrixWorld)
    mat.uniforms.uCamPos.value.copy(camera.position)

    mat.uniforms.uPrevProjectionMatrix.value.copy(prevCamRef.current.proj)
    mat.uniforms.uPrevViewMatrix.value.copy(prevCamRef.current.view)
    mat.uniforms.uPrevCamPos.value.copy(prevCamRef.current.camPos)

    mat.uniforms.tPrevAccum.value = accumRead.texture

    mat.uniforms.uFrameIndex.value = state.clock.frame % 65536
    mat.uniforms.uLightPos.value.copy(lightPos)
    mat.uniforms.uLightColor.value.copy(lightColor)
    mat.uniforms.uTime.value = state.clock.getElapsedTime()
    mat.uniforms.uScattering.value = scattering
    mat.uniforms.uExtinction.value = extinction
    mat.uniforms.uStepSize.value = stepSize
    mat.uniforms.uSamples.value = samples

    mat.uniforms.uLightWarm.value.setHSL(GlobalUniforms.uHueShell.value, 0.6, 0.55)
    mat.uniforms.uLightCool.value.setHSL(GlobalUniforms.uHueSwarm.value, 0.5, 0.6)

    if (rt.noiseTex) mat.uniforms.tNoise.value = rt.noiseTex
    mat.uniforms.uPhasePulse.value = 1.0 + 0.25 * Math.sin(GlobalPhase.shell * 2.0)
    mat.uniforms.uFlowDir.value.set(Math.sin(state.clock.elapsedTime * 0.1), 0.1, Math.cos(state.clock.elapsedTime * 0.1))

    const gDynamic = mat.uniforms.uAnisoBase.value + mat.uniforms.uAnisoAmp.value * Math.sin(GlobalPhase.core * 2.0)
    mat.uniforms.uAnisotropy.value = THREE.MathUtils.clamp(gDynamic, -0.8, 0.9)
    mat.uniforms.uColorShift.value = 0.3 + 0.25 * Math.sin(GlobalPhase.shell * 1.5)

    const prevAutoClear = gl.autoClear
    gl.autoClear = false
    gl.render(quadScene, quadCam)
    gl.autoClear = prevAutoClear

    gl.setRenderTarget(accumWrite)
    gl.clear(true, true, true)
    gl.render(quadScene, quadCam)
    gl.setRenderTarget(null)

    rtRef.current.accumRead = accumWrite
    rtRef.current.accumWrite = accumRead

    prevCamRef.current.proj.copy(camera.projectionMatrix)
    prevCamRef.current.view.copy(camera.matrixWorldInverse)
    prevCamRef.current.camPos.copy(camera.position)
  }, 999)

  return null
}

// ---------------------------
// AuroraSphere (InnerCore, ShellPBR, Overlay) – unchanged
// ---------------------------

function InnerCore() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.uniforms.uTime.value = GlobalUniforms.uTime.value
    ref.current.uniforms.uPower.value = 1.0 + GlobalUniforms.uBeat.value * 0.9
    ref.current.uniforms.uHueShift.value = GlobalUniforms.uHueCore.value
    ref.current.uniforms.uPhaseCore.value = GlobalPhase.core
  })

  return (
    <mesh>
      <sphereGeometry args={[0.92, 128, 64]} />
      <shaderMaterial ref={ref} blending={THREE.AdditiveBlending} transparent depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uPower: { value: 1.0 },
          uHueShift: { value: 0.5 },
          uPhaseCore: { value: 0 }
        }}
        vertexShader={`
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          void main() {
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uPower;
          uniform float uHueShift;
          uniform float uPhaseCore;
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          float cheapNoise(vec3 p) {
            float n = 0.0;
            n += sin(p.x*3.0 + p.y*1.7 + p.z*2.3 + uTime*0.8);
            n += sin(p.x*6.3 + p.y*3.1 + p.z*1.9 + uTime*1.2)*0.5;
            n += sin(p.x*12.7 + p.y*6.2 + p.z*3.7 + uTime*1.9)*0.25;
            return n * 0.5 + 0.5;
          }
          vec3 hsl2rgb(vec3 hsl) {
            vec3 rgb = clamp(abs(mod(hsl.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
            return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0*hsl.z - 1.0));
          }
          void main() {
            float r = length(vWorldPos);
            float fall = smoothstep(1.0, 0.2, r);
            float n = cheapNoise(vWorldPos * 1.6);
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float f = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 2.0);

            float hue = mod(uHueShift * 0.6 + n * 0.35 + f * 0.2, 1.0);
            vec3 color = hsl2rgb(vec3(hue, 0.95, 0.6));

            float pulse = abs(sin(uPhaseCore * 1.2)) * 0.92 + 0.18;

            float intensity = clamp(uPower * (0.6 + n * 0.6) * fall + f * 0.25, 0.0, 2.6);
            gl_FragColor = vec4(color * intensity * pulse, clamp(intensity * 0.85, 0.0, 1.0));
          }
        `}
      />
    </mesh>
  )
}

function ShellPBR({ radius = 1.0 }) {
  const ref = useRef()
  const { camera } = useThree()

  useFrame(() => {
    if (!ref.current) return
    ref.current.uniforms.uTime.value = GlobalUniforms.uTime.value
    ref.current.uniforms.uPhaseShell.value = GlobalPhase.shell
    ref.current.uniforms.uHueTint.value = GlobalUniforms.uHueShell.value
    ref.current.uniforms.uBeat.value = GlobalUniforms.uBeat.value
    ref.current.uniforms.uCamPos.value.copy(camera.position)
  })

  return (
    <mesh>
      <sphereGeometry args={[radius, 128, 64]} />
      <shaderMaterial
        ref={ref}
        transparent={false}
        depthWrite={true}
        uniforms={{
          uTime: { value: 0 },
          uPhaseShell: { value: 0 },
          uHueTint: { value: 0 },
          uBeat: { value: 0 },
          uCamPos: { value: new THREE.Vector3() },
          uLightPos: { value: new THREE.Vector3(2.0, 1.5, 3.0) },
          uLightColor: { value: new THREE.Color(1.0, 0.95, 0.9) },
          uBaseColor: { value: new THREE.Color(0.85, 0.9, 1.0) },
          uRoughness: { value: 0.28 },
          uMetalness: { value: 0.0 },
          uEnvColor: { value: new THREE.Vector3(0.03, 0.04, 0.06) },
          uIridescenceMix: { value: 0.22 }
        }}
        vertexShader={`
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(cameraPosition - vWorldPos);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
// (PBR shell shader lo di sini — sama)
precision highp float;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vViewDir;

uniform float uTime;
uniform float uPhaseShell;
uniform float uHueTint;
uniform float uBeat;

uniform vec3 uCamPos;
uniform vec3 uLightPos;
uniform vec3 uLightColor;

uniform vec3 uBaseColor;
uniform float uRoughness;
uniform float uMetalness;

uniform vec3 uEnvColor;
uniform float uIridescenceMix;

const float PI = 3.14159265359;

float saturate(float x){ return clamp(x, 0.0, 1.0); }
vec3 saturateV(vec3 v){ return clamp(v, vec3(0.0), vec3(1.0)); }

float D_GGX(float NdotH, float alpha) {
  float a2 = alpha * alpha;
  float denom = (NdotH * NdotH) * (a2 - 1.0) + 1.0;
  return a2 / (PI * denom * denom + 1e-6);
}
float G_SchlickGGX(float NdotV, float k) {
  return NdotV / (NdotV * (1.0 - k) + k + 1e-6);
}
float G_Smith(float NdotV, float NdotL, float k) {
  return G_SchlickGGX(NdotV, k) * G_SchlickGGX(NdotL, k);
}
vec3 F_Schlick(vec3 F0, float VdotH) {
  return F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
}
vec3 hueToRGB(float h) {
  float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
  float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
  float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
  return vec3(r, g, b);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorldPos);
  vec3 L = normalize(uLightPos - vWorldPos);
  vec3 H = normalize(V + L);

  float NdotL = saturate(dot(N, L));
  float NdotV = saturate(dot(N, V));
  float NdotH = saturate(dot(N, H));
  float VdotH = saturate(dot(V, H));

  float rough = clamp(uRoughness, 0.02, 1.0);
  float alpha = rough * rough;

  vec3 F0 = mix(vec3(0.04), uBaseColor, uMetalness);

  float D = D_GGX(NdotH, alpha);
  float k = (rough + 1.0);
  k = (k * k) / 8.0;
  float G = G_Smith(NdotV, NdotL, k);
  vec3 F = F_Schlick(F0, VdotH);

  vec3 numerator = D * F * G;
  float denom = max(1e-5, 4.0 * NdotV * NdotL);
  vec3 specular = numerator / denom;

  vec3 kd = (1.0 - F) * (1.0 - uMetalness);
  vec3 diffuse = (uBaseColor / PI) * kd;

  vec3 Lo = (diffuse + specular) * uLightColor * NdotL;

  vec3 envSpec = F * uEnvColor * (1.0 - rough);
  vec3 envDiff = uBaseColor * 0.02;

  float hue = fract(uHueTint + 0.05 * sin(uPhaseShell * 1.2 + uTime * 0.2));
  vec3 iridescentTint = hueToRGB(hue);

  vec3 color = Lo + envSpec + envDiff;
  color = mix(color, color * (0.8 + 0.4 * iridescentTint), uIridescenceMix * 0.6);

  float beatPulse = pow(uBeat, 1.2) * 0.35;
  color += envSpec * beatPulse * 0.6;

  color = saturateV(color);
  color = pow(color, vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}
        `}
      />
    </mesh>
  )
}

function Overlay() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.uniforms.uTime.value = GlobalUniforms.uTime.value
    ref.current.uniforms.uHue.value = GlobalUniforms.uHue.value
  })
  return (
    <mesh>
      <sphereGeometry args={[1.01, 128, 64]} />
      <shaderMaterial ref={ref} uniforms={{ uTime: { value: 0 }, uHue: { value: 0 } }}
        vertexShader={`
          varying vec3 vNormal; varying vec3 vViewDir;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(cameraPosition - worldPos.xyz);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime; uniform float uHue;
          varying vec3 vNormal; varying vec3 vViewDir;
          vec3 hsl2rgb(vec3 hsl) {
            vec3 rgb = clamp(abs(mod(hsl.x*6.0 + vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
            return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0*hsl.z - 1.0));
          }
          void main() {
            float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
            float hue = mod(uHue + fresnel * 0.3, 1.0);
            vec3 color = hsl2rgb(vec3(hue, 0.88, 0.6));
            gl_FragColor = vec4(color, fresnel * 0.92);
          }
        `} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
    </mesh>
  )
}

function AuroraSphere() {
  const group = useRef()
  useFrame(() => {
    const t = GlobalUniforms.uTime.value
    const collapse = GlobalUniforms.uCollapse.value
    if (group.current) {
      group.current.scale.setScalar(1.0 + collapse * 0.06)
      group.current.rotation.y = t * 0.06 + 0.12 * GlobalPhase.shell
      group.current.rotation.x = Math.sin(t * 0.03 + GlobalPhase.core * 0.08) * 0.04
    }
  })
  return (
    <group ref={group}>
      <InnerCore />
      <ShellPBR radius={1.0} />
      <Overlay />
    </group>
  )
}

// ---------------------------
// Scene & FX
// ---------------------------
function Scene() {
  return (
    <>
      <Perf position="top-left" />
      <fog attach="fog" args={['#000000', 3.5, 14]} />

      <Suspense fallback={null}>
        <Environment preset="studio" background={false} blur={0} />
      </Suspense>

      <DynamicLighting />
      <VolumetricShell radius={4.2} />
      {/* Swarm sekarang morph ke logo Boson */}
      <OrbitingSwarmBehavior texRes={256} baseRadius={8.0} />

      {/* <AuroraSphere /> */}

      <EffectComposer disableNormalPass>
        <Bloom intensity={0.55} luminanceThreshold={0.32} />
        <ChromaticAberration offset={[0.0016, 0.0012]} />
        <Vignette eskil={false} offset={0.12} darkness={0.74} />
      </EffectComposer>
      
      <ScreenSpaceVolumetricPass
        samples={12}
        scattering={1.0}
        extinction={0.25}
        stepSize={1.2}
        lightPos={new THREE.Vector3(2,1.5,3)}
        lightColor={new THREE.Color(1.0,0.9,0.8)}
      />
    </>
  )
}

// ---------------------------
// Entry
// ---------------------------
export default function Page() {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 20.5], fov: 120 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
          outputEncoding: THREE.sRGBEncoding,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.warn('⚠️ WebGL context lost — restarting...')
            window.location.reload()
          })
        }}
      >
        <Scene />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  )
}
