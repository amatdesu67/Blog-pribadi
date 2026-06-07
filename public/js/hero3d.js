/* =====================================================================
   hero3d.js — Latar 3D sinematik (Three.js r170 + three-vrm v3, ES module)
   - Starfield partikel emas (parallax mouse + scroll).
   - Karakter VRM 1.0 (Chizuru.min.vrm): MELAMBAI terus (loop Goodbye.vrma),
     ekspresi senyum tipis + kedip/wink.
   - Loader % saat model dimuat. Lazy-load. Reduced-motion: render diam.
   ===================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  VRMLookAtQuaternionProxy,
  createVRMAnimationClip,
} from "@pixiv/three-vrm-animation";

const canvas = document.getElementById("bg3d");

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let isMobile = window.matchMedia("(max-width: 860px)").matches;
const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
const hideLoader = () => { const l = document.getElementById("vrmLoading"); if (l) l.classList.add("is-hidden"); };

const VRM_URL  = "/Chizuru.min.vrm";
const IDLE_URL = "/vrma/Relax.vrma";
const WAVE_URL = "/vrma/Goodbye.vrma";

let renderer, scene, camera, particles, raf = 0;
let vrm = null, mixer = null, entrance = 0;
const clock = new THREE.Clock();
const mouse = { x: 0, y: 0 }, target = { x: 0, y: 0 };
let scrollY = window.scrollY || 0;
const hasHero = !!document.querySelector(".hero");
const t0 = performance.now();
let nextBlink = 1.5 + Math.random() * 2.5, blinkVal = 0, winkMode = false;

function basePos() {
  return { x: isMobile ? 0 : 1.8, y: isMobile ? -3.0 : -8.6, s: isMobile ? 2.9 : 7.0 };
}

function init() {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  buildParticles();

  scene.add(new THREE.AmbientLight(0xffffff, isLight() ? 0.7 : 0.45));
  scene.add(new THREE.HemisphereLight(0xfff3d6, 0x1a1a22, isLight() ? 0.6 : 0.5));
  const key = new THREE.DirectionalLight(0xffe7b8, 2.0); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.PointLight(0x9fb4ff, 2.4, 70); rim.position.set(-6, 2, -5); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.6); fill.position.set(-2, 0, 8); scene.add(fill);

  if (hasHero) {
    const startLoad = () => loadCharacter();
    if ("requestIdleCallback" in window) requestIdleCallback(startLoad, { timeout: 1500 });
    else setTimeout(startLoad, 300);
  } else {
    hideLoader();
  }

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("scroll", () => { scrollY = window.scrollY || 0; }, { passive: true });
  if (!reduce && !isMobile) {
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }
  new MutationObserver(() => { if (particles) particles.material.opacity = isLight() ? 0.55 : 0.9; })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else play(); });

  requestAnimationFrame(() => canvas.classList.add("is-ready"));
  if (reduce) renderOnce(); else play();
}

function buildParticles() {
  const COUNT = isMobile ? 700 : 1700;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const gold = new THREE.Color(0xe7c878), pale = new THREE.Color(0xfff4d6), blue = new THREE.Color(0x8a93c8);
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    pos[i3] = (Math.random() - 0.5) * 34;
    pos[i3 + 1] = (Math.random() - 0.5) * 22;
    pos[i3 + 2] = (Math.random() - 0.5) * 22 - 4;
    const r = Math.random();
    const c = r < 0.7 ? gold : (r < 0.9 ? pale : blue);
    col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: isMobile ? 0.05 : 0.045, vertexColors: true, transparent: true,
    opacity: isLight() ? 0.55 : 0.9, depthWrite: false,
    blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  particles = new THREE.Points(geo, mat);
  scene.add(particles);
}

async function loadCharacter() {
  const loader = new GLTFLoader();
  loader.register((p) => new VRMLoaderPlugin(p));
  loader.register((p) => new VRMAnimationLoaderPlugin(p));

  try {
    const gltf = await loader.loadAsync(VRM_URL, (e) => {
      if (e && e.total) {
        const el = document.getElementById("vrmLoadingPct");
        if (el) el.textContent = Math.round((e.loaded / e.total) * 100) + "%";
      }
    });

    vrm = gltf.userData.vrm;
    if (!vrm) { console.error("userData.vrm kosong"); hideLoader(); return; }

    try { VRMUtils.removeUnnecessaryVertices(gltf.scene); } catch (e) {}
    try { VRMUtils.combineSkeletons(gltf.scene); } catch (e) {}
    try {
      const proxy = new VRMLookAtQuaternionProxy(vrm.lookAt);
      proxy.name = "lookAtQuaternionProxy";
      vrm.scene.add(proxy);
    } catch (e) {}
    vrm.scene.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });

    const bp = basePos();
    vrm.scene.position.set(bp.x, bp.y, 0);
    vrm.scene.scale.setScalar(bp.s);
    vrm.scene.rotation.y = 0;
    scene.add(vrm.scene);

    mixer = new THREE.AnimationMixer(vrm.scene);
    hideLoader();

    const [idleClip, waveClip] = await Promise.all([
      loadClip(loader, IDLE_URL),
      loadClip(loader, WAVE_URL),
    ]);

    const wave = waveClip ? mixer.clipAction(waveClip) : null;
    const idle = idleClip ? mixer.clipAction(idleClip) : null;

    // Melambai terus-terusan (genit) -> loop animasi Goodbye. Idle cuma fallback.
    if (wave) {
      wave.setLoop(THREE.LoopRepeat, Infinity);
      wave.clampWhenFinished = false;
      wave.play();
    } else if (idle) {
      idle.play();
    }

    if (reduce) { mixer.update(0); vrm.update(0); renderOnce(); }
  } catch (err) {
    console.error("Gagal memuat VRM/animasi:", err);
    hideLoader();
  }
}

function loadClip(loader, url) {
  return loader.loadAsync(url)
    .then((g) => {
      const a = g.userData.vrmAnimations && g.userData.vrmAnimations[0];
      return a ? createVRMAnimationClip(a, vrm) : null;
    })
    .catch((e) => { console.warn("VRMA gagal:", url, e); return null; });
}

function onResize() {
  if (!renderer) return;
  isMobile = window.matchMedia("(max-width: 860px)").matches;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  if (vrm) {
    const bp = basePos();
    vrm.scene.position.set(bp.x, bp.y, 0);
    vrm.scene.scale.setScalar(bp.s);
  }
  if (reduce) renderOnce();
}

function frame(now) {
  const t = (now - t0) * 0.001;
  const dt = clock.getDelta();
  target.x += (mouse.x - target.x) * 0.05;
  target.y += (mouse.y - target.y) * 0.05;

  if (particles) {
    particles.rotation.y = t * 0.02 + target.x * 0.25;
    particles.rotation.x = target.y * 0.15 - scrollY * 0.00012;
    particles.position.y = scrollY * 0.0011;
  }

  if (vrm) {
    if (mixer) mixer.update(dt);
    const em = vrm.expressionManager;
    if (em) {
      em.setValue("happy", 0.3);   // senyum tipis
      em.setValue("relaxed", 0.1);
      nextBlink -= dt;
      if (nextBlink <= 0) { blinkVal = 1; nextBlink = 2.4 + Math.random() * 3.2; winkMode = Math.random() < 0.4; }
      blinkVal += (0 - blinkVal) * Math.min(1, dt * 11);
      if (winkMode) { em.setValue("blinkLeft", blinkVal); em.setValue("blink", 0); }
      else { em.setValue("blink", blinkVal); em.setValue("blinkLeft", 0); }
    }
    entrance += (1 - entrance) * Math.min(1, dt * 2.2);
    const bp = basePos();
    const fade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.85));
    vrm.scene.visible = fade > 0.02;
    vrm.scene.scale.setScalar(bp.s * (0.92 + 0.08 * entrance));
    vrm.scene.position.x = bp.x;
    vrm.scene.position.y = bp.y - scrollY * 0.003 + (1 - entrance) * -0.5;
    vrm.update(dt);
  }

  camera.position.x += (target.x * 0.6 - camera.position.x) * 0.05;
  camera.position.y += (-target.y * 0.4 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  raf = requestAnimationFrame(frame);
}

function renderOnce() {
  if (!renderer) return;
  if (particles) particles.rotation.y = 0.2;
  renderer.render(scene, camera);
}

function play() { if (!reduce && !raf) raf = requestAnimationFrame(frame); }
function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

if (canvas) {
  try { init(); }
  catch (e) { console.error("Init hero3d gagal:", e); hideLoader(); canvas.style.display = "none"; }
}
