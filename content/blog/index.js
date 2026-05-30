// content/blog/index.js
// Memuat artikel blog dari file Markdown di folder ini.
// Tiap file .md = satu artikel. Bagian atas file (di antara "---") berisi
// metadata (frontmatter): title, excerpt, tags, date. Sisanya = isi (Markdown).
//
// Cara nambah artikel: bikin file baru "judul-artikel.md" di folder ini,
// isi frontmatter + tulisan, simpan, lalu git push. Selesai — tanpa database.

const fs = require("fs");
const path = require("path");

// Parser frontmatter sederhana (tanpa library tambahan).
// Mengembalikan { data, body }.
function parseFrontmatter(raw) {
  const text = raw.replace(/^﻿/, ""); // buang BOM kalau ada
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return { data: {}, body: text.trim() };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Lepas tanda kutip pembungkus kalau ada.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: match[2].trim() };
}

// Ubah satu file .md jadi objek artikel yang rapi.
function fileToArticle(filename) {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(__dirname, filename), "utf8");
  const { data, body } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    body,
    created_at: data.date || "",
    tags: data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  };
}

// Muat semua artikel sekali, lalu simpan di cache (file tidak berubah saat
// server jalan). Diurutkan dari terbaru ke terlama.
let cache = null;
function loadAll() {
  if (cache) return cache;
  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith(".md"));
  cache = files
    .map(fileToArticle)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return cache;
}

// ---- API (bentuknya sama seperti versi database dulu) ----

function getAllArticles() {
  return loadAll();
}

function getArticleBySlug(slug) {
  return loadAll().find((a) => a.slug === slug) || null;
}

function getArticlesByTag(tag) {
  const target = tag.toLowerCase();
  return loadAll().filter((a) =>
    a.tags.some((t) => t.toLowerCase() === target)
  );
}

function getAllTags() {
  const counts = new Map();
  for (const a of loadAll()) {
    for (const t of a.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

module.exports = {
  getAllArticles,
  getArticleBySlug,
  getArticlesByTag,
  getAllTags,
};
