// public/js/hero3d.js — Globe jaringan partikel di hero (Three.js, ES module).
// Node + garis koneksi membentuk bola — "jaringan" (akar TKJ).
// Rotasi pelan mengikuti mouse (lerp). rAF pause saat tab hidden /
// hero keluar viewport. Tidak jalan di mobile & prefers-reduced-motion.

const canvas = document.getElementById("hero3d");
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !isMobile && !reduced) {
  init();
} else if (canvas) {
  canvas.remove();
}

async function init() {
  const THREE = await import("three");

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 6, 12);

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

  const group = new THREE.Group();
  group.position.set(0, 0.2, 0);
  scene.add(group);

  // --- Node: titik tersebar merata di permukaan bola (fibonacci sphere) ---
  const R = 2.6;
  const COUNT = 220;
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push(new THREE.Vector3(
      Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R
    ));
  }

  const nodeGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    color: 0xf5f5f7,
    size: 0.035,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  }));
  group.add(nodes);

  // --- Koneksi: garis antar node yang berdekatan ---
  const linePos = [];
  const MAXD = 0.95; // jarak maksimum utk terhubung
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      if (pts[i].distanceTo(pts[j]) < MAXD) {
        linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: 0x86868b,
    transparent: true,
    opacity: 0.16
  }));
  group.add(lines);

  // --- Beberapa node "aktif" berwarna aksen, berkedip pelan ---
  const activeIdx = [];
  for (let i = 0; i < 14; i++) activeIdx.push(Math.floor(Math.random() * COUNT));
  const activeGeo = new THREE.BufferGeometry().setFromPoints(activeIdx.map(i => pts[i]));
  const activeMat = new THREE.PointsMaterial({
    color: 0x7b61ff,
    size: 0.07,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });
  const activeNodes = new THREE.Points(activeGeo, activeMat);
  group.add(activeNodes);

  // --- Mouse follow (lerp halus) ---
  let targetX = 0, targetY = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // --- Loop: pause saat tab hidden / hero di luar viewport ---
  let rafId = null;
  let running = false;
  const clock = new THREE.Clock();

  function tick() {
    rafId = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    group.rotation.y += ((targetX * 0.4 + t * 0.06) - group.rotation.y) * 0.05;
    group.rotation.x += ((targetY * 0.25) - group.rotation.x) * 0.05;
    group.position.y = 0.2 + Math.sin(t * 0.5) * 0.07;
    activeMat.opacity = 0.55 + Math.sin(t * 1.6) * 0.35; // denyut node aktif

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
