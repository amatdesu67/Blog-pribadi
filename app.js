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
const { getAllArticles } = require("./content/blog");

const app = express();

// --- View engine: EJS ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middleware ---
// Header keamanan dasar (tanpa dependency tambahan).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.static(path.join(__dirname, "public"))); // file statis (css, js)
app.use(express.urlencoded({ extended: false })); // membaca data form (req.body)
app.use(express.json()); // membaca data JSON

const fs = require("fs");

app.post("/client-log", (req, res) => {
  try {
    const logData = {
      timestamp: new Date().toISOString(),
      ...req.body
    };
    fs.appendFileSync(
      path.join(__dirname, "client_errors.log"),
      JSON.stringify(logData, null, 2) + "\n\n"
    );
  } catch (err) {
    console.error("Error writing to client_errors.log:", err);
  }
  res.sendStatus(200);
});

// Siapkan database sekali saat aplikasi dimuat (bikin tabel + seed).
// CATATAN: kalau init GAGAL (mis. kredensial Turso salah), situs TIDAK mati
// total — halaman non-database (Beranda statis, About, Projects, Ebook, 404)
// tetap tampil. Route yang butuh database punya try/catch sendiri, jadi error
// hanya muncul di route itu saja.
const dbReady = initDb().catch((err) => {
  console.error("Gagal menyiapkan database:", err);
});
app.use(async (req, res, next) => {
  await dbReady; // pastikan tabel sudah dibuat sebelum route DB jalan
  next();
});

// Helper yang tersedia di semua view.
app.use((req, res, next) => {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  res.locals.siteUrl = `${proto}://${host}`;
  res.locals.canonical = `${proto}://${host}${req.originalUrl.split("?")[0]}`;
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

// --- robots.txt & sitemap.xml (SEO) ---
app.get("/robots.txt", (req, res) => {
  res
    .type("text/plain")
    .send(`User-agent: *\nAllow: /\nSitemap: ${res.locals.siteUrl}/sitemap.xml\n`);
});

app.get("/sitemap.xml", async (req, res, next) => {
  try {
    const base = res.locals.siteUrl;
    const staticPaths = ["/", "/about", "/projects", "/blog", "/contact", "/ebook", "/jasa", "/now", "/changelog"];
    let slugs = [];
    try {
      const articles = await getAllArticles();
      slugs = articles.map((a) => `/blog/${a.slug}`);
    } catch (_) {
      // DB down -> kirim sitemap halaman statis saja, jangan gagal total.
    }
    const urls = [...staticPaths, ...slugs].map(
      (p) => `  <url><loc>${base}${p}</loc></url>`
    );
    res
      .type("application/xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.join("\n") +
          `\n</urlset>\n`
      );
  } catch (err) {
    next(err);
  }
});

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
