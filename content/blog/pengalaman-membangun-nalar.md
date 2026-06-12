---
title: Pengalaman Membangun Nalar — AI Pencari Bukti Ilmiah
excerpt: "Dari kesel lihat debat tanpa sumber, jadi aplikasi yang nyari paper akademik beneran. Catatan proses, keputusan teknis, dan pelajarannya."
tags: ai, coding, nalar, openalex
date: 2026-06-05
---
[Nalar](/projects/nalar) lahir dari rasa kesel yang sederhana: debat di internet itu 90% suara, 10% bukti. Orang yakin banget — tapi nggak ada yang ngutip sumber. Gw pengen alat yang bisa jawab: *"oke, menurut paper akademik, klaim ini didukung atau nggak?"*

## Idenya

Pengguna mengetik klaim atau pertanyaan. Sistem mencari paper yang relevan, merangkum, lalu menyusun **dua sisi argumen** — pro dan kontra — lengkap dengan kualitas sumber dan seberapa kuat konsensusnya. Bukan "AI yang sok tahu", tapi AI yang nunjukin di mana buktinya.

## Keputusan teknis terbesar: OpenAlex

Masalah pertama: dari mana dapat paper akademik? Google Scholar nggak punya API resmi. Jurnal berbayar mahal. Ketemu jawabannya: **OpenAlex** — database akademik terbuka berisi ratusan juta karya ilmiah, API-nya gratis dan nggak perlu API key.

```
GET https://api.openalex.org/works?search=vaccine+autism
```

Hasilnya JSON berisi judul, abstrak, jumlah sitasi, jurnal, tahun. Bahan mentah yang sempurna.

## Peran AI-nya di mana?

AI (gw pakai Gemini) masuk di tiga titik:

1. **Menerjemahkan pertanyaan awam jadi query akademik.** "Apakah vaksin menyebabkan autisme" → istilah pencarian yang nyambung sama judul paper.
2. **Merangkum abstrak** jadi bahasa manusia tanpa mengubah makna. Ini bagian paling sensitif — salah rangkum = nyebar misinformasi pakai baju sains.
3. **Menyusun dua sisi** dan menilai ke arah mana bukti condong.

Pelajaran penting: AI-nya **nggak boleh jadi sumber kebenaran**. Dia cuma kurir dan penerjemah. Sumber kebenarannya tetap paper — makanya tiap klaim di hasil Nalar selalu nempel ke paper aslinya.

## Yang paling susah

Menyusun "skor konsensus". Jumlah paper doang nggak cukup — 100 paper abal-abal kalah sama 10 paper di jurnal top yang banyak disitasi. Akhirnya gw timbang dari kombinasi: jumlah sitasi, usia paper, dan konsistensi arah kesimpulan. Masih jauh dari sempurna, dan jujur ini bagian yang paling sering gw utak-atik sampai sekarang.

## Pelajaran buat lo yang mau bikin produk AI

- **Mulai dari masalah yang lo rasain sendiri.** Gw peduli soal hoaks (sampai nulis [ebook](/ebook) tentang itu) — jadi nggak pernah kehabisan motivasi.
- **API publik itu harta karun.** Nggak perlu nunggu punya data sendiri; OpenAlex, Wikipedia, data BPS — semua terbuka.
- **Batasi peran AI.** Produk AI yang baik justru yang tahu kapan AI-nya nggak boleh ngarang.

Nalar bisa dicoba langsung di [nalar-debat.vercel.app](https://nalar-debat.vercel.app/).
