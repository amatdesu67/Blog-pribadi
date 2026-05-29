// Membuat / memperbarui user admin.
// Pakai: node scripts/seed-admin.js <username> <password>
// Pastikan .env berisi TURSO_DATABASE_URL & TURSO_AUTH_TOKEN agar
// admin dibuat di database Turso (yang dipakai Vercel).
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const username = process.argv[2] || process.env.ADMIN_USERNAME;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error('Pakai: node scripts/seed-admin.js <username> <password>');
  process.exit(1);
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:data/blog.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

(async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  const hash = bcrypt.hashSync(password, 10);
  await db.execute({
    sql: 'INSERT INTO admins (username, password) VALUES (?, ?) ' +
         'ON CONFLICT(username) DO UPDATE SET password = excluded.password',
    args: [username, hash]
  });
  const target = process.env.TURSO_DATABASE_URL ? 'Turso' : 'lokal (file:data/blog.db)';
  console.log(`Admin '${username}' berhasil dibuat/diperbarui di database ${target}.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
