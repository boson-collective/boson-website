"use client";
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { gsap } from 'gsap';
import GUI from 'lil-gui';


const DEFAULT_BACKGROUND = { 
  color1: [163 / 255, 189 / 255, 230 / 255],
  color2: [54 / 255, 211 / 255, 211 / 255],
  color3: [0 / 255, 1 / 255, 109 / 255],
  colorAccent: new THREE.Color(0.0, 0.0, 0.0),
  uLinesBlur: 0.25,
  uNoise: 0.075,
  uOffsetX: 0.34,
  uOffsetY: 0.0,
  uLinesAmount: 5.0,
};





// ===== utils/lerp.js =====
const lerp = (p1, p2, t) => {
  return p1 + (p2 - p1) * t;
};

// ===== utils/media.js =====
const breakpoints = {
  tablet: 767,
  tabletLand: 992,
  desktop: 1920,
};

// ===== utils/sharedTypes.js =====
const AssetType = {
  MODEL3D: "model3d",
  VIDEO: "video",
  IMAGE: "image",
  CUBE_TEXTURE: "cube_texture",
};

// ===== utils/disposeModel.js =====
const disposeModel = (model) => {
  if(model.children) {
    model.children.forEach(nastedChild => disposeModel(nastedChild));
  }

  if(model instanceof THREE.Mesh) {
    if(model.geometry instanceof THREE.BufferGeometry) {
      model.geometry.dispose();
    }
    if(model.material instanceof THREE.Material) {
      model.material.dispose();
    }
  }
};

// ===== utils/MouseMove.js =====
class MouseMove extends THREE.EventDispatcher {
  static getInstance() {
    if (!MouseMove.instance) {
      MouseMove.canCreate = true;
      MouseMove.instance = new MouseMove();
      MouseMove.canCreate = false;
    }
    return MouseMove.instance;
  }

  constructor() {
    super();

    this.mouseLast = { x: 0, y: 0 };
    this.isTouching = false;
    this.clickStart = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.strength = 0;
    this.isInit = false;

    // ===== bind once =====
    this.onTouchDown = this.onTouchDown.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchUp = this.onTouchUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);

    if (MouseMove.instance || !MouseMove.canCreate) {
      throw new Error('Use MouseMove.getInstance()');
    }

    this.addEvents();
    MouseMove.instance = this;
  }

  addEvents() {
    window.addEventListener('mousedown', this.onTouchDown);
    window.addEventListener('mousemove', this.onTouchMove, { passive: true });
    window.addEventListener('mouseup', this.onTouchUp);
    window.addEventListener('click', this.onClick);
    window.addEventListener('touchstart', this.onTouchDown);
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchUp);
    window.addEventListener('mouseout', this.onMouseLeave);
  }

  removeEvents() {
    window.removeEventListener('mousedown', this.onTouchDown);
    window.removeEventListener('mousemove', this.onTouchMove);
    window.removeEventListener('mouseup', this.onTouchUp);
    window.removeEventListener('click', this.onClick);
    window.removeEventListener('touchstart', this.onTouchDown);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchUp);
    window.removeEventListener('mouseout', this.onMouseLeave);
  }

  onTouchDown(event) {
    this.isInit = true;
    this.isTouching = true;

    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const y = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.mouseLast.x = x;
    this.mouseLast.y = y;
    this.mouse.x = x;
    this.mouse.y = y;

    this.clickStart.x = x;
    this.clickStart.y = y;

    this.dispatchEvent({ type: 'down' });
  }

  onTouchMove(event) {
    this.isInit = true;

    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const y = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const dx = x - this.mouseLast.x;
    const dy = y - this.mouseLast.y;

    // ===== FIX strength =====
    this.strength = Math.sqrt(dx * dx + dy * dy);

    this.mouseLast.x = x;
    this.mouseLast.y = y;

    this.mouse.x += dx;
    this.mouse.y += dy;
  }

  onTouchUp() {
    this.isTouching = false;
    this.dispatchEvent({ type: 'up' });
  }

  onMouseLeave() {
    this.dispatchEvent({ type: 'left' });
  }

  onClick() {
    const clickBounds = 10;
    const dx = Math.abs(this.clickStart.x - this.mouse.x);
    const dy = Math.abs(this.clickStart.y - this.mouse.y);

    if (dx <= clickBounds && dy <= clickBounds) {
      this.dispatchEvent({ type: 'click' });
    }
  }

  update() {
    if (this.isInit) {
      this.dispatchEvent({ type: 'mousemove' });
    }
    this.mouseLast.x = this.mouse.x;
    this.mouseLast.y = this.mouse.y;
  }

  // ===== NEW: lifecycle safe =====
  destroy() {
    this.removeEvents();
    MouseMove.instance = null;
  }
}

MouseMove.canCreate = false;
 

