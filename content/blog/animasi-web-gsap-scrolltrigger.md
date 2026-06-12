---
title: Bikin Website Berasa Mahal dengan GSAP + ScrollTrigger
excerpt: "Redesign blog ini ngajarin gw satu hal: yang bikin animasi terasa premium bukan banyaknya efek, tapi menahan diri. Plus pola kode yang gw pakai."
tags: coding, gsap, animasi, frontend
date: 2026-06-11
---
Redesign blog ini (yang sekarang lo lihat) adalah proyek pertama gw yang serius pakai **GSAP + ScrollTrigger**. Hasil belajarnya gw tulis di sini — termasuk kesalahan yang sempat bikin animasinya norak.

## Pelajaran #1: restraint > efek

Versi draft pertama gw: semua elemen fade, slide, zoom, parallax. Hasilnya kayak template PowerPoint 2010. Yang akhirnya bikin terasa "mahal" justru aturan ketat:

- **Satu fokus animasi per section.** Hero = headline naik. About = teks reveal. Cukup.
- **Durasi konsisten** (0.8–1.2 detik) dan **satu easing** (`power3.out`) di semua tempat.
- Elemen pendukung cukup fade tipis, atau diam sama sekali.

## Pola dasar yang kepakai terus

**Muncul saat masuk viewport** — 80% kebutuhan animasi scroll itu ini:

```js
gsap.from(".kartu", {
  y: 30,
  autoAlpha: 0,        // opacity + visibility sekaligus
  duration: 1,
  ease: "power3.out",
  stagger: 0.1,        // muncul gantian
  scrollTrigger: { trigger: ".kartu", start: "top 85%", once: true }
});
```

**Scrub** — animasi yang "nempel" ke posisi scroll (maju-mundur ngikutin jari):

```js
scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: 0.5 }
```

Gw pakai ini buat efek teks yang menyala per kata di section About.

**Pin + horizontal scroll** — section diam, isinya geser ke samping:

```js
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: { trigger: section, pin: true, scrub: 1,
    end: () => "+=" + (track.scrollWidth - innerWidth) }
});
```

Ini resep carousel proyek ala halaman produk Apple.

## Pelajaran #2: hormati device orang

Dua hal yang wajib, titik:

```js
// Matikan animasi kalau user minta
if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

// Versi beda buat mobile (tanpa pin & scrub berat)
const mm = gsap.matchMedia();
mm.add("(min-width: 769px)", () => { /* animasi desktop */ });
mm.add("(max-width: 768px)", () => { /* fade sederhana */ });
```

Scroll-jacking di HP itu menyiksa. Di blog ini, carousel horizontal berubah jadi swipe biasa di mobile.

## Pelajaran #3: konten harus selamat tanpa JS

Set kondisi awal animasi lewat `gsap.set()` di JavaScript, **bukan** `opacity: 0` di CSS. Kalau CDN GSAP gagal dimuat, situs lo tetap kebaca normal — cuma nggak beranimasi. Degradasi yang anggun.

Semua teori di atas bisa lo rasakan langsung: scroll aja [beranda blog ini](/) pelan-pelan.
