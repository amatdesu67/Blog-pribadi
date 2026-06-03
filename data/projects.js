// data/projects.js
// Daftar proyek yang ditampilkan di halaman Projects.
// Disimpan sebagai data biasa (bukan database) karena jumlahnya sedikit
// dan jarang berubah — lebih gampang dibaca & diedit langsung di sini.

const projects = [
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
      "ke WhatsApp. Contoh nyata website bisnis untuk UMKM yang kutawarkan.",
    tags: ["Landing Page", "Bisnis", "UMKM", "Admin Panel"],
    year: 2026,
    url: "https://cofus-coffe.vercel.app/",
    type: "Web App",
    featured: true,
  },
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
      "ilmiahnya — plus menyimpan riwayat pencarian.\n\n" +
      "Proyek ini paling dekat dengan hal yang kupedulikan: berpikir kritis dan " +
      "melawan hoaks (tema yang juga kutulis di ebook 'Otak yang Mudah Dibodohi'). " +
      "Secara teknis, di sini aku belajar memanggil API eksternal (OpenAlex), " +
      "merangkum abstrak, dan menyimpan data pencarian.",
    tags: ["AI", "Sains", "Berpikir Kritis", "OpenAlex"],
    year: 2026,
    url: "https://nalar-debat.vercel.app/",
    type: "Web App",
    featured: true,
  },
  {
    slug: "anto-computer",
    title: "Anto Computer",
    tagline: "Website toko komputer",
    // Deskripsi singkat buat kartu di halaman daftar proyek
    summary:
      "Toko komputer online: katalog produk, keranjang, dan checkout sederhana.",
    // Deskripsi panjang buat halaman detail proyek
    description:
      "Anto Computer adalah website toko komputer yang saya bangun pakai " +
      "Express dan SQLite. Fitur utamanya katalog produk, halaman detail " +
      "barang, keranjang belanja, dan alur checkout sederhana. Proyek ini " +
      "jadi tempat saya belajar bikin aplikasi fullstack: routing di server, " +
      "query database, sampai render halaman.",
    tags: ["Express", "SQLite", "Node.js", "Fullstack"],
    year: 2026,
    url: "https://anto-computer-taupe.vercel.app/", // link demo (eksternal)
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
      "ke percakapan. Lewat proyek ini saya belajar menghubungkan aplikasi " +
      "ke layanan AI dan mengelola alur percakapan.",
    tags: ["AI", "Node.js", "JavaScript"],
    year: 2026,
    url: "https://pacar-ai67.vercel.app/setup",
    type: "Web App",
    featured: true,
  },
  {
    slug: "ebook-otak-yang-mudah-dibodohi",
    title: "Otak yang Mudah Dibodohi",
    tagline: "Ebook panduan berpikir kritis",
    summary:
      "Ebook yang saya tulis & terbitkan: panduan bertahan di era hoaks, " +
      "pseudosains, dan manipulasi informasi.",
    description:
      "Ebook orisinal yang saya tulis dan terbitkan sendiri. Isinya 12 bab " +
      "tentang cara kerja otak yang gampang ditipu, bias kognitif, anatomi " +
      "hoaks, pseudosains, teori konspirasi, logika, statistik, sampai cara " +
      "membangun kebiasaan berpikir kritis. Bisa dibaca langsung di sini.",
    tags: ["Menulis", "Berpikir Kritis", "Ebook"],
    year: 2026,
    url: "/ebook", // link internal — dibaca online di blog ini
    internal: true, // penanda: link ini halaman di dalam situs, bukan eksternal
    type: "Ebook",
    featured: true,
  },
];

// Cari satu proyek berdasarkan slug-nya (buat halaman detail).
function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

module.exports = { projects, getProjectBySlug };
