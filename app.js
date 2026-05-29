// app.js
// Membuat & meng-export aplikasi Express (TANPA app.listen).
// Dipakai oleh server.js (untuk jalan lokal) dan api/index.js (untuk Vercel).

const express = require("express");
const path = require("path");

const mainRoutes = require("./routes/main");
const blogRoutes = require("./routes/blog");
const projectRoutes = require("./routes/projects");
const ebookRoutes = require("./routes/ebook");
const { social } = require("./data/social");
const { initDb } = require("./db/database");

const app = express();

// --- View engine: EJS ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middleware ---
app.use(express.static(path.join(__dirname, "public"))); // file statis (css, js)
app.use(express.urlencoded({ extended: false })); // membaca data form (req.body)

// Siapkan database sekali saat aplikasi dimuat (bikin tabel + seed).
// Setiap request menunggu proses ini selesai dulu lewat middleware di bawah.
let dbError = null;
const dbReady = initDb().catch((err) => {
  dbError = err;
  console.error("Gagal menyiapkan database:", err);
});
app.use(async (req, res, next) => {
  await dbReady;
  if (dbError) return next(dbError);
  next();
});

// Helper yang tersedia di semua view.
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  res.locals.formatTanggal = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  res.locals.social = social;
  next();
});

// --- Routing ---
app.use("/", mainRoutes);
app.use("/blog", blogRoutes);
app.use("/projects", projectRoutes);
app.use("/ebook", ebookRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).render("404", { title: "404", active: "" });
});

// --- Penanganan error ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Terjadi kesalahan di server.");
});

module.exports = app;
