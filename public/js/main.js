// public/js/main.js
// Dua fungsi kecil di sisi browser: ganti tema gelap/terang, dan buka/tutup menu mobile.

(function () {
  // --- Ganti tema ---
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const root = document.documentElement;
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      // Simpan pilihan supaya tetap sama saat halaman dibuka lagi.
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // --- Gambar hero melambai saat diklik / disentuh ---
  // (Hover sudah ditangani CSS; ini biar di HP yang tanpa hover tetap bisa.)
  const heroArt = document.querySelector(".hero-art");
  if (heroArt) {
    heroArt.addEventListener("click", function () {
      heroArt.classList.add("is-waving");
      clearTimeout(heroArt._waveTimer);
      heroArt._waveTimer = setTimeout(function () {
        heroArt.classList.remove("is-waving");
      }, 1600);
    });
  }

  // --- Menu mobile (hamburger) ---
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const open = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Tutup menu otomatis jika pengguna mengetuk di luar area menu
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("nav-open") && !nav.contains(e.target) && e.target !== navToggle) {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
