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

  // --- Terminal Mini Interaktif (TKJ Special) ---
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");
  const terminalBody = document.getElementById("terminalBody");

  if (terminalInput && terminalOutput && terminalBody) {
    // Fokuskan input saat area terminal diklik
    terminalBody.addEventListener("click", () => {
      terminalInput.focus();
    });

    const commands = {
      help: () => `Perintah yang tersedia:<br>
        - <span class="term-highlight">about</span> : Siapa Riza?<br>
        - <span class="term-highlight">neofetch</span> : Info sistem & stack favorit.<br>
        - <span class="term-highlight">ping riza</span> : Cek latensi ke pembuat web.<br>
        - <span class="term-highlight">skill</span> : Lihat level keahlian.<br>
        - <span class="term-highlight">clear</span> : Bersihkan layar terminal.`,
      about: () => `Ahmad Riza Rudi - 18 Tahun, Siswa SMK TKJ.<br>
        Sedang serius mempelajari Web Development (Node.js, Express, SQLite).<br>
        Suka menulis buku berpikir kritis ("Otak yang Mudah Dibodohi").`,
      neofetch: () => `
        <span class="term-highlight">riza@tkj-lab</span><br>
        -----------------<br>
        OS: Android & Windows Dual-Boot (via WSL)<br>
        Shell: Zsh / PowerShell<br>
        Uptime: 24/7 learning<br>
        Terminal: VS Code Terminal<br>
        CPU: Brain Core i7-18th Gen<br>
        Memory: Coffee-powered RAM<br>
        Stack: Node.js, Express.js, EJS, SQLite, Git, Vercel
      `,
      skill: () => `
        <span class="term-highlight">Keahlian TKJ & Web Dev:</span><br>
        - HTML & CSS : [████████████████░░░░] 80%<br>
        - Jaringan (TKJ) : [██████████████░░░░░░] 70%<br>
        - JavaScript : [█████████████░░░░░░░░] 65%<br>
        - Node.js & Express : [████████████░░░░░░░░░] 60%<br>
        - SQLite & Turso : [███████████░░░░░░░░░░] 55%
      `,
      "ping riza": () => {
        let replies = "";
        for (let i = 0; i < 4; i++) {
          replies += `Reply from 192.168.1.67: bytes=32 time=${Math.floor(Math.random() * 3) + 1}ms TTL=64<br>`;
        }
        return replies + `<span class="term-highlight">Ping statistics:</span> Packets: Sent = 4, Received = 4, Lost = 0 (0% loss).`;
      },
      clear: () => {
        terminalOutput.innerHTML = "";
        return "";
      }
    };

    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const inputVal = terminalInput.value.trim();
        terminalInput.value = "";

        if (inputVal === "") return;

        // Tampilkan perintah lama ke output
        const cmdRow = document.createElement("div");
        cmdRow.className = "terminal-line";
        cmdRow.innerHTML = `<span class="terminal-prompt">riza@tkj-lab:~$</span> <span class="term-command">${inputVal}</span>`;
        terminalOutput.appendChild(cmdRow);

        const lowerCmd = inputVal.toLowerCase();
        let result = "";

        if (commands[lowerCmd]) {
          result = commands[lowerCmd]();
        } else {
          result = `<span class="term-error">Error: Command not found: "${inputVal}". Ketik 'help' untuk bantuan.</span>`;
        }

        if (lowerCmd !== "clear" && result !== "") {
          const resultRow = document.createElement("div");
          resultRow.className = "terminal-line";
          resultRow.innerHTML = result;
          terminalOutput.appendChild(resultRow);
          
          // Beri baris kosong baru
          const spacing = document.createElement("div");
          spacing.innerHTML = "<br>";
          terminalOutput.appendChild(spacing);
        }

        // Scroll otomatis ke bawah
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  // --- Filter Proyek (Client-side) ---
  const filterButtons = document.querySelectorAll(".tag-filter button");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Hapus kelas is-active dari semua tombol filter
        filterButtons.forEach(b => b.classList.remove("is-active"));
        // Tambahkan kelas is-active ke tombol yang diklik
        btn.classList.add("is-active");

        const filterVal = btn.getAttribute("data-filter");

        projectCards.forEach(card => {
          const type = card.getAttribute("data-type");

          if (filterVal === "all" || type === filterVal) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              // Kosongkan transform inline supaya efek hover-naik kartu tetap jalan.
              card.style.transform = "";
            }, 50);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(12px) scale(0.96)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // --- WhatsApp Message Generator (Contact Page) ---
  const btnWhatsapp = document.getElementById("btnWhatsapp");
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", () => {
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const messageInput = document.querySelector('textarea[name="message"]');
      
      if (!nameInput.value.trim() || !messageInput.value.trim()) {
        alert("Mohon isi Nama dan Pesan terlebih dahulu sebelum mengirim via WhatsApp.");
        return;
      }
      
      const name = encodeURIComponent(nameInput.value.trim());
      const email = encodeURIComponent(emailInput.value.trim() || "Tidak ada");
      const message = encodeURIComponent(messageInput.value.trim());
      
      const waText = `Halo Riza, nama saya *${name}* (${email}).%0A%0APesan:%0A${message}`;
      const waUrl = `https://wa.me/6283842570278?text=${waText}`;
      
      window.open(waUrl, "_blank");
    });
  }

  // --- Transisi pindah halaman (fade-out sebelum navigasi) ---
  // Saat link internal diklik, body di-fade dulu lalu baru pindah,
  // jadi perpindahan terasa mulus (bukan "njeglek").
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    document.addEventListener("click", function (e) {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      // Lewati: link kosong, anchor (#), tab baru, atau domain luar.
      if (
        !href ||
        href.startsWith("#") ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.host !== window.location.host ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0
      ) return;

      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(function () {
        window.location.href = href;
      }, 200);
    });
  }
  // Saat kembali via tombol Back, pastikan halaman tampil lagi (bukan blank).
  window.addEventListener("pageshow", function () {
    document.body.classList.remove("is-leaving");
  });

  // --- Animasi Timeline Saat di-Scroll (About Page) ---
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

  // --- Reveal saat scroll (elegan) ---
  // Grid/list -> stagger antar anak (kartu). Blok tunggal -> reveal biasa.
  // Hero TIDAK ikut (punya entrance sendiri saat load).
  if (document.documentElement.classList.contains("reveal-ready")) {
    const main = document.querySelector("main");
    if (main) {
      const staggerEls = main.querySelectorAll(
        ".card-grid, .article-list, .price-grid, .stat-row, .skill-list"
      );
      const blockEls = main.querySelectorAll(
        ".section-head, .ebook-highlight, .cta-box, .profile-card, .terminal-container, .prose, .ebook-cover, .article-header"
      );
      staggerEls.forEach(el => el.classList.add("reveal-stagger"));
      blockEls.forEach(el => el.classList.add("reveal"));

      const allTargets = [...staggerEls, ...blockEls];
      if ("IntersectionObserver" in window && allTargets.length) {
        const obs = new IntersectionObserver((entries, o) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              o.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
        allTargets.forEach(el => obs.observe(el));
      } else {
        allTargets.forEach(el => el.classList.add("is-visible"));
      }
    }
  }

  // --- Efek ketik (typing) pada judul hero ---
  const typingEl = document.querySelector("[data-typing]");
  if (typingEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const fullText = typingEl.textContent.trim();
    // Kunci tinggi elemen dulu (sesuai teks penuh) supaya saat dikosongkan
    // layout tidak loncat / collapse -> anti CLS, termasuk saat judul 2 baris.
    typingEl.style.minHeight = typingEl.offsetHeight + "px";
    typingEl.textContent = "";
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.setAttribute("aria-hidden", "true");
    typingEl.appendChild(cursor);

    let i = 0;
    (function typeNext() {
      if (i < fullText.length) {
        cursor.insertAdjacentText("beforebegin", fullText.charAt(i));
        i++;
        setTimeout(typeNext, 70 + Math.random() * 60);
      } else {
        // Hapus kursor beberapa saat setelah selesai biar bersih.
        setTimeout(() => cursor.remove(), 1800);
      }
    })();
  }
})();