// ===== utils/Preloader.js =====
class Preloader extends THREE.EventDispatcher {
  constructor() {
    super();
    this.assetsLoadedCounter = 0;
    this.dracoLoader = new DRACOLoader();
    this.gltfLoader = new GLTFLoader();
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.assetsToPreload = [];
    this.loadedAssets = {};
    this.dracoLoader.setDecoderPath('/draco/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  _assignAsset(props) {
    const { asset, naturalHeight, naturalWidth, objPropertyName, type } = props;
    this.loadedAssets[objPropertyName] = {
      type,
      asset,
      naturalWidth,
      naturalHeight
    };
    this._onAssetLoaded();
  }

  _preloadTextures() {
    if(this.assetsToPreload.length === 0) {
      return this._onLoadingComplete();
    }

    const handleImageLoad = (item) => {
      const texture = new THREE.Texture();
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.src = item.src;

      const handleLoaded = () => {
        texture.image = image;
        texture.needsUpdate = true;

        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.IMAGE,
          asset: texture,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        });
      };

      if(image.complete) {
        return handleLoaded();
      }

      image.onload = () => {
        handleLoaded();
      }

      image.onerror = () => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.IMAGE,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1
        })
        console.error(`Failed to load image at ${item.src}`);
      };
    };

    const handleVideoLoad = (item) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.loop = true;
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.src = item.src;
      void video.play();

      video.oncanplay = () => {
        const texture = new THREE.VideoTexture(video);
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.VIDEO,
          asset: texture,
          naturalWidth: video.videoWidth,
          naturalHeight: video.videoHeight
        });
      };

      video.onerror = () => {
        const texture = new THREE.VideoTexture(video);
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.VIDEO,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1,
        });
        console.error(`Failed to load video at ${item.src}`);
      };
    };

    const handleModel3DLoad = (item) => {
      this.gltfLoader.load(item.src, (gltf) => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.MODEL3D,
          asset: gltf,
          naturalWidth: 1, 
          naturalHeight: 1
        });
      },
      
      progress => {},

      error => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.MODEL3D,
          asset: null,
          naturalWidth: 1,
          naturalHeight: 1,
        });
        console.error(`Failed to load 3D model at ${item.src} `, error);
      });
    };

    const handleCubeTextureLoad = (item) => {
      const onLoad = (texture) => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.CUBE_TEXTURE,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1
        });
      };
      this.cubeTextureLoader.setPath(`cubeMaps/${item.src}/`);
      this.cubeTextureLoader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], onLoad);
    };

    this.assetsToPreload.forEach(item => {
      switch(item.type) {
        case AssetType.IMAGE: {
          handleImageLoad(item);
          break;
        }
        case AssetType.VIDEO: {
          handleVideoLoad(item);
          break;
        }
        case AssetType.MODEL3D: {
          handleModel3DLoad(item);
          break;
        }
        case AssetType.CUBE_TEXTURE: {
          handleCubeTextureLoad(item);
          break;
        }
        default:
          break;
      }
    });
  }

  _onAssetLoaded() {
    this.assetsLoadedCounter += 1;
    const loadRatio = this.assetsLoadedCounter / this.assetsToPreload.length;
    this.dispatchEvent({ type: 'progress', progress: loadRatio });
    if(loadRatio === 1) {
      this._onLoadingComplete();
    }
  }

  _onLoadingComplete() {
    this.dispatchEvent({ type: 'loaded' });
  }

  setAssetsToPreload(items) {
    this.assetsToPreload = items;
    this._preloadTextures();
  }

  destroy() {
    Object.entries(this.loadedAssets).forEach(([key, item]) => {
      if (!item) return;
  
      switch (item.type) {
        case AssetType.IMAGE: {
          if (item.asset && item.asset.dispose) {
            item.asset.dispose();
          }
          break;
        }
  
        case AssetType.VIDEO: {
          const texture = item.asset;
          const video = texture?.image;
  
          if (video) {
            video.pause();
            video.src = '';
            video.load();
          }
  
          if (texture && texture.dispose) {
            texture.dispose();
          }
          break;
        }
  
        case AssetType.MODEL3D: {
          const gltf = item.asset;
          if (gltf && gltf.scene) {
            disposeModel(gltf.scene);
          }
          break;
        }
  
        case AssetType.CUBE_TEXTURE: {
          if (item.asset && item.asset.dispose) {
            item.asset.dispose();
          }
          break;
        }
  
        default:
          break;
      }
    });
  
    this.loadedAssets = {};
    this.assetsToPreload = [];
  }
  

}

// ===== components/InteractiveObject.js =====
class InteractiveObject extends THREE.Object3D {
  constructor() {
    super();
    this.colliderName = null;
    this._isHoverd = false;
  }

  setColliderName(name) {
    this.colliderName = name;
  }

  onMouseEnter() {
    this._isHoverd = true;
    this.dispatchEvent({ type: 'mouseenter' });
  }

  onMouseLeave() {
    this._isHoverd = false;
    this.dispatchEvent({ type: 'mouseleave' });
  }

  onClick() {
    this.dispatchEvent({ type: 'click' });
  }

  update(updateinfo) {

  }

  destroy() {
    this.removeFromParent();
    this.clear();
  }
  

}

// ===== components/TextTexture.js =====
class TextTexture extends THREE.EventDispatcher {
  constructor({ text, offsetArray, isAnimatedIn }) {
    super();
    this.rendererBounds = { width: 1, height: 1 };
    this.show = 0;
    this.showTween = null;
    this.text1 = text[0];
    this.text2 = text[1];
    this.text3 = text[2];
    this.offsetArray = offsetArray;
    if(isAnimatedIn) { this.show = 1 };
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.Texture(this.canvas);
  }

