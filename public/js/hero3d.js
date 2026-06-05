/* =====================================================================
   hero3d.js — Latar 3D sinematik global (Three.js)
   - Starfield/partikel emas yang melayang + parallax ke mouse & scroll.
   - Centerpiece kristal (icosahedron metalik emas) di area hero, dengan
     wireframe bercahaya. Rotasi & posisinya digerakkan oleh scroll.
   - Aktif di semua halaman (partikel); centerpiece hanya bila ada .hero.
   - Degradasi anggun: mobile pakai lebih sedikit partikel; prefers-reduced
     -motion -> render diam. Tanpa THREE -> tidak melakukan apa-apa.
   ===================================================================== */
(function () {
  var canvas = document.getElementById("bg3d");
  if (!canvas || typeof THREE === "undefined") return;

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var isMobile = window.matchMedia("(max-width: 860px)").matches;

  function isLight() { return document.documentElement.getAttribute("data-theme") === "light"; }

  var renderer, scene, camera, particles, crystal, crystalWire, raf = 0;
  var mouse = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  var scrollY = window.scrollY || 0;
  var hasHero = !!document.querySelector(".hero");
  var t0 = performance.now();

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 9;

    buildParticles();
    if (hasHero) buildCrystal();

    scene.add(new THREE.AmbientLight(0xffffff, isLight() ? 0.65 : 0.35));
    var key = new THREE.PointLight(0xffd98a, 2.4, 60);
    key.position.set(6, 6, 8);
    scene.add(key);
    var rim = new THREE.PointLight(0x9aa6ff, 1.1, 60);
    rim.position.set(-7, -3, 5);
    scene.add(rim);

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", function () { scrollY = window.scrollY || 0; }, { passive: true });
    if (!reduce && !isMobile) {
      window.addEventListener("mousemove", function (e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }
    new MutationObserver(function () {
      if (particles) particles.material.opacity = isLight() ? 0.55 : 0.9;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else play();
    });

    requestAnimationFrame(function () { canvas.classList.add("is-ready"); });

    if (reduce) renderOnce();
    else play();
  }

  function buildParticles() {
    var COUNT = isMobile ? 700 : 1700;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(COUNT * 3);
    var col = new Float32Array(COUNT * 3);
    var gold = new THREE.Color(0xe7c878);
    var pale = new THREE.Color(0xfff4d6);
    var blue = new THREE.Color(0x8a93c8);
    for (var i = 0; i < COUNT; i++) {
      var i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 34;
      pos[i3 + 1] = (Math.random() - 0.5) * 22;
      pos[i3 + 2] = (Math.random() - 0.5) * 22 - 4;
      var r = Math.random();
      var c = r < 0.7 ? gold : (r < 0.9 ? pale : blue);
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    var mat = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: isLight() ? 0.55 : 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  function buildCrystal() {
    var R = isMobile ? 1.5 : 2.0;
    var geo = new THREE.IcosahedronGeometry(R, 1);
    var mat = new THREE.MeshStandardMaterial({
      color: 0xc79a44,
      metalness: 0.95,
      roughness: 0.18,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
      emissive: 0x4a3410,
      emissiveIntensity: 0.5
    });
    crystal = new THREE.Mesh(geo, mat);

    var wireGeo = new THREE.IcosahedronGeometry(R * 1.04, 1);
    var wireMat = new THREE.MeshBasicMaterial({
      color: 0xf7e8bf,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    crystalWire = new THREE.Mesh(wireGeo, wireMat);

    var group = new THREE.Group();
    group.add(crystal);
    group.add(crystalWire);
    group.position.x = isMobile ? 0 : 3.1;
    group.position.y = isMobile ? 2.4 : 0.2;
    group.rotation.set(0.4, 0.2, 0);
    crystal._group = group;
    scene.add(group);
  }

  function onResize() {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    if (reduce) renderOnce();
  }

  function frame(now) {
    var t = (now - t0) * 0.001;
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;

    if (particles) {
      particles.rotation.y = t * 0.02 + target.x * 0.25;
      particles.rotation.x = target.y * 0.15 - scrollY * 0.00012;
      particles.position.y = scrollY * 0.0011;
    }

    if (crystal) {
      var g = crystal._group;
      g.rotation.y = t * 0.18 + scrollY * 0.0016 + target.x * 0.3;
      g.rotation.x = 0.35 + Math.sin(t * 0.4) * 0.12 + target.y * 0.2;
      crystalWire.rotation.y = -t * 0.1;
      crystalWire.rotation.x = t * 0.06;
      var baseY = isMobile ? 2.4 : 0.2;
      g.position.y = baseY + Math.sin(t * 0.6) * 0.18 + scrollY * 0.004;
      var fade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.85));
      crystal.material.opacity = 0.92 * fade;
      crystalWire.material.opacity = 0.28 * fade;
      g.visible = fade > 0.02;
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

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (e) {
    if (canvas) canvas.style.display = "none";
  }
})();
