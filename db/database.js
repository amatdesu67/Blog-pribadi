// db/database.js
// Lapisan database pakai SQLite BAWAAN Node.js (node:sqlite).
// Keuntungan: tanpa native deps / tanpa compile — jalan langsung di Node 22.5+.
// Semua fungsi akses database dikumpulkan di sini biar rapi dan gampang dipakai.

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const { seedArticles } = require("./seed-data");

// File database disimpan di folder db/ dengan nama blog.db.
const db = new DatabaseSync(path.join(__dirname, "blog.db"));

// --- Bikin tabel kalau belum ada ---
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    excerpt     TEXT NOT NULL,
    body        TEXT NOT NULL,
    tags        TEXT NOT NULL DEFAULT '',   -- tag dipisah koma, mis. "express,sqlite"
    created_at  TEXT NOT NULL               -- tanggal ISO, mis. "2026-05-28"
  );

  CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TEXT NOT NULL
  );
`);

// --- Isi artikel awal kalau tabel masih kosong ---
const jumlahArtikel = db.prepare("SELECT COUNT(*) AS n FROM articles").get().n;
if (jumlahArtikel === 0) {
  const insert = db.prepare(
    `INSERT INTO articles (slug, title, excerpt, body, tags, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (const a of seedArticles) {
    insert.run(a.slug, a.title, a.excerpt, a.body, a.tags.join(","), a.date);
  }
}

// Ubah kolom tags (string "a,b") jadi array ["a","b"] biar gampang dipakai di view.
function withTagArray(row) {
  return {
    ...row,
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };
}

// =================== ARTIKEL ===================

// Ambil semua artikel, terbaru di atas.
function getAllArticles() {
  return db
    .prepare("SELECT * FROM articles ORDER BY created_at DESC, id DESC")
    .all()
    .map(withTagArray);
}

// Ambil satu artikel berdasarkan slug-nya.
function getArticleBySlug(slug) {
  const row = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug);
  return row ? withTagArray(row) : null;
}

// Ambil artikel yang punya tag tertentu.
function getArticlesByTag(tag) {
  const target = tag.toLowerCase();
  return getAllArticles().filter((a) =>
    a.tags.some((t) => t.toLowerCase() === target)
  );
}

// Kumpulkan semua tag beserta jumlah artikelnya.
function getAllTags() {
  const counts = new Map();
  for (const a of getAllArticles()) {
    for (const t of a.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// =================== PESAN KONTAK ===================

// Simpan pesan dari form kontak.
function addMessage({ name, email, message }) {
  db.prepare(
    "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)"
  ).run(name, email, message, new Date().toISOString());
}

module.exports = {
  getAllArticles,
  getArticleBySlug,
  getArticlesByTag,
  getAllTags,
  addMessage,
};
