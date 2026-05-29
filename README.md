# Blog & Portofolio — Ahmad Riza Rudi

Website pribadi (blog + portofolio) yang dibangun **fullstack** pakai
**Node.js + Express + EJS + SQLite**.

## Fitur

- 🏠 **Home** — perkenalan, proyek unggulan, tulisan terbaru
- 👤 **About** — profil singkat
- 💼 **Projects** — daftar proyek + halaman detail (Anto Computer, Pacar AI, Ebook)
- 📝 **Blog** — artikel tersimpan di database SQLite, bisa difilter per tag
- 📖 **Ebook** — baca "Otak yang Mudah Dibodohi" online, per bab
- ✉️ **Contact** — form yang menyimpan pesan ke database
- 🌗 **Dark mode** — tersimpan otomatis, ikut preferensi sistem

## Teknologi

| Bagian      | Dipakai                          |
| ----------- | -------------------------------- |
| Server      | Express                          |
| Templating  | EJS                              |
| Database    | SQLite (lewat `node:sqlite` bawaan Node) |
| Markdown    | marked                           |

> Database pakai **`node:sqlite`** — modul bawaan Node.js, jadi **tidak perlu**
> install native module / compiler apa pun. Butuh Node.js **versi 22.5 ke atas**.

## Menjalankan

```bash
npm install      # install express, ejs, marked
npm run dev      # mode development (auto-restart saat file berubah)
# atau
npm start        # mode biasa
```

Buka **http://localhost:3000**. File database `db/blog.db` dibuat otomatis
saat pertama jalan, lengkap dengan artikel awal.

## Struktur Folder

```
riza-blog/
├── server.js              # titik masuk: setup Express + routing
├── routes/                # route per bagian
│   ├── main.js            #   Beranda, Tentang, Kontak
│   ├── blog.js            #   Blog & artikel
│   ├── projects.js        #   Portofolio
│   └── ebook.js           #   Baca ebook online
├── db/
│   ├── database.js        # koneksi & query SQLite (node:sqlite)
│   └── seed-data.js       # artikel awal
├── data/projects.js       # daftar proyek
├── content/ebook/         # isi ebook (index.js + bab-*.md)
├── lib/markdown.js        # Markdown -> HTML
├── views/                 # template EJS (+ partials/)
└── public/                # css & js statis
    ├── css/style.css
    └── js/main.js
```

## Cara Menambah Artikel

Artikel disimpan di tabel `articles` (SQLite). Untuk awal, daftar artikel ada di
[`db/seed-data.js`](db/seed-data.js). Menambah artikel baru bisa dengan:

1. Menambah entri di `db/seed-data.js` (lalu hapus `db/blog.db` agar di-seed ulang), atau
2. Insert langsung ke database, atau
3. (Pengembangan lanjut) bikin halaman admin untuk menulis artikel.

Format `body` artikel memakai **Markdown**.

## Cara Mengisi Ebook

Tiap bab ada di file Markdown terpisah di `content/ebook/` (`bab-01.md` … `bonus.md`).
Daftar & urutan bab diatur di `content/ebook/index.js`. Saat ini berisi
ringkasan + kerangka tiap bab — kamu bisa menempel naskah lengkapmu langsung
ke masing-masing file `.md`.
