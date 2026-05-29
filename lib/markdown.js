// lib/markdown.js
// Pembungkus kecil untuk library "marked": ubah teks Markdown jadi HTML.
// Dipusatkan di sini supaya konfigurasinya satu tempat.

const { marked } = require("marked");

marked.setOptions({
  gfm: true,      // dukung GitHub Flavored Markdown (tabel, dll)
  breaks: false,  // baris tunggal TIDAK otomatis jadi <br>
});

// Ubah string Markdown menjadi HTML.
function renderMarkdown(text) {
  return marked.parse(text || "");
}

module.exports = { renderMarkdown };
