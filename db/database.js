// db/database.js
// Lapisan database pakai libSQL (@libsql/client).
// SEKARANG hanya dipakai untuk menyimpan PESAN KONTAK. Artikel blog sudah
// pindah ke file Markdown di content/blog/ (tidak lagi pakai database).
//   - Lokal      : otomatis pakai file SQLite "db/blog.db".
//   - Produksi   : pakai Turso lewat TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.

// Pilih koneksi berdasarkan environment.
//   - Produksi (Turso)  : pakai client versi "web" (pure-JS, lewat HTTP) supaya
//                         tidak butuh native binding -> aman di serverless Vercel.
//   - Lokal (file:)     : pakai client default yang mendukung file SQLite.
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const { createClient } = TURSO_URL
  ? require("@libsql/client/web")
  : require("@libsql/client");

const db = TURSO_URL
  ? createClient({ url: TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  : createClient({ url: "file:db/blog.db" }); // relatif terhadap folder proyek

// Bikin tabel pesan kontak. Idempoten: aman dipanggil berkali-kali.
async function initDb() {
  await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TEXT NOT NULL
  )`);
}

// =================== PESAN KONTAK ===================

async function addMessage({ name, email, message }) {
  await db.execute({
    sql: "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)",
    args: [name, email, message, new Date().toISOString()],
  });
}

module.exports = { initDb, addMessage };
