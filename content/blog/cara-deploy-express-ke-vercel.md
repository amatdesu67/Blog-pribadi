---
title: Cara Deploy Express ke Vercel (Tanpa Pusing)
excerpt: "Vercel itu buat Next.js? Nggak juga. Blog yang lagi lo baca ini Express murni, jalan di Vercel. Begini caranya."
tags: coding, express, vercel, deploy
date: 2026-06-12
---
Banyak tutorial bilang Vercel cuma cocok buat Next.js. Padahal blog yang lagi lo baca ini **Express murni** — dan jalan mulus di Vercel, gratis. Ini cara yang gw pakai.

## Konsepnya dulu

Vercel nggak menjalankan server lo 24 jam. Dia mengubah aplikasi lo jadi *serverless function*: kode baru "bangun" saat ada request, lalu tidur lagi. Konsekuensinya satu: **lo nggak boleh manggil `app.listen()`** di kode yang dibaca Vercel.

Jadi triknya: pisahkan aplikasi dari server.

## Struktur yang gw pakai

```
project/
├── app.js          → bikin & export app Express (TANPA listen)
├── server.js       → app.listen() — cuma buat lokal
├── api/
│   └── index.js    → entry point Vercel
└── vercel.json
```

`app.js` cukup begini di akhir:

```js
module.exports = app;
```

`server.js` buat development di laptop:

```js
const app = require("./app");
app.listen(3000, () => console.log("jalan di :3000"));
```

`api/index.js` — ini yang dibaca Vercel:

```js
const app = require("../app");
module.exports = app;
```

## vercel.json

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
}
```

Artinya: semua request, route mana pun, diarahkan ke function `api/index.js`. Express yang urus routing-nya seperti biasa.

## Deploy

Push ke GitHub, import repo di vercel.com, selesai. Tiap `git push` berikutnya otomatis deploy ulang. Nggak perlu CLI, nggak perlu setting CI/CD.

## Jebakan yang sempat gw injak

- **File statis** — folder `public/` aman dipakai lewat `express.static`, tapi *menulis* file saat runtime (upload, log) bakal hilang karena serverless itu read-only. Simpan ke database/storage eksternal.
- **Database SQLite lokal** nggak bisa dipakai di Vercel (filesystem-nya sementara). Gw migrasi ke Turso — SQLite yang hosted, gratis tier-nya cukup.
- **Cold start** — request pertama setelah lama idle agak lambat (~1 detik). Normal, bukan bug.

Selebihnya? Express lo jalan persis seperti di lokal. Buktinya lagi lo baca sekarang.
