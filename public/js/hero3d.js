// public/js/hero3d.js — Objek 3D subtle di hero (Three.js, ES module).
// Low-poly icosahedron wireframe, rotasi pelan mengikuti mouse (lerp).
// rAF di-pause saat tab tidak aktif. Tidak diinisialisasi di mobile /
// prefers-reduced-motion (hemat baterai + Lighthouse).

const canvas = document.getElementById("hero3d");
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !isMobile && !reduced) {
  init();
} else if (canvas) {
  canvas.remove(); // fallback: hero polos, tetap elegan
}

async function init() {
  const THREE = await import("three");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 50
  );
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // --- Objek utama: icosahedron low-poly, dua lapis (solid gelap + wireframe) ---
  const group = new THREE.Group();

  const geo = new THREE.IcosahedronGeometry(2.1, 1);
  const solid = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.35,
      metalness: 0.8,
      flatShading: true
    })
  );
  const wire = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: 0x86868b,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    })
  );
  wire.scale.setScalar(1.003);
  group.add(solid, wire);
  group.position.set(0, 0.2, 0);
  scene.add(group);

  // --- Cahaya minimal ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x2997ff, 0.5);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  // --- Mouse follow (lerp halus) ---
  let targetX = 0, targetY = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // --- Loop: pause saat tab hidden ---
  let rafId = null;
  let running = false;
  const clock = new THREE.Clock();

  function tick() {
    rafId = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    // rotasi dasar pelan + pengaruh mouse (lerp 5%)
    group.rotation.y += ((targetX * 0.45 + t * 0.08) - group.rotation.y) * 0.05;
    group.rotation.x += ((targetY * 0.3) - group.rotation.x) * 0.05;
    group.position.y = 0.2 + Math.sin(t * 0.5) * 0.08; // napas halus

    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    clock.start();
    tick();
  }
  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    clock.stop();
  }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  // Bonus efisiensi: berhenti juga saat hero keluar dari viewport.
  new IntersectionObserver((entries) => {
    entries[0].isIntersecting && !document.hidden ? start() : stop();
  }, { threshold: 0 }).observe(canvas);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  start();
}