  setSize() {
    if(this.canvas && this.ctx) {
      const w = this.rendererBounds.width;
      const h = this.rendererBounds.height;
      const ratio = Math.min(window.devicePixelRatio, 2);
      
      // キャンバスの物理的なピクセルサイズを設定
      this.canvas.width = w * ratio;
      this.canvas.height = h * ratio;

       // キャンバスの表示サイズ（CSSピクセル）を設定
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;

      // コンテキストの変換行列を設定して、レンダリングがデバイスピクセル比を考慮して行われるようにする
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  animateShow(destination) {
    if (this.showTimeline) {
      this.showTimeline.kill();
    }
  
    this.showTimeline = gsap.timeline({
      onUpdate: () => {
        this.texture.needsUpdate = true;
      },
    });
  
    this.showTimeline.to(this, {
      duration: 1.6,
      show: destination,
      ease: 'power3.inOut',
    });
  }
  

  animateIn() {
    this.animateShow(1);
  }

  setRedererBounds(bounds) {
    this.rendererBounds = bounds;
    this.setSize();
    this.texture.needsUpdate = true;
  }

  update(updateInfo) {
    if(!this.ctx) return;
    this.ctx.clearRect(0, 0, this.rendererBounds.width, this.rendererBounds.height);
    let fontSize = this.rendererBounds.width * 0.1;
    if(this.rendererBounds.width >= breakpoints.tablet) {
      fontSize = 80;
    }
    this.ctx.font = `${fontSize}px 'opensans'`;
    this.ctx.fillStyle = '#fff';
    this.ctx.textBaseline = 'top';

    const text1Size = this.ctx.measureText(this.text1);
    const offset1 = this.offsetArray[0];
    const text1Height = text1Size.actualBoundingBoxAscent + text1Size.actualBoundingBoxDescent;
    const text2Size = this.ctx.measureText(this.text2);
    const offset2 = this.offsetArray[1];
    const text3Size = this.ctx.measureText(this.text3);
    const offset3 = this.offsetArray[2];
    const lineHeightOffset = 0.32 * fontSize;
    const signatureHeight = lineHeightOffset * 2 + text1Height * 3;
    const verticalOffset = this.rendererBounds.height / 2 - signatureHeight / 2;

    const animateX = (1 - this.show) * this.rendererBounds.width * 0.11;

    this.ctx.fillText(this.text1, this.rendererBounds.width / 2 - text1Size.width / 2 + text1Size.width * offset1 - animateX, verticalOffset + text1Height * this.offsetArray[3]);
    this.ctx.fillText(this.text2, this.rendererBounds.width / 2 - text2Size.width / 2 + text2Size.width * offset2 + animateX, verticalOffset + text1Height + lineHeightOffset + text1Height * this.offsetArray[4]);
    this.ctx.fillText(this.text3, this.rendererBounds.width / 2 - text3Size.width / 2 + text3Size.width * offset3 - animateX, verticalOffset + text1Height * 2 + lineHeightOffset * 2 + text1Height * this.offsetArray[5]);
  }

  destroy() {
    if (this.showTimeline) {
      this.showTimeline.kill();
      this.showTimeline = null;
    }
  
    if (this.texture) {
      this.texture.dispose();
    }
  }
  
}

// ===== components/MediaPlane.js =====
class MediaPlane extends InteractiveObject {
  constructor({ fragmentShader, geometry, vertexShader }) {
    super();

    this.mouse2D = new THREE.Vector2(0, 0);
    this.rendererBounds = { width: 1, height: 1 };
    this.loadedAsset = null;

    this.fragmentShader = fragmentShader || shader_mediaPlane_fragment;
    this.vertexShader = vertexShader || shader_mediaPlane_vertex;
    this.geometry = geometry;
    this.material = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: null },
        uCanvasRes: { value: new THREE.Vector2(0, 0) },
        uPlaneRes: { value: new THREE.Vector2(1.0, 1.0) },
        uImageRes: { value: new THREE.Vector2(1.0, 1.0) },
        uMouse2D: { value: new THREE.Vector2(1.0, 1.0) },
        uLenseSize: { value: 1 },
      }
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);
  }

  setMouse2D(mouse) {
    this.mesh.material.uniforms.uMouse2D.value = new THREE.Vector2(mouse.current.x, mouse.current.y);
  }

  setSize(bounds) {
    this.mesh.scale.x = bounds.width;
    this.mesh.scale.y = bounds.height;
    this.mesh.material.uniforms.uPlaneRes.value = new THREE.Vector2(this.mesh.scale.x, this.mesh.scale.y);
  }

  setRendererBounds(bounds) {
    this.rendererBounds = bounds;
    this.mesh.material.uniforms.uCanvasRes.value = new THREE.Vector2(this.rendererBounds.width, this.rendererBounds.height);
  }

  setAsset(asset) {
    this.loadedAsset = asset;
    this.mesh.material.uniforms.tMap.value = this.loadedAsset.asset;
    this.mesh.material.uniforms.uImageRes.value = new THREE.Vector2(this.loadedAsset.naturalWidth, this.loadedAsset.naturalHeight);
  }

  update(updateInfo) {
    super.update(updateInfo);
    this.mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
  }

  destroy() {
    super.destroy();
  
    if (this.mesh) {
      // geometry DIANGGAP shared → jangan dispose di sini
      if (this.mesh.material) {
        this.mesh.material.dispose();
      }
  
      this.remove(this.mesh);
      this.mesh = null;
    }
  }
  
  
}

// ===== components/Lense.js =====
class Lense extends MediaPlane {
  constructor({ gui, fragmentShader, geometry, vertexShader }) {
    super({ fragmentShader, geometry, vertexShader });
    this.gui = gui;
    this.setGui();
  }

  setGui() {};

  update(updateInfo) {
    super.update(updateInfo);
  }

  setRendererBounds(bounds) {
    super.setRendererBounds(bounds);
    if(this.rendererBounds.width >= breakpoints.tablet) {
      this.setSize({ width: Lense.tabletSize, height: Lense.tabletSize });
    } else {
      this.setSize({ width: Lense.mobileSize, height: Lense.mobileSize });
    }
  }

  destroy() {
    super.destroy();
  }
}

Lense.tabletSize = 250;
Lense.mobileSize = 130;

// ===== components/TextPlane.js =====
class TextPlane extends MediaPlane {
  constructor({ gui, fragmentShader, vertexShader, geometry, text, offsetsArray }) {
    super({ geometry, fragmentShader, vertexShader });
    this.textTexture = null;
    this.isTTAnimatedIn = false;
    this.text = text;
    this.offsetsArray = offsetsArray;
    this.gui = gui;
    this.setGui();
  }

  setGui() {};

  setRendererBounds(bounds) {
    super.setRendererBounds(bounds);
    this._createTextTexture(this.rendererBounds);
    if(this.rendererBounds.width >= breakpoints.tablet) {
      this.mesh.material.uniforms.uLenseSize.value = Lense.tabletSize;
    } else {
      this.mesh.material.uniforms.uLenseSize.value = Lense.mobileSize;
    }
  }
  
  _createTextTexture(bounds) {
    if(this.textTexture) {
      this.textTexture.destroy();
    }

    this.textTexture = null;
    this.textTexture = new TextTexture({
      text: this.text,
      offsetArray: this.offsetsArray,
      isAnimatedIn: this.isTTAnimatedIn,
    });
    this.isTTAnimatedIn = true;
    this.textTexture.setRedererBounds(bounds);
    const asset = {
      asset: this.textTexture.texture,
      naturalWidth: this.textTexture.rendererBounds.width,
      naturelHeight: this.textTexture.rendererBounds.height,
      type: AssetType.IMAGE
    };
    this.setAsset(asset);
    this.textTexture.animateIn();
  }

