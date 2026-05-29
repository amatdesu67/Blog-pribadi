// db/seed-data.js
// Artikel awal yang dimasukkan ke database saat pertama kali dijalankan
// (kalau tabel "articles" masih kosong). Isi "body" pakai format Markdown.
// Nanti kamu bisa nambah artikel lewat database langsung atau bikin halaman admin.

const seedArticles = [
  {
    slug: "halo-ini-blog-pertamaku",
    title: "Halo, Aku Riza 👋",
    excerpt:
      "Perkenalan singkat: siapa aku, kenapa bikin blog ini, dan apa yang bakal kutulis di sini.",
    tags: ["personal", "menulis"],
    date: "2026-05-28",
    body: `Akhirnya blog ini jadi juga! Namaku **Ahmad Riza Rudi**, 18 tahun, siswa SMK jurusan TKJ yang lagi serius belajar ngoding.

## Kenapa bikin blog?

- **Nyatat perjalanan belajar** — biar kelihatan progress-nya dari waktu ke waktu.
- **Berbagi proyek** — dari toko komputer online sampai ebook yang kutulis sendiri.
- **Latihan nulis** — karena nulis maksa kita ngerti sesuatu beneran.

## Apa yang bakal kutulis?

Macam-macam: catatan teknis seputar web (Node.js, Express, SQLite), cerita di balik proyek-proyekku, sampai pemikiran random soal teknologi dan belajar.

Selamat datang, dan sampai ketemu di tulisan berikutnya!`,
  },
  {
    slug: "membuat-anto-computer",
    title: "Membuat Anto Computer pakai Express + SQLite",
    excerpt:
      "Cerita di balik proyek toko komputer online pertamaku — dari nol sampai bisa checkout.",
    tags: ["express", "sqlite", "proyek"],
    date: "2026-05-22",
    body: `Salah satu proyek yang paling banyak ngajarin aku adalah **Anto Computer** — website toko komputer.

## Stack yang dipakai

- **Express** untuk server dan routing.
- **SQLite** untuk menyimpan data produk dan pesanan.
- HTML/CSS/JS untuk tampilannya.

## Yang kupelajari

Bikin alur belanja itu ternyata banyak detailnya: nampilin katalog, halaman detail produk, keranjang, sampai checkout. Aku belajar mikir soal **struktur data** (gimana nyimpen produk dan pesanan) dan **alur request** dari klik tombol sampai data kesimpan di database.

> Pelajaran terbesar: mulai dari yang kecil dan bisa jalan dulu, baru tambahin fitur satu per satu.

Demo-nya bisa dilihat di halaman [Projects](/projects).`,
  },
  {
    slug: "kenapa-aku-nulis-ebook",
    title: "Kenapa Aku Nulis Ebook tentang Berpikir Kritis",
    excerpt:
      "Sedikit cerita soal 'Otak yang Mudah Dibodohi' — ebook yang kutulis dan terbitkan sendiri.",
    tags: ["menulis", "berpikir-kritis"],
    date: "2026-05-15",
    body: `Selain ngoding, aku juga suka nulis. Hasilnya: ebook berjudul **"Otak yang Mudah Dibodohi"** — panduan bertahan di era hoaks, pseudosains, dan manipulasi informasi.

## Kenapa topik ini?

Karena aku sendiri sering lihat (dan kadang ikut) nyebarin info yang belum tentu benar di grup keluarga. Ternyata bukan soal pintar atau bodoh — itu cara kerja otak manusia yang memang gampang ditipu.

## Isinya apa aja?

12 bab: dari cara kerja otak, bias kognitif, anatomi hoaks, pseudosains, sampai cara fact-check seperti jurnalis dan membangun kebiasaan berpikir kritis.

Kabar baiknya, ebook-nya bisa **dibaca langsung di blog ini**. Cek di halaman [Ebook](/ebook).`,
  },
];

module.exports = { seedArticles };
