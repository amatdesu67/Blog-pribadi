// db/database.js
// Lapisan database pakai libSQL (@libsql/client).
//   - Lokal      : otomatis pakai file SQLite "db/blog.db" (tanpa setup apa pun).
//   - Produksi   : pakai Turso (database online) lewat environment variable
//                  TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
// Semua fungsi di sini ASYNC (mengembalikan Promise) karena libSQL bekerja async.

const { createClient } = require("@libsql/client");
const { seedArticles } = require("./seed-data");

// Pilih koneksi berdasarkan environment.
// Kalau env Turso ada -> konek ke Turso. Kalau tidak -> file lokal.
const db = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createClient({ url: "file:db/blog.db" }); // relatif terhadap folder proyek

// Ubah satu baris hasil query jadi objek artikel yang rapi
// (tags dari string "a,b" jadi array ["a","b"]).
function rowToArticle(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    created_at: row.created_at,
    tags: row.tags
      ? String(row.tags).split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  };
}

// Bikin tabel + isi artikel awal. Idempoten: aman dipanggil berkali-kali.
async function initDb() {
  await db.execute(`CREATE TABLE IF NOT EXISTS articles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    excerpt     TEXT NOT NULL,
    body        TEXT NOT NULL,
    tags        TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TEXT NOT NULL
  )`);

  // Isi artikel awal hanya kalau tabel masih kosong.
  const count = await db.execute("SELECT COUNT(*) AS n FROM articles");
  if (Number(count.rows[0].n) === 0) {
    for (const a of seedArticles) {
      await db.execute({
        sql: `INSERT INTO articles (slug, title, excerpt, body, tags, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [a.slug, a.title, a.excerpt, a.body, a.tags.join(","), a.date],
      });
    }
  }
}

// =================== ARTIKEL ===================

async function getAllArticles() {
  const r = await db.execute(
    "SELECT * FROM articles ORDER BY created_at DESC, id DESC"
  );
  return r.rows.map(rowToArticle);
}

async function getArticleBySlug(slug) {
  const r = await db.execute({
    sql: "SELECT * FROM articles WHERE slug = ?",
    args: [slug],
  });
  return r.rows[0] ? rowToArticle(r.rows[0]) : null;
}

async function getArticlesByTag(tag) {
  const target = tag.toLowerCase();
  const all = await getAllArticles();
  return all.filter((a) => a.tags.some((t) => t.toLowerCase() === target));
}

async function getAllTags() {
  const all = await getAllArticles();
  const counts = new Map();
  for (const a of all) {
    for (const t of a.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// =================== PESAN KONTAK ===================

async function addMessage({ name, email, message }) {
  await db.execute({
    sql: "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)",
    args: [name, email, message, new Date().toISOString()],
  });
}

module.exports = {
  initDb,
  getAllArticles,
  getArticleBySlug,
  getArticlesByTag,
  getAllTags,
  addMessage,
};