  update(updateInfo) {
    super.update(updateInfo);
    if(this.textTexture) {
      this.textTexture.update(updateInfo);
    }
  }

  destroy() {
    super.destroy();
  
    if (this.textTexture) {
      this.textTexture.destroy();
      this.textTexture = null;
    }
  }
  
}

// ===== components/Background.js =====
class Background extends InteractiveObject {
  constructor({ gui, backgroundConfig = {} }) {
    super();
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.background = {
      ...DEFAULT_BACKGROUND,
      ...backgroundConfig,
    };

    
    // this.mouse2D = new Vector2(0.0, 0.0);
    this.mouse2D = [0, 0];
    this.planeBounds = { width: 100, height: 100 };
    this.gui = gui;

    this.setGui();
    this.setBackgroundObject();
  }

  setBackgroundObject() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  
    this.material = new THREE.ShaderMaterial({
      vertexShader: shader_background_vertex,
      fragmentShader: shader_background_fragment,
      side: THREE.FrontSide,
      wireframe: false,
      uniforms: {
        uTime: { value: 0 },
  
        // ===== PATCH: vec3 hygiene =====
        uColor1: {
          value: new THREE.Color(
            this.background.color1[0],
            this.background.color1[1],
            this.background.color1[2]
          ),
        },
        uColor2: {
          value: new THREE.Color(
            this.background.color2[0],
            this.background.color2[1],
            this.background.color2[2]
          ),
        },
        uColor3: {
          value: new THREE.Color(
            this.background.color3[0],
            this.background.color3[1],
            this.background.color3[2]
          ),
        },
  
        uColorAccent: { value: this.background.colorAccent },
        uLinesBlur: { value: this.background.uLinesBlur },
        uNoise: { value: this.background.uNoise },
        uOffsetX: { value: this.background.uOffsetX },
        uOffsetY: { value: this.background.uOffsetY },
        uLinesAmount: { value: this._setLinesAmount(this.background.uLinesAmount) },
        uPlaneRes: { value: new THREE.Vector2(1.0, 1.0) },
        uMouse2D: { value: new THREE.Vector2(1.0, 1.0) },
        uBackgroundScale: { value: 1.0 },
      },
    });
  
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.renderOrder = -1;
    this.add(this.mesh);
  }
  

  setGui() {
    const background = this.gui.addFolder('Background');
    background.close();
    background.addColor(this.background, 'color1', 1).name('Color 1');
    background.addColor(this.background, 'color2', 1).name('Color 2');
    background.addColor(this.background, 'color3', 1).name('Color 3');
    background.add(this.background, 'uLinesBlur', 0.01, 1, 0.01).name('LinesBlur').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uLinesBlur.value = value;
    });
    background.add(this.background, 'uNoise', 0.01, 1, 0.01).name('Noise').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uNoise.value = value;
    });
    background.add(this.background, 'uOffsetX', -5, 5, 0.01).name('Offset X').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uOffsetX.value = value;
    });
    background.add(this.background, 'uOffsetY', -5, 5, 0.01).name('Offset Y').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uOffsetY.value = value;
    });
    background.add(this.background, 'uLinesAmount', 0, 15, 0.01).name('Lines amount').onChange((value) => {
      if(!this.mesh) return;
      this._setLinesAmount(value);
    });
  }

  _setLinesAmount(value) {
    if(this.mesh) {
      if(this.planeBounds.width >= breakpoints.tablet) {
        this.mesh.material.uniforms.uLinesAmount.value = value;
      } else {
        this.mesh.material.uniforms.uLinesAmount.value = value * 3.8;
      }
    }
  }


  setSize(bounds) {
    this.planeBounds = bounds;

    if(this.mesh) {
      this._setLinesAmount(this.background.uLinesAmount);
      this.mesh.scale.x = this.planeBounds.width;
      this.mesh.scale.y = this.planeBounds.height;

      this.mesh.material.uniforms.uPlaneRes.value = new THREE.Vector2(this.mesh.scale.x, this.mesh.scale.y);
      if(this.planeBounds.width < breakpoints.tablet) {
        this.mesh.material.uniforms.uBackgroundScale.value = this.planeBounds.width * 0.001 * 1.45;
      } else {
        // TWEAKABLE
        this.mesh.material.uniforms.uBackgroundScale.value = 1.0;
      }

    }
  }


  setMouse2D(mouse) {
    if(this.mesh) {
      this.mesh.material.uniforms.uMouse2D.value = new THREE.Vector2(mouse.current.x, mouse.current.y);
    }
  }

  update(updateInfo) {
    super.update(updateInfo);
    if(this.mesh) {
      this.mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
  }

  destroy() {
    super.destroy();
  
    if (this.mesh) {
      this.mesh.geometry?.dispose();
      this.mesh.material?.dispose();
      this.remove(this.mesh);
      this.mesh = null;
    }
  }
  

}

// ===== scenes/InteractiveScene.js =====
class InteractiveScene extends THREE.Scene {
  constructor({ mouseMove, camera, gui }) {
    super();
  
    this.raycaster = new THREE.Raycaster();
    this.rendererBounds = { width: 100, height: 100 };
    this.pixelRatio = 1;
  
    this.mouse2D = {
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
    };
  
    this.mouseStrength = {
      current: 0,
      target: 0,
    };
  
    this.hoveredObject = null;
    this.canHoverObject = true;
    this.ease = 0.07 * 1.2;
  
    this.onMouseMove = (e) => {
      this.mouseStrength.target = e.target.strength || 0;
  
      const mouseX = e.target.mouse.x;
      const mouseY = e.target.mouse.y;
  
      this.mouse2D.target.x = (mouseX / this.rendererBounds.width) * 2 - 1;
      this.mouse2D.target.y = -(mouseY / this.rendererBounds.height) * 2 + 1;
    };
  
    this.camera = camera;
    this.mouseMove = mouseMove;
    this.gui = gui;
  
    this.addListeners();
  }
  

