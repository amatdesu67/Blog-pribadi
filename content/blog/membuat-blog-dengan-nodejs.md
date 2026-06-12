---
title: Membuat Blog dengan Node.js Tanpa Framework Berat
excerpt: "Blog ini dibangun pakai Express + EJS + file Markdown. Tanpa CMS, tanpa database buat artikel. Begini arsitekturnya."
tags: coding, nodejs, express, blog
date: 2026-06-08
---
Sebelum bikin blog ini, gw sempat lihat-lihat: WordPress? Kebanyakan. Next.js + CMS? Buat blog pribadi rasanya overkill. Akhirnya gw pilih jalur paling sederhana yang tetap "milik gw sepenuhnya": **Express + EJS + file Markdown**.

## Arsitekturnya satu paragraf

Tiap artikel = satu file `.md` di folder `content/blog/`. Bagian atas file berisi metadata (judul, tanggal, tags), sisanya tulisan. Saat server start, semua file dibaca sekali, di-parse, di-cache di memori, lalu di-render ke HTML pakai EJS. Nggak ada database buat artikel. Mau nambah tulisan? Bikin file baru, `git push`, Vercel deploy otomatis. Selesai.

## Format artikelnya

```markdown
---
title: Judul Artikel
excerpt: "Ringkasan satu kalimat."
tags: coding, nodejs
date: 2026-06-08
---
Isi artikel pakai **Markdown** biasa...
```

Bagian di antara `---` namanya *frontmatter*. Parser-nya bisa ditulis sendiri ~30 baris (split per baris, cari `key: value`) — nggak wajib install library.

## Markdown → HTML

Gw pakai `marked`, satu-satunya dependency tambahan buat fitur blog:

```js
const { marked } = require("marked");
const html = marked.parse(isiMarkdown);
```

Lalu di EJS tinggal `<%- contentHtml %>` (pakai `<%-` bukan `<%=`, biar HTML-nya nggak di-escape).

## Kenapa nggak pakai database?

Karena artikel itu *konten yang jarang berubah dan nggak butuh query rumit*. File Markdown menang di semua hal yang penting buat blog pribadi: bisa ditulis di editor apa pun, ke-backup otomatis di Git, gampang dipindah ke platform lain kalau suatu saat ganti stack, dan nggak ada biaya hosting database.

Database tetap gw pakai — tapi cuma buat hal yang memang dinamis (pesan dari form kontak).

## Hasilnya

Blog yang lo baca ini. Ringan, gratis hosting-nya, dan tiap bagiannya gw paham karena gw yang nulis dari nol. Buat yang lagi belajar backend, bikin blog sendiri itu proyek yang pas banget: cukup kecil buat selesai, cukup nyata buat dipakai tiap hari.
