---
title: OpenAlex — Akses Jutaan Paper Akademik, Gratis, Tanpa API Key
excerpt: "Database akademik terbuka yang jadi tulang punggung Nalar. Cara pakainya, plus tips dari pengalaman gw."
tags: ai, openalex, riset, api
date: 2026-05-30
---
Waktu bikin [Nalar](/projects/nalar), kebutuhan utamanya jelas: akses ke paper akademik lewat kode. Ternyata jawabannya bukan layanan mahal — tapi proyek terbuka bernama **OpenAlex**.

## Apa itu OpenAlex?

Database terbuka berisi metadata ratusan juta karya ilmiah: judul, abstrak, penulis, jurnal, jumlah sitasi, topik, dan relasi antar paper. Penerus spiritual Microsoft Academic Graph, dikelola nirlaba OurResearch. Dan bagian terbaiknya:

- **Gratis.**
- **Nggak perlu API key.**
- **Nggak perlu daftar.**

## Cara pakai paling dasar

Langsung bisa dicoba di browser:

```
https://api.openalex.org/works?search=sleep+memory
```

Balasannya JSON berisi daftar paper soal hubungan tidur dan memori. Di Node.js:

```js
const res = await fetch(
  "https://api.openalex.org/works?search=" +
  encodeURIComponent("sleep memory") +
  "&per-page=10"
);
const data = await res.json();
data.results.forEach(w =>
  console.log(w.title, "—", w.cited_by_count, "sitasi")
);
```

## Field yang paling berguna

- `title`, `publication_year` — identitas paper
- `cited_by_count` — berapa kali disitasi (proxy kasar untuk pengaruh)
- `abstract_inverted_index` — abstrak, tapi formatnya "kebalik" (kata → posisi). Perlu disusun ulang jadi kalimat; fungsi kecil ~10 baris cukup.
- `primary_location.source.display_name` — nama jurnalnya
- `open_access.oa_url` — link versi gratis paper kalau ada

## Filter itu kuncinya

Pencarian mentah sering kebanyakan noise. Filter favorit gw:

```
?filter=publication_year:>2015,cited_by_count:>50
```

Paper di atas 2015 dengan minimal 50 sitasi — langsung nyaring kualitas. Bisa juga filter per topik, per jurnal, per tipe (artikel/review).

## Tips dari pengalaman

1. **Kasih email lo di parameter `mailto=`** — masuk "polite pool", rate limit-nya lebih longgar.
2. **Abstrak nggak selalu ada** (kosong di sebagian paper) — kode lo harus siap fallback ke judul.
3. **Sitasi ≠ kebenaran.** Paper kontroversial bisa banyak disitasi justru karena dibantah. Pakai sitasi sebagai sinyal, bukan vonis.

Buat builder Indonesia yang mau bikin produk berbasis sains — alat riset, fact-checker, asisten skripsi — OpenAlex itu pintu masuk yang nyaris terlalu murah hati. Manfaatkan.
