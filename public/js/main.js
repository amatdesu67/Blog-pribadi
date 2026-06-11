// public/js/main.js
// Animasi global: Lenis smooth scroll + GSAP/ScrollTrigger.
// Prinsip: restraint — satu fokus per section, durasi 0.8–1.2s, power3.out.

(function () {
  "use strict";

  var DUR = 1;
  var EASE = "power3.out";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav (semua halaman, tanpa dependensi GSAP) ---------- */
  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  function onScrollHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // GSAP wajib ada untuk sisanya; kalau CDN gagal, situs tetap berfungsi.
  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll (global) ---------- */
  var lenis = null;
  if (typeof Lenis !== "undefined" && !reduced) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  if (reduced) return; // konten tampil apa adanya, tanpa animasi

  /* ================= HOMEPAGE ================= */
  var isHome = document.body.classList.contains("is-home");

  /* ---------- 1. Hero: stagger fade-up ---------- */
  if (isHome) {
    var heroTl = gsap.timeline({ defaults: { ease: EASE } });
    heroTl
      .from("[data-hero-line]", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.12
      })
      .from("[data-hero-fade]", {
        y: 24,
        autoAlpha: 0,
        duration: DUR,
        stagger: 0.1
      }, "-=0.7");

    // Scroll indicator memudar saat mulai scroll
    gsap.to(".scroll-indicator", {
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "18% top",
        scrub: true
      }
    });
  }

  var mm = gsap.matchMedia();

  /* ---------- Desktop ---------- */
  mm.add("(min-width: 769px)", function () {
    if (!isHome) return;

    /* 2. Tentang: reveal per kata (scrub) + foto parallax */
    var aboutP = document.querySelector("[data-word-reveal]");
    if (aboutP && !aboutP.dataset.split) {
      aboutP.dataset.split = "1";
      aboutP.innerHTML = aboutP.textContent.trim().split(/\s+/)
        .map(function (w) { return '<span class="w">' + w + "</span>"; })
        .join(" ");
    }
    if (aboutP) {
      gsap.fromTo(aboutP.querySelectorAll(".w"),
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: aboutP,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.5
          }
        });
    }

    gsap.fromTo("[data-parallax]",
      { yPercent: -10 },
      {
        yPercent: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-photo-wrap",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    /* 3. Proyek: horizontal scroll + progress dots */
    var track = document.getElementById("projTrack");
    var dots = gsap.utils.toArray(".proj-dot");
    if (track) {
      var getDistance = function () {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };
      gsap.to(track, {
        x: function () { return -getDistance(); },
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-h",
          start: "top top",
          end: function () { return "+=" + getDistance(); },
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (!dots.length) return;
            var idx = Math.round(self.progress * (dots.length - 1));
            dots.forEach(function (d, i) {
              d.classList.toggle("is-active", i === idx);
            });
          }
        }
      });
    }

    return function () {}; // cleanup dikelola matchMedia
  });

  /* ---------- Mobile: fade sederhana (tanpa scrub, tanpa pin) ---------- */
  mm.add("(max-width: 768px)", function () {
    if (!isHome) return;

    [".about-text", ".about-photo-wrap", ".projects-h-head"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      gsap.from(el, {
        y: 28,
        autoAlpha: 0,
        duration: DUR,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });
  });

  /* ---------- 4. Artikel: fade-in stagger saat masuk viewport ---------- */
  if (isHome) {
    var cards = gsap.utils.toArray("[data-article-card]");
    if (cards.length) {
      gsap.set(cards, { y: 36, autoAlpha: 0 });
      ScrollTrigger.batch(cards, {
        start: "top 85%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: DUR,
            ease: EASE,
            stagger: 0.12
          });
        }
      });
    }
  }

  /* ---------- Halaman lain: reveal ringan satu arah ---------- */
  if (!isHome) {
    var items = gsap.utils.toArray(
      ".card-grid .card, .article-list .article-item, .price-card, .stat, .timeline-item"
    );
    if (items.length) {
      gsap.set(items, { y: 24, autoAlpha: 0 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: EASE,
            stagger: 0.08
          });
        }
      });
    }
  }

  // Refresh setelah semua aset (font/gambar) siap — ukuran track akurat.
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();

/* ---------- Fitur halaman dalam (ringan, tanpa dependensi) ---------- */
(function () {
  "use strict";

  // Jam lokal di footer (WIB)
  var clock = document.getElementById("footerClock");
  if (clock) {
    var tick = function () {
      clock.textContent = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta"
      }).replace(".", ":") + " WIB — Indonesia";
    };
    tick();
    setInterval(tick, 30000);
  }

  // Reading progress (artikel & bab ebook)
  var bar = document.getElementById("readProgress");
  var prose = document.querySelector(".prose");
  if (bar && prose) {
    var onScroll = function () {
      var r = prose.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.transform = "scaleX(" + p + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Filter projects
  var filterWrap = document.querySelector("[data-proj-filter]");
  if (filterWrap) {
    var rows = document.querySelectorAll("[data-type]");
    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      filterWrap.querySelectorAll(".tag").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      var f = btn.getAttribute("data-filter");
      rows.forEach(function (r) {
        r.classList.toggle("is-hidden", f !== "all" && r.getAttribute("data-type") !== f);
      });
    });
  }

  // Kontak: kirim isi form via WhatsApp
  var waBtn = document.getElementById("btnWhatsapp");
  if (waBtn) {
    waBtn.addEventListener("click", function () {
      var g = function (n) { var el = document.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; };
      var text = "Halo Riza! Aku " + (g("name") || "...") + ".\n" + (g("message") || "");
      window.open("https://wa.me/6283842570278?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }
})();

/* ---------- Hero stats: count-up sekali saat load ---------- */
(function () {
  "use strict";
  var els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  els.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var t0 = null;
    var DUR = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / DUR);
      var eased = 1 - Math.pow(1 - p, 3); // power3.out
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 600);
  });
})();
