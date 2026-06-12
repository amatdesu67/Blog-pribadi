---
title: Belajar Express untuk Pemula — Peta Jalan yang Gw Harap Ada Dulu
excerpt: "Express itu kecil banget — justru itu masalahnya buat pemula. Ini urutan belajar yang masuk akal, dari pengalaman gw sendiri."
tags: coding, express, nodejs, pemula
date: 2026-06-10
---
Waktu pertama belajar Express, gw bingung bukan karena Express-nya susah — tapi karena dia **terlalu bebas**. Nggak ada struktur wajib, nggak ada aturan. Tutorial A foldernya beda sama tutorial B. Ini peta jalan yang akhirnya bikin gw paham.

## 1. Pahami satu kalimat ini dulu

> Express itu cuma: "kalau ada request ke URL X, jalankan fungsi Y."

Semuanya turunan dari situ.

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Halo dunia");
});

app.listen(3000);
```

Lima baris. Itu server beneran. Jalankan `node app.js`, buka `localhost:3000`, selesai. Jangan lanjut sebelum lo nyaman sama lima baris ini.

## 2. Urutan belajar yang gw saranin

1. **Routing dasar** — `app.get`, `app.post`, parameter URL (`/blog/:slug` → `req.params.slug`)
2. **res yang macam-macam** — `res.send`, `res.json`, `res.render`, `res.redirect`, `res.status(404)`
3. **Middleware** — ini konsep paling penting di Express. `app.use(...)` = fungsi yang jalan *sebelum* route. Logger, parser body, file statis — semua middleware.
4. **Template engine** (gw pakai EJS) — biar HTML bisa diisi data dari server
5. **Form & req.body** — `express.urlencoded()` lalu proses POST
6. **Pisahkan route ke file** — `routes/blog.js`, `routes/projects.js`, di-mount pakai `app.use("/blog", blogRoutes)`

## 3. Bikin proyek nyata secepat mungkin

Gw nggak benar-benar paham Express dari tutorial — gw paham waktu maksa diri bikin [Anto Computer](/projects/anto-computer), toko online pertama gw. Katalog, keranjang, checkout. Jelek? Iya, versi pertamanya. Tapi tiap fitur maksa gw belajar hal baru yang *gw butuhkan*, bukan yang tutorial suruh.

## 4. Yang nggak perlu dipelajari dulu

Biar nggak overwhelmed, ini boleh ditunda: TypeScript, ORM (Prisma/Sequelize), microservice, Docker, testing. Semuanya berguna — *nanti*. Pemula yang sibuk setup tools sering nggak pernah sampai ke bagian bikin produk.

Mulai dari lima baris di atas. Sisanya nyusul sambil jalan.
