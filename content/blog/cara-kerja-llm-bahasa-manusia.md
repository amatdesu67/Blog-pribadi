---
title: Cara Kerja LLM, Dijelasin Pakai Bahasa Manusia
excerpt: "ChatGPT dan Gemini itu bukan 'mesin yang tahu segalanya' — mereka mesin penebak kata berikutnya yang sangat-sangat jago. Penjelasan tanpa matematika."
tags: ai, llm, belajar
date: 2026-06-02
---
Tiap kali gw bilang lagi bikin aplikasi pakai AI, pertanyaannya sama: *"emang AI itu mikir gimana sih?"* Ini penjelasan yang biasanya gw kasih — tanpa matematika, tanpa istilah yang bikin tidur.

## Satu kalimat dulu

> LLM (Large Language Model) itu mesin yang super jago menebak **kata berikutnya**.

Serius, intinya cuma itu. Lo kasih teks "Nasi goreng paling enak dimakan pakai...", model menghitung kata apa yang paling mungkin nyusul. Lalu kata hasil tebakannya ditempel, dan dia nebak lagi. Begitu terus sampai jadi paragraf. Jawaban panjang yang lo terima dari ChatGPT = ribuan tebakan beruntun.

## Kok hasil "nebak" bisa sepintar itu?

Karena buat bisa nebak kata berikutnya dengan akurat di *semua topik*, model terpaksa "menyerap" pola dari hampir seluruh teks di internet — buku, artikel, kode, percakapan. Mau nebak lanjutan kalimat tentang hukum Newton? Lo harus "paham" fisika dasar. Nebak lanjutan kode JavaScript? Harus nangkep pola sintaks. Kemampuan yang kelihatan seperti "kecerdasan" itu efek samping dari satu tugas sederhana yang dilatih dalam skala raksasa.

## Kenapa AI bisa ngarang (halusinasi)?

Karena dia **nggak punya konsep benar/salah — cuma konsep "mungkin/nggak mungkin"**. Kalimat "Soekarno lahir di Surabaya tahun 1901" dan kalimat ngawur yang *terdengar* meyakinkan punya pola bahasa yang sama-sama mulus. Model milih yang paling mulus, bukan yang paling benar. Makanya:

- Jangan pakai LLM sebagai sumber fakta tanpa verifikasi.
- Aplikasi AI yang serius selalu "menjangkar" jawabannya ke sumber asli — itu alasan [Nalar](/projects/nalar) selalu nempelin paper aslinya, bukan cuma percaya rangkuman AI.

## Terus "prompt" itu apa?

Prompt = teks awal yang lo kasih buat "mengarahkan tebakan". Karena model cuma melanjutkan teks, cara lo membuka percakapan menentukan arah lanjutannya. Prompt yang jelas → lanjutan yang jelas. Ini juga kenapa "prompt engineering" itu skill beneran: lo lagi mendesain konteks supaya tebakan model jatuh ke tempat yang lo mau.

## Buat yang mau mulai

Lo nggak perlu paham neural network buat *memakai* LLM di aplikasi. Modal lo: satu API key (Gemini punya free tier), satu HTTP request, dan kemauan eksperimen. Mulai dari yang kecil — summarizer, penerjemah, kategorisasi — sambil pelan-pelan ngerti batasannya. Batasan itu justru bagian paling penting yang harus dipahami builder.