  addListeners() {
    this.mouseMove.addEventListener('mousemove', this.onMouseMove);
  }

  removeListeners() {
    this.mouseMove.removeEventListener('mousemove', this.onMouseMove);
  }

  setRendererBounds(bounds) {
    this.rendererBounds = bounds;
  }

  update(updateInfo) {
    this.mouseStrength.current = lerp(
      this.mouseStrength.current,
      this.mouseStrength.target,
      this.ease * updateInfo.slowDownFactor
    );
  
    this.mouse2D.current.x = lerp(
      this.mouse2D.current.x,
      this.mouse2D.target.x,
      this.ease * updateInfo.slowDownFactor
    );
  
    this.mouse2D.current.y = lerp(
      this.mouse2D.current.y,
      this.mouse2D.target.y,
      this.ease * updateInfo.slowDownFactor
    );
  
    // ===== PATCH: reset hover jika interaksi dimatikan =====
    if (!this.canHoverObject && this.hoveredObject) {
      this.hoveredObject.onMouseLeave?.();
      this.hoveredObject = null;
    }
  }
  

  setPixelRatio(ratio) {
    this.pixelRatio = ratio;
  }

  destroy() {
    this.removeListeners();
  
    if (this.hoveredObject) {
      this.hoveredObject.onMouseLeave?.();
      this.hoveredObject = null;
    }
  }
  

}

// ===== scenes/ExperienceScene.js =====
class ExperienceScene extends InteractiveScene {
  constructor({ gui, controls, camera, mouseMove, background }) {
    super({ camera, mouseMove, gui });
    this.loadedAssets = null;
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    this.controls = controls;

    this.background = new Background({
      gui,
      backgroundConfig: background,
    });
    this.add(this.background);
  }

  animateIn() {}

  update(updateInfo) {
    super.update(updateInfo);

    this.background.setMouse2D(this.mouse2D);
    this.background.update(updateInfo);
  
  }
 

  setRendererBounds(bounds) {
    super.setRendererBounds(bounds);
    
    this.background.setSize({
      width: this.rendererBounds.width * 1.001,
      height: this.rendererBounds.height * 1.001
    });
 
  }

  destroy() {
    super.destroy();

    this.background.destroy();
    this.remove(this.background);
     

    this.planeGeometry.dispose();
  }

}

// ===== webgl/index.js =====
export default class WebGL extends THREE.EventDispatcher {
  constructor({ rendererEl, setShouldReveal, setProgressValue, background }) {
    super();
  
    this.rafId = null;
    this.isResumed = true;
    this.lastFrameTime = null;
  
    this.mouseMove = MouseMove.getInstance();
    this.preloader = new Preloader();
  
    this.gui = new GUI();
    this.gui.hide();
    this.pixelRatio = 1;
  
    this.rendererEl = rendererEl;
    this.canvas = document.createElement('canvas');
    this.rendererEl.appendChild(this.canvas);
  
    this.camera = new THREE.PerspectiveCamera();
    this.setShouldReveal = setShouldReveal;
    this.setProgressValue = setProgressValue;
  
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'default',
    });
  
    this.orbitControls = new OrbitControls(this.camera, this.rendererEl);
    this.orbitControls.enableDamping = true;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableRotate = false;
    this.orbitControls.enableZoom = false;
    this.orbitControls.update();
  
    this.gui.title('Scene aettings');
  
    this.experienceScene = new ExperienceScene({
      camera: this.camera,
      mouseMove: this.mouseMove,
      controls: this.orbitControls,
      gui: this.gui,
      background
    });
  
    // ===== KEEP AS ARROW FUNCTION (AUTO-BIND) =====
    this.onVisibilityChange = () => {
      if (document.hidden) {
        this.stopAppFrame();
      } else {
        this.resumeAppFrame();
      }
    };
  
    // ===== PATCH: render loop (arrow, safe) =====
    this.renderOnFrame = (time) => {
      this.rafId = window.requestAnimationFrame(this.renderOnFrame);
    
      // guard pertama setelah resume / init
      if (this.isResumed || this.lastFrameTime === null) {
        this.lastFrameTime = time;
        this.isResumed = false;
        return;
      }
    
      // delta berbasis RAF timestamp (konsisten)
      let delta = time - this.lastFrameTime;
      this.lastFrameTime = time;
    
      // clamp ekstrem (tab sleep / hitch berat)
      if (delta > 1000) delta = 1000;
    
      // slowdown factor tetap integer & stabil
      const slowDownFactor = Math.max(
        1,
        Math.round(delta / (1000 / 60))
      );
    
      this.mouseMove.update();
      this.experienceScene.update({ delta, slowDownFactor, time });
      this.renderer.render(this.experienceScene, this.camera);
    };
    
  
    // ===== ONLY bind METHOD (onResize is method) =====
    this.onResize = this.onResize.bind(this);
  
    this.onResize();
    this.addListeners();
    this.resumeAppFrame();
  }
  
  

  onResize() {
    const rendererBounds = this.rendererEl.getBoundingClientRect();
    if (!rendererBounds.width || !rendererBounds.height) return;
  
    const aspectRatio = rendererBounds.width / rendererBounds.height;
  
    this.camera.aspect = aspectRatio;
    this.camera.position.z = 1000;
    this.camera.fov =
      (2 * Math.atan(rendererBounds.height / 2 / this.camera.position.z) * 180) /
      Math.PI;
  
    this.renderer.setSize(rendererBounds.width, rendererBounds.height);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.camera.updateProjectionMatrix();
  
    this.experienceScene.setPixelRatio(this.pixelRatio);
    this.experienceScene.setRendererBounds(rendererBounds);
  }
  

  addListeners() {
    if (this._listenersAdded) return;
    this._listenersAdded = true;
  
    window.addEventListener('resize', this.onResize);
    window.addEventListener('visibilitychange', this.onVisibilityChange);
    this.preloader.addEventListener('loaded', this.onAssetLoaded);
    this.preloader.addEventListener('progress', this.onPreloaderProgress);
  }
  
  

  removeListeners() {
    if (!this._listenersAdded) return;
    this._listenersAdded = false;
  
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.preloader.removeEventListener('loaded', this.onAssetLoaded);
    this.preloader.removeEventListener('progress', this.onPreloaderProgress);
  }
  
  

  resumeAppFrame() {
    this.isResumed = true;
    if (!this.rafId) {
      this.lastFrameTime = null;
      this.rafId = window.requestAnimationFrame(this.renderOnFrame);
    }
  }
  

  stopAppFrame() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  

  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
  
    this.stopAppFrame();
    this.removeListeners();
  
    this.mouseMove.destroy();
    this.experienceScene.destroy();
    this.preloader.destroy();
    this.gui.destroy();
  
    if (this.canvas?.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  
    this.renderer.dispose();
  }
  
  
}


