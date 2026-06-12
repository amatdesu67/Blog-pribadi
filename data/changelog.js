// data/changelog.js
// Riwayat perubahan website. Tambah entri paling atas tiap update.

const changelog = [
  {
    version: "2.2",
    date: "2026-06-12",
    changes: [
      "7 artikel baru: deploy Vercel, Express pemula, blog Node.js, Nalar, LLM, OpenAlex, GSAP",
      "Halaman ebook: statistik (bab, halaman, waktu baca) + tombol download PDF",
    ],
  },
  {
    version: "2.1",
    date: "2026-06-11",
    changes: [
      "Hero: statistik dinamis + globe jaringan partikel 3D",
      "Format studi kasus di tiap proyek (masalah → solusi → tantangan)",
      "Nalar jadi featured project dengan diagram cara kerja",
      "Halaman baru: /now dan /changelog",
      "SEO: structured data (JSON-LD) + metadata baru",
    ],
  },
  {
    version: "2.0",
    date: "2026-06-11",
    changes: [
      "Redesign total: estetika premium dark ala Apple",
      "Animasi GSAP + ScrollTrigger + Lenis smooth scroll",
      "Identitas terminal-heritage: mono accents, grain, neofetch card",
      "Carousel proyek horizontal + reading progress di artikel",
    ],
  },
  {
    version: "1.0",
    date: "2026",
    changes: [
      "Rilis pertama: blog, proyek, ebook, jasa, kontak",
      "Karakter VRM 3D di hero",
    ],
  },
];

module.exports = { changelog };
