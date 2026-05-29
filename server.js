// server.js
// Menjalankan aplikasi secara LOKAL (development).
// Di Vercel, yang dipakai adalah api/index.js — bukan file ini.

const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Blog jalan di http://localhost:${PORT}`);
});
