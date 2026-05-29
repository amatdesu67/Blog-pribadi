# Blog & Portofolio — Ahmad Riza Rudi

Website pribadi (blog + portofolio) **fullstack** pakai
**Node.js + Express + EJS + libSQL/SQLite (Turso)**.

## Fitur

- 🏠 **Home** — perkenalan, proyek unggulan, tulisan terbaru
- 👤 **About** — profil singkat
- 💼 **Projects** — daftar proyek + detail (Anto Computer, Pacar AI, Ebook)
- 📝 **Blog** — artikel tersimpan di database, bisa difilter per tag
- 📖 **Ebook** — baca "Otak yang Mudah Dibodohi" online, per bab
- ✉️ **Contact** — form yang menyimpan pesan ke database
- 🌗 **Dark mode** — tersimpan otomatis, ikut preferensi sistem

## Teknologi

| Bagian     | Dipakai                                   |
| ---------- | ----------------------------------------- |
| Server     | Express                                   |
| Templating | EJS                                       |
| Database   | libSQL (`@libsql/client`) — file lokal / Turso |
| Markdown   | marked                                    |

**Database satu driver, dua mode:**

- **Lokal** → otomatis pakai file `db/blog.db` (tanpa setup apa pun).
- **Produksi** → pakai **Turso** (SQLite online) lewat environment variable.

## Menjalankan Lokal

```bash
npm install
npm run dev      # development (auto-restart) -> http://localhost:3000
# atau
npm start
```

File `db/blog.db` dibuat otomatis + diisi artikel awal saat pertama jalan.

## Struktur Folder

```
riza-blog/
├── app.js                 # bikin & export aplikasi Express (tanpa listen)
├── server.js              # menjalankan app secara lokal (app.listen)
├── api/index.js           # entry point untuk Vercel (serverless)
├── vercel.json            # konfigurasi deploy Vercel
├── routes/                # main, blog, projects, ebook
├── db/
│   ├── database.js        # koneksi & query libSQL (file lokal / Turso)
│   └── seed-data.js       # artikel awal
├── data/                  # projects.js, social.js
├── content/ebook/         # index.js + bab-*.md
├── lib/markdown.js        # Markdown -> HTML
├── views/                 # template EJS (+ partials/)
└── public/                # css & js statis
```

## Deploy ke Vercel + Turso

1. **Buat database Turso** (sekali saja):
   ```bash
   # pakai Turso CLI, atau lewat dashboard turso.tech
   turso db create blog-pribadi
   turso db show blog-pribadi --url        # -> TURSO_DATABASE_URL
   turso db tokens create blog-pribadi     # -> TURSO_AUTH_TOKEN
   ```
2. **Push kode ke GitHub.**
3. **Import repo ke Vercel** (vercel.com → New Project → pilih repo).
4. **Set Environment Variables** di Vercel (Settings → Environment Variables):
   - `TURSO_DATABASE_URL` = `libsql://...turso.io`
   - `TURSO_AUTH_TOKEN` = token dari langkah 1
5. **Deploy.** Tabel & artikel awal dibuat otomatis saat pertama diakses.

> Tabel dibuat otomatis (idempoten) — tidak perlu migrasi manual.

## Menambah Artikel

Artikel awal ada di [`db/seed-data.js`](db/seed-data.js) (format `body` = Markdown).
Untuk seterusnya bisa insert langsung ke database, atau (pengembangan lanjut)
bikin halaman admin.

## Mengisi Ebook

Tiap bab = satu file Markdown di `content/ebook/` (`bab-01.md` … `bonus.md`),
diurutkan di `content/ebook/index.js`. Saat ini berisi ringkasan + kerangka tiap
bab; naskah lengkap bisa ditempel langsung ke file `.md`-nya.