// ===== SHADER CONSTANTS =====

// ===== shader/_inc/classic2d.glsl =====
const shader_inc_classic2d = `
//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise2(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}
`;

// ===== shader/background/fragment.glsl =====
const shader_background_fragment = `
${shader_inc_classic2d}

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColorAccent;
uniform vec2 uPlaneRes;
uniform vec2 uMouse2D;
uniform float uLinesBlur;
uniform float uNoise;
uniform float uOffsetX;
uniform float uOffsetY;
uniform float uLinesAmount;
uniform float uBackgroundScale;
uniform float uTime;

varying vec2 vUv;

#define PI 3.14159265359;

float lines(vec2 uv, float offset) {
  float a = abs(0.5 * sin(uv.y * uLinesAmount) + offset * uLinesBlur);
  return smoothstep(0.0, uLinesBlur + offset * uLinesBlur, a);
}

mat2 rotate2d(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float random(vec2 p) {
  vec2 k1 = vec2(23.14069263277926, 2.665144142690225);
  return fract( cos(dot(p, k1)) * 12345.6789 );
}

vec3 fadeLine(vec2 uv, vec2 mouse2D, vec3 col1, vec3 col2, vec3 col3, vec3 col4) {
  mouse2D = (mouse2D + 1.0) * 0.5;
  float n1 = cnoise2(uv);
  float n2 = cnoise2(uv + uOffsetX * 20.0);
  float n3 = cnoise2(uv * 0.3 + uOffsetY * 10.0);
  float nFinal = mix(mix(n1, n2, mouse2D.x), n3, mouse2D.y);
  vec2 baseUv = vec2(nFinal + 2.05) * uBackgroundScale;

  float basePattern = lines(baseUv, .1);
  float secondPattern = lines(baseUv, 1.0);

  vec3 baseColor = mix(col1, col2, basePattern);
  // baseColor = mix(baseColor, col3, basePattern);
  vec3 secondBaseColor = mix(baseColor, col3, secondPattern);
  
  return secondBaseColor;
}

void main() {
  vec2 mouse2D = uMouse2D;

  vec2 uv = vUv;
  uv.y += uOffsetY;
  uv.x += uOffsetX;
  uv.x *= uPlaneRes.x / uPlaneRes.y;

  // vec3 col1 = fadeLine(uv, mouse2D, uColor3, uColor2, uColor1);
  vec3 col1 = fadeLine(uv, mouse2D, uColor1, uColor2, uColor3, uColorAccent);
  vec3 finalCol = col1;

  vec2 uvRandom = vUv;
  uvRandom.y *= random(vec2(uvRandom.y, 0.5));
  finalCol.rgb += random(uvRandom) * uNoise;

  gl_FragColor = vec4(finalCol, 1.0);
}
`;

// ===== shader/background/vertex.glsl =====
const shader_background_vertex = `
float PI = 3.1415926535897932384626433832795;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;


// ===== shader/mediaPlane/fragment.glsl =====
const shader_mediaPlane_fragment = `
uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform sampler2D tMap;
uniform float uTime;

varying vec2 vUv;

#define PI 3.14159265359;

