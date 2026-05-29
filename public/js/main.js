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

  // --- Menu mobile (hamburger) ---
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
