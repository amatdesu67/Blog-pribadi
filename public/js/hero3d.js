// public/js/hero3d.js
// Latar hero: jaringan node 3D (nyambung tema TKJ) yang berotasi mengikuti scroll.
// Tanpa library — render live ke <canvas> (objek vektor ringan, jadi tak perlu
// pre-render frame). Warna ikut tema (--text), hormati prefers-reduced-motion.
(function () {
  var canvas = document.getElementById("hero3d");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var hero = canvas.parentElement;

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // Ambil warna tinta dari CSS variable --text (otomatis ikut tema terang/gelap).
  function ink() {
    var c = (getComputedStyle(document.documentElement)
      .getPropertyValue("--text") || "").trim();
    if (c[0] === "#") {
      if (c.length === 4) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
      var n = parseInt(c.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    return [19, 19, 20];
  }
  var INK = ink();

  // Sebar titik di dalam/permukaan bola (seed tetap -> bentuk konsisten).
  var seed = 1337;
  function rnd() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }
  var N = 46, nodes = [];
  for (var i = 0; i < N; i++) {
    var u = rnd() * 2 - 1, t = rnd() * 6.2832, r = 0.55 + rnd() * 0.45, s = Math.sqrt(1 - u * u);
    nodes.push([Math.cos(t) * s * r, u * r, Math.sin(t) * s * r]);
  }
  // Hubungkan tiap node ke 3 tetangga terdekat (sekali hitung).
  var edges = [], seen = {};
  for (var a = 0; a < N; a++) {
    var d = [];
    for (var b = 0; b < N; b++) if (b !== a) {
      var dx = nodes[a][0] - nodes[b][0], dy = nodes[a][1] - nodes[b][1], dz = nodes[a][2] - nodes[b][2];
      d.push([dx * dx + dy * dy + dz * dz, b]);
    }
    d.sort(function (p, q) { return p[0] - q[0]; });
    for (var k = 0; k < 3; k++) {
      var j = d[k][1], key = a < j ? a + "-" + j : j + "-" + a;
      if (!seen[key]) { seen[key] = 1; edges.push([a, j]); }
    }
  }

  var W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  var TILT = 0.42;
  function proj(p, ang) {
    var ca = Math.cos(ang), sa = Math.sin(ang);
    var x1 = p[0] * ca + p[2] * sa, z1 = -p[0] * sa + p[2] * ca;
    var cb = Math.cos(TILT), sb = Math.sin(TILT);
    return [x1, p[1] * cb - z1 * sb, p[1] * sb + z1 * cb];
  }

  function draw(ang) {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);
    var ox = W * 0.5, oy = H * 0.5, R = Math.min(W, H) * 0.46;
    var sc = nodes.map(function (p) {
      var q = proj(p, ang), per = 1.6 / (1.6 - q[2] * 0.6);
      return [ox + q[0] * R * per, oy + q[1] * R * per, q[2]];
    });
    for (var e = 0; e < edges.length; e++) {
      var A = sc[edges[e][0]], B = sc[edges[e][1]];
      var dep = (A[2] + B[2]) * 0.5, al = 0.10 + (dep + 1) * 0.06;
      ctx.strokeStyle = "rgba(" + INK[0] + "," + INK[1] + "," + INK[2] + "," + al.toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    }
    var ord = sc.map(function (p, i) { return i; }).sort(function (i, j) { return sc[i][2] - sc[j][2]; });
    for (var o = 0; o < ord.length; o++) {
      var n = sc[ord[o]], dd = (n[2] + 1) / 2, rad = 1.4 + dd * 2.4, al2 = 0.30 + dd * 0.58;
      ctx.fillStyle = "rgba(" + INK[0] + "," + INK[1] + "," + INK[2] + "," + al2.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(n[0], n[1], rad, 0, 6.2832); ctx.fill();
    }
  }

  // Posisi scroll -> 0..1 (saat hero lewat layar).
  var frac = 0;
  function onScroll() {
    var rect = hero.getBoundingClientRect();
    var range = (hero.offsetHeight + window.innerHeight) || 1;
    frac = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / range));
    if (reduce) draw(frac * 6.2832);
  }

  var t = 0, raf;
  function loop() {
    t += 0.0010;                       // hanyutan pelan saat diam
    draw(t * 6.2832 + frac * 6.2832);  // + putaran dari scroll
    raf = requestAnimationFrame(loop);
  }

  function start() {
    resize(); onScroll();
    if (reduce) { draw(frac * 6.2832); }
    else { cancelAnimationFrame(raf); loop(); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { resize(); onScroll(); });
  window.addEventListener("load", function () { resize(); onScroll(); });
  // Tema diganti -> ambil warna baru.
  new MutationObserver(function () { INK = ink(); if (reduce) draw(frac * 6.2832); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
