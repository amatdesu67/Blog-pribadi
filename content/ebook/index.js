// content/ebook/index.js
// Metadata ebook + daftar bab (berurutan).
// Isi tiap bab ada di file markdown terpisah (lihat folder ini) supaya
// gampang diedit. Untuk menampilkan, server membaca file .md sesuai "file".

const ebook = {
  title: "Otak yang Mudah Dibodohi",
  subtitle: "Panduan bertahan di era hoaks, pseudosains, dan manipulasi informasi",
  edition: "Edisi Pertama · 2026",
  author: "Ahmad Riza Rudi",
  // Catatan: isi tiap bab di sini adalah ringkasan + kerangka praktis.
  // Naskah lengkap bisa kamu tempel sendiri ke masing-masing file .md.
};

// Daftar bab. "slug" dipakai di URL (/ebook/:slug), "file" nama file markdown.
const chapters = [
  { number: "01", slug: "kenapa-otak-gampang-ditipu", title: "Kenapa Otak Kita Gampang Ditipu", file: "bab-01.md" },
  { number: "02", slug: "bias-kognitif", title: "Bias Kognitif yang Sering Menyerang", file: "bab-02.md" },
  { number: "03", slug: "anatomi-hoaks", title: "Anatomi Sebuah Hoaks", file: "bab-03.md" },
  { number: "04", slug: "pseudosains", title: "Pseudosains: Sains Palsu yang Terasa Asli", file: "bab-04.md" },
  { number: "05", slug: "teori-konspirasi", title: "Teori Konspirasi & Cara Kerjanya", file: "bab-05.md" },
  { number: "06", slug: "evolusi", title: "Evolusi & Mengapa Banyak yang Salah Paham", file: "bab-06.md" },
  { number: "07", slug: "logika-dasar", title: "Logika Dasar yang Wajib Dikuasai", file: "bab-07.md" },
  { number: "08", slug: "membaca-data", title: "Cara Membaca Data & Statistik", file: "bab-08.md" },
  { number: "09", slug: "media-sosial", title: "Media Sosial sebagai Mesin Manipulasi", file: "bab-09.md" },
  { number: "10", slug: "fact-check", title: "Cara Fact-Check Seperti Jurnalis", file: "bab-10.md" },
  { number: "11", slug: "debat-sehat", title: "Debat & Argumen yang Sehat", file: "bab-11.md" },
  { number: "12", slug: "kebiasaan-berpikir-kritis", title: "Membangun Kebiasaan Berpikir Kritis", file: "bab-12.md" },
  { number: "★", slug: "bonus-sumber-tools", title: "Bonus: Daftar Sumber & Tools", file: "bonus.md" },
];

// Cari bab berdasarkan slug + tahu posisinya (buat navigasi prev/next).
function getChapter(slug) {
  const index = chapters.findIndex((c) => c.slug === slug);
  if (index === -1) return null;
  return {
    chapter: chapters[index],
    prev: chapters[index - 1] || null,
    next: chapters[index + 1] || null,
  };
}

module.exports = { ebook, chapters, getChapter };
