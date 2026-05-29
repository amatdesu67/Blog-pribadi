// server.js
// Titik masuk aplikasi. Mengatur Express, view engine, middleware, dan routing.

const express = require("express");
const path = require("path");

// Kumpulan route (dipisah per bagian biar rapi).
const mainRoutes = require("./routes/main");
const blogRoutes = require("./routes/blog");
const projectRoutes = require("./routes/projects");
const ebookRoutes = require("./routes/ebook");

// Data tautan kontak & media sosial (dipakai di footer & halaman Kontak).
const { social } = require("./data/social");

const app = express();
const PORT = process.env.PORT || 3000;

// --- View engine: EJS ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middleware ---
app.use(express.static(path.join(__dirname, "public"))); // melayani file statis (css, js)
app.use(express.urlencoded({ extended: false })); // membaca data form (req.body)

// Sediakan beberapa helper ke semua view.
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear(); // tahun sekarang (footer)
  // Format tanggal ke gaya Indonesia, mis. "28 Mei 2026".
  res.locals.formatTanggal = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  res.locals.social = social; // tautan kontak & medsos
  next();
});

// --- Routing ---
app.use("/", mainRoutes); // Beranda, Tentang, Kontak
app.use("/blog", blogRoutes); // Blog/Artikel
app.use("/projects", projectRoutes); // Portofolio
app.use("/ebook", ebookRoutes); // Baca ebook online

// --- 404: dijalankan kalau tidak ada route yang cocok ---
app.use((req, res) => {
  res.status(404).render("404", { title: "404", active: "" });
});

app.listen(PORT, () => {
  console.log(`Blog jalan di http://localhost:${PORT}`);
});
