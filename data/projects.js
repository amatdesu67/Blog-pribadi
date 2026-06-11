// data/projects.js
// Daftar proyek. Tiap proyek sekarang format studi kasus:
// problem (masalah), solution (solusi), challenge (tantangan utama),
// stack (teknologi), repo (source code, isi null kalau private).
// featuredMain: true = proyek unggulan utama (Nalar).

const projects = [
  {
    slug: "nalar",
    title: "Nalar",
    tagline: "Mesin pencari bukti ilmiah — berargumen dengan bukti",
    summary:
      "Cari jawaban yang berdasar pada jurnal akademik: lihat dua sisi argumen, " +
      "kualitas sumber, dan tingkat konsensus ilmiahnya.",
    description:
      "Nalar adalah mesin pencari bukti ilmiah. Alih-alih menebak, pengguna " +
      "memasukkan pertanyaan lalu Nalar mencarikan jawaban yang berdasar pada " +
      "paper akademik (lewat database publik OpenAlex). Nalar menimbang dua sisi " +
      "argumen, menilai kualitas sumber, dan menunjukkan seberapa kuat konsensus " +
      "ilmiahnya — plus menyimpan riwayat pencarian.",
    problem:
      "Debat di internet jarang didukung sumber ilmiah — orang berargumen pakai " +
      "perasaan, bukan paper. Mencari bukti akademik itu lambat dan ribet.",
    solution:
      "AI yang mencari paper relevan via OpenAlex, merangkum abstrak, menimbang " +
      "dua sisi argumen, lalu menampilkan kualitas sumber & tingkat konsensus.",
    challenge:
      "Merangkum abstrak akademik jadi bahasa awam tanpa mengubah maknanya, dan " +
      "menyusun skor konsensus dari hasil pencarian yang beragam.",
    flow: [
      { step: "Pertanyaan", desc: "Pengguna mengetik klaim / pertanyaan" },
      { step: "Pencarian", desc: "Query ke database OpenAlex" },
      { step: "Analisis AI", desc: "Rangkum abstrak, nilai kualitas sumber" },
      { step: "Dua Sisi", desc: "Susun argumen pro & kontra" },
      { step: "Konsensus", desc: "Skor seberapa kuat bukti ilmiahnya" },
    ],
    stack: ["Node.js", "Express", "Gemini", "OpenAlex"],
    tags: ["AI", "Sains", "Berpikir Kritis", "OpenAlex"],
    year: 2026,
    url: "https://nalar-debat.vercel.app/",
    repo: null, // isi link GitHub kalau mau dipublikasikan
    type: "Web App",
    featured: true,
    featuredMain: true,
  },
  {
    slug: "cofus-coffee",
    title: "Cofus Coffee",
    tagline: "Website kedai kopi — \"Everyday is CofusDay\"",
    summary:
      "Website kedai kopi di Kuala Kapuas: profil & suasana, galeri, menu yang " +
      "dikelola lewat admin panel, lokasi & jam buka, plus form pesan via WhatsApp.",
    description:
      "Cofus Coffee adalah website untuk kedai kopi di Kuala Kapuas. Selain tampilan " +
      "landing page yang rapi (hero, cerita kedai, galeri suasana, lokasi & jam buka " +
      "09.00–23.00), menunya bisa diatur lewat admin panel — jadi pemilik bisa " +
      "menambah/mengubah menu sendiri tanpa ngoding. Pemesanan langsung terhubung " +
      "ke WhatsApp.",
    problem:
      "UMKM butuh hadir online, tapi tiap ganti menu harus minta tolong developer — " +
      "mahal dan lambat.",
    solution:
      "Landing page lengkap + admin panel sederhana: pemilik kedai bisa kelola menu " +
      "sendiri, pesanan langsung masuk WhatsApp.",
    challenge:
      "Bikin admin panel yang cukup sederhana untuk dipakai orang non-teknis.",
    stack: ["Node.js", "Express", "SQLite", "Admin Panel"],
    tags: ["Landing Page", "Bisnis", "UMKM", "Admin Panel"],
    year: 2026,
    url: "https://cofus-coffe.vercel.app/",
    repo: null,
    type: "Web App",
    featured: true,
  },
  {
    slug: "anto-computer",
    title: "Anto Computer",
    tagline: "Website toko komputer",
    summary:
      "Toko komputer online: katalog produk, keranjang, dan checkout sederhana.",
    description:
      "Anto Computer adalah website toko komputer yang dibangun pakai Express dan " +
      "SQLite. Fitur utamanya katalog produk, halaman detail barang, keranjang " +
      "belanja, dan alur checkout sederhana. Proyek tempat belajar fullstack: " +
      "routing di server, query database, sampai render halaman.",
    problem:
      "Toko komputer lokal cuma jualan lewat chat — pembeli nggak bisa lihat " +
      "katalog & harga dengan rapi.",
    solution:
      "Toko online dengan katalog, detail produk, keranjang, dan alur checkout " +
      "yang jelas dari ujung ke ujung.",
    challenge:
      "Mengelola state keranjang & alur checkout tanpa framework frontend.",
    stack: ["Node.js", "Express", "SQLite"],
    tags: ["Express", "SQLite", "Node.js", "Fullstack"],
    year: 2026,
    url: "https://anto-computer-taupe.vercel.app/",
    repo: null,
    type: "Web App",
    featured: true,
  },
  {
    slug: "pacar-ai",
    title: "Pacar AI",
    tagline: "Aplikasi AI teman ngobrol",
    summary:
      "Aplikasi AI buat ngobrol — punya alur setup karakter sebelum mulai chat.",
    description:
      "Pacar AI adalah aplikasi berbasis AI untuk ngobrol. Sebelum mulai, " +
      "pengguna mengatur dulu karakter/persona di halaman setup, baru masuk " +
      "ke percakapan.",
    problem:
      "Chatbot generik terasa kaku — nggak ada kepribadian yang bisa diatur pengguna.",
    solution:
      "Alur setup persona sebelum chat: pengguna mendesain karakter dulu, AI " +
      "menjawab konsisten sesuai persona itu.",
    challenge:
      "Menjaga konsistensi karakter sepanjang percakapan & mengelola konteks chat.",
    stack: ["Node.js", "JavaScript", "AI API"],
    tags: ["AI", "Node.js", "JavaScript"],
    year: 2026,
    url: "https://pacar-ai67.vercel.app/setup",
    repo: null,
    type: "Web App",
    featured: true,
  },
  {
    slug: "ebook-otak-yang-mudah-dibodohi",
    title: "Otak yang Mudah Dibodohi",
    tagline: "Ebook panduan berpikir kritis",
    summary:
      "Ebook yang kutulis & terbitkan: panduan bertahan di era hoaks, " +
      "pseudosains, dan manipulasi informasi.",
    description:
      "Ebook orisinal: 12 bab tentang cara kerja otak yang gampang ditipu, bias " +
      "kognitif, anatomi hoaks, pseudosains, teori konspirasi, logika, statistik, " +
      "sampai cara membangun kebiasaan berpikir kritis. Bisa dibaca langsung di sini.",
    problem:
      "Hoaks dan pseudosains menyebar lebih cepat daripada kemampuan orang menyaringnya.",
    solution:
      "Panduan praktis 12 bab dengan bahasa santai — dari bias kognitif sampai cara " +
      "fact-check seperti jurnalis.",
    challenge:
      "Menjelaskan konsep psikologi & logika secara akurat tanpa terasa seperti buku kuliah.",
    stack: ["Menulis", "Markdown", "Riset"],
    tags: ["Menulis", "Berpikir Kritis", "Ebook"],
    year: 2026,
    url: "/ebook",
    repo: null,
    internal: true,
    type: "Ebook",
    featured: true,
  },
];

function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

module.exports = { projects, getProjectBySlug };