void main() {
  vec2 ratio = vec2(
    min((uPlaneRes.x / uPlaneRes.y) / (uImageRes.x / uImageRes.y), 1.0),
    min((uPlaneRes.y / uPlaneRes.x) / (uImageRes.y / uImageRes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  gl_FragColor = texture2D(tMap, uv);
}
`;

// ===== shader/mediaPlane/vertex.glsl =====
const shader_mediaPlane_vertex = `
varying vec2 vUv;

uniform vec2 uPlaneRes;
uniform vec2 uCanvasRes;
uniform vec2 uMouse2D;

void main() {
  vUv = uv;
  vec3 pos = position;

  // マウスの2D座標に応じて、頂点の位置を変更します。これにより、マウスの位置に応じて頂点が移動します。
  // pos.x += uMouse2D.x * uCanvasRes.x / uPlaneRes.x * 0.5;
  // pos.y += uMouse2D.y * uCanvasRes.y / uPlaneRes.y * 0.5;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

// ===== shader/lense/fragment.glsl =====
const shader_lense_fragment = `
uniform sampler2D tMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tMap, vUv);
}
`;

// ===== shader/lense/vertex.glsl =====
const shader_lense_vertex = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix *  vec4(position, 1.0);
}
`;


// ===== shader/text/fragmentEn.glsl =====
const shader_text_fragmentEn = `
uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;
uniform float uLenseSize;

varying vec2 vUv;

#define S(a,t) smoothstep(a*0.975, a, t);

void main() {
  vec2 mouse2D = uMouse2D;

  mouse2D.x = (mouse2D.x + 1.0) * 0.5;
  mouse2D.y = 1.0 - (mouse2D.y - 1.0) * -0.5;

  vec2 aspect = vec2(uCanvasRes.x / uCanvasRes.y, 1.0);

  float radius = 0.5 * uLenseSize / uPlaneRes.y;
  float dist = distance(mouse2D * aspect, vUv * aspect);
  float d = 1.0 - S(radius, dist);

  vec2 sub = mouse2D - vUv;
  sub *= aspect;

  vec4 tex = texture2D(tMap, vUv);

  tex.a = mix(tex.a, 0.0, d);

  gl_FragColor = tex;
}
`;

// ===== shader/text/fragmentJp.glsl =====
const shader_text_fragmentJp = `
uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;
uniform float uLenseSize;

varying vec2 vUv;

#define S(a,t) smoothstep(a*0.975, a, t);

vec3 hueShift(vec3 color, float hue) {
  const vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(hue);
  return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
  vec2 mouse2D = uMouse2D;
  mouse2D.x = (mouse2D.x + 1.0) * 0.5;
  mouse2D.y = 1.0 - (mouse2D.y - 1.0) * -0.5;

  vec2 aspect = vec2(uCanvasRes.x / uCanvasRes.y, 1.0);

  float radius = 0.5 * uLenseSize / uPlaneRes.y;
  float dist = distance(mouse2D * aspect, vUv * aspect);

  float refractionOffset = 0.036;
  float refractionPower = 0.007;

  float d1 = S(radius, dist);
  float d2 = S(radius * (1.0 - refractionOffset), dist) - d1;

  vec2 sub = mouse2D - vUv;
  sub *= aspect;

  vec2 uv = vUv - sub * pow(dist * 0.7, 0.7) + d2 * refractionPower;
  vec4 tex_r = texture2D(tMap, uv - sub * 0.01);
  vec4 tex_g = texture2D(tMap, uv + sub * 0.02);
  vec4 tex_b = texture2D(tMap, uv + sub * 0.02);
  float a = max(max(tex_r.a, tex_g.a), tex_b.a);
  vec4 tex = vec4(tex_r.r, tex_g.g, tex_b.b, a);

  tex.a = mix(tex.a, 0.0, d1);

  tex.rgb = hueShift(tex.rgb, 3.292);

  gl_FragColor = tex;
}
`;

// ===== shader/enFragmentShader.glsl =====
const shader_enFragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uAspect;
uniform bool uEnable;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  vec2 aspect = vec2(uAspect, 1.0);
  float radius = 0.19;
  float dist = distance(uMouse * aspect, vUv * aspect);
  float d = 1.0 - smoothstep(radius, radius + 0.005, dist);

  if(uEnable) {
    tex.a = mix(tex.a, 0.0, d);
  }

  gl_FragColor = tex;
}
`;

// ===== shader/enVertexShader.glsl =====
const shader_enVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ===== shader/fragment.glsl =====
const shader_fragment = `
uniform vec2 uMouse;
uniform vec3 uBlack;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uUvScale;
uniform float uMouseLine;
uniform float uLengthLine;
uniform float uNoiseAmount;

varying vec2 vUv;

#include './_inc/classic2d.glsl';

float random(vec2 p) {
  vec2 k1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract(
    cos(dot(p, k1)) * 12345.6789
  );
}

void main() {
  vec2 seed = vUv * uUvScale * ( uMouse + uMouseLine * (length(uMouse) + uLengthLine));
  float noise = cnoise2(seed) + length(uMouse) * uNoiseAmount;

  float ml = pow(length(uMouse), 2.5) * 0.15;

  float n1 = smoothstep( 0.0, 0.0 + 0.2, noise );
  vec3 color = mix( uBlack, uColor1, n1 );

  float n2 = smoothstep(0.1 + ml, 0.1 + ml + 0.2, noise);
  color = mix(color, uColor2, n2);

  float n3 = smoothstep(0.2 + ml, 0.2 + ml + 0.2, noise);
  color = mix(color, uColor3, n3);

  float n4 = smoothstep(0.3 + ml, 0.3 + ml + 0.2, noise);
  color = mix(color, uBlack, n4);

  vec2 uvrandom = vUv;
  uvrandom.y *= random( vec2( uvrandom.y, 0.4 ) );
  color.rgb += random(uvrandom) * 0.05;

  gl_FragColor = vec4(color, 1.0);
}
`;

// ===== shader/jpFragmentShader.glsl =====
const shader_jpFragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uAspect;
uniform bool uEnable;

varying vec2 vUv;

void main() {
  vec2 aspect = vec2(uAspect, 1.0);
  float radius = 0.19;
  float dist = distance(uMouse * aspect, vUv * aspect);
  float d = smoothstep(radius, radius + 0.005, dist);

  vec2 sub = uMouse - vUv;
  sub *= aspect;

  vec2 uv = vUv - sub * pow(dist * 0.7, 0.7);
  vec4 tex_r = texture2D(uTexture, uv);
  vec4 tex_g = texture2D(uTexture, uv + sub * 0.03);
  vec4 tex_b = texture2D(uTexture, uv + sub * 0.01);
  float a = max(max(tex_r.a, tex_g.a), tex_b.a);
  vec4 tex = vec4(tex_r.r, tex_g.g, tex_b.b, a);

  tex.a = mix(tex.a, 0.0, d);

  if(!uEnable) {
    tex.a = 0.0;
  }

  gl_FragColor = tex;
}
`;

// ===== shader/jpVertexShader.glsl =====
const shader_jpVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ===== shader/vertex.glsl =====
const shader_vertex = `
varying vec2 vUv;
varying vec2 vPosition;

float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;

  vec2 vPosition = position.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

 

// ===== shader/_inc/simplex2d.glsl =====
const shader_inc_simplex2d = `
//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise2(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// #pragma glslify: export(snoise)
`;

// ===== shader/_inc/simplex3d.glsl =====
const shader_inc_simplex3d = `
// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// All noise functions here:
//
// https://www.shadertoy.com/playlist/fXlXzf&from=0&num=12


// 0: cubic
// 1: quintic
#define INTERPOLANT 0


//===============================================================================================
//===============================================================================================
//===============================================================================================

vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float gradientDerivativesNoise3D( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );

    #if INTERPOLANT==1
    // quintic interpolant
    vec3 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    #else
    // cubic interpolant
    vec3 u = f*f*(3.0-2.0*f);
    #endif    

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;

     // camera movement	
	float an = 0.5*iTime;
	vec3 ro = vec3( 2.5*cos(an), 1.0, 2.5*sin(an) );
    vec3 ta = vec3( 0.0, 1.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	// create view ray
	vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // sphere center	
	vec3 sc = vec3(0.0,1.0,0.0);

    // raytrace
	float tmin = 10000.0;
	vec3  nor = vec3(0.0);
	float occ = 1.0;
	vec3  pos = vec3(0.0);
	
	// raytrace-plane
	float h = (0.0-ro.y)/rd.y;
	if( h>0.0 ) 
	{ 
		tmin = h; 
		nor = vec3(0.0,1.0,0.0); 
		pos = ro + h*rd;
		vec3 di = sc - pos;
		float l = length(di);
		occ = 1.0 - dot(nor,di/l)*1.0*1.0/(l*l); 
	}

	// raytrace-sphere
	vec3  ce = ro - sc;
	float b = dot( rd, ce );
	float c = dot( ce, ce ) - 1.0;
	h = b*b - c;
	if( h>0.0 )
	{
		h = -b - sqrt(h);
		if( h<tmin ) 
		{ 
			tmin=h; 
			nor = normalize(ro+h*rd-sc); 
			occ = 0.5 + 0.5*nor.y;
		}
	}

    // shading/lighting	
	vec3 col = vec3(0.9);
	if( tmin<100.0 )
	{
	    pos = ro + tmin*rd;
	    float f = 0.0;
		
		if( p.x<0.0 )
		{
			f = gradientDerivativesNoise3D( 16.0*pos );
		}
		else
		{
            vec3 q = 8.0*pos;
            f  = 0.5000*gradientDerivativesNoise3D( q ); q = m*q*2.01;
            f += 0.2500*gradientDerivativesNoise3D( q ); q = m*q*2.02;
            f += 0.1250*gradientDerivativesNoise3D( q ); q = m*q*2.03;
            f += 0.0625*gradientDerivativesNoise3D( q ); q = m*q*2.01;
		}
		
		
		f = smoothstep( -0.7, 0.7, f );
		f *= occ;
		col = vec3(f*1.2);
		col = mix( col, vec3(0.9), 1.0-exp( -0.003*tmin*tmin ) );
	}
	
	col = sqrt( col );
	
	col *= smoothstep( 0.006, 0.008, abs(p.x) );
	
	fragColor = vec4( col, 1.0 );
}
`;

// ===== shader/_inc/simplex3d copy.glsl =====
const shader_inc_simplex3d_copy = `
vec3 gradientDerivativesNoise3DHash( vec3 p )
      {
        '.concat(i, "
      }
      
      // return value noise (in x) and its derivatives (in yzw)
      vec4 gradientDerivativesNoise3D( in vec3 x )
      {
          // grid
          vec3 p = floor(x);
          vec3 w = fract(x);
          
          #if 1
          // quintic interpolant
          vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
          vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);
          #else
          // cubic interpolant
          vec3 u = w*w*(3.0-2.0*w);
          vec3 du = 6.0*w*(1.0-w);
          #endif    
          
          // gradients
          vec3 ga = gradientDerivativesNoise3DHash( p+vec3(0.0,0.0,0.0) );
          vec3 gb = gradientDerivativesNoise3DHash( p+vec3(1.0,0.0,0.0) );
          vec3 gc = gradientDerivativesNoise3DHash( p+vec3(0.0,1.0,0.0) );
          vec3 gd = gradientDerivativesNoise3DHash( p+vec3(1.0,1.0,0.0) );
          vec3 ge = gradientDerivativesNoise3DHash( p+vec3(0.0,0.0,1.0) );
          vec3 gf = gradientDerivativesNoise3DHash( p+vec3(1.0,0.0,1.0) );
          vec3 gg = gradientDerivativesNoise3DHash( p+vec3(0.0,1.0,1.0) );
          vec3 gh = gradientDerivativesNoise3DHash( p+vec3(1.0,1.0,1.0) );
          
          // projections
          float va = dot( ga, w-vec3(0.0,0.0,0.0) );
          float vb = dot( gb, w-vec3(1.0,0.0,0.0) );
          float vc = dot( gc, w-vec3(0.0,1.0,0.0) );
          float vd = dot( gd, w-vec3(1.0,1.0,0.0) );
          float ve = dot( ge, w-vec3(0.0,0.0,1.0) );
          float vf = dot( gf, w-vec3(1.0,0.0,1.0) );
          float vg = dot( gg, w-vec3(0.0,1.0,1.0) );
          float vh = dot( gh, w-vec3(1.0,1.0,1.0) );
        
          // interpolations
          return vec4( va + u.x*(vb-va) + u.y*(vc-va) + u.z*(ve-va) + u.x*u.y*(va-vb-vc+vd) + u.y*u.z*(va-vc-ve+vg) + u.z*u.x*(va-vb-ve+vf) + (-va+vb+vc-vd+ve-vf-vg+vh)*u.x*u.y*u.z,    // value
                      ga + u.x*(gb-ga) + u.y*(gc-ga) + u.z*(ge-ga) + u.x*u.y*(ga-gb-gc+gd) + u.y*u.z*(ga-gc-ge+gg) + u.z*u.x*(ga-gb-ge+gf) + (-ga+gb+gc-gd+ge-gf-gg+gh)*u.x*u.y*u.z +   // derivatives
                      du * (vec3(vb,vc,ve) - va + u.yzx*vec3(va-vb-vc+vd,va-vc-ve+vg,va-vb-ve+vf) + u.zxy*vec3(va-vb-ve+vf,va-vb-vc+vd,va-vc-ve+vg) + u.yzx*u.zxy*(-va+vb+vc-vd+ve-vf-vg+vh) ));
      }
    ")
`;
