// routes/main.js
// Route halaman utama: Beranda, Tentang, dan Kontak (tampil + proses form).
// Handler-nya async karena akses database (libSQL) bersifat asynchronous.

const express = require("express");
const router = express.Router();

const { projects } = require("../data/projects");
const { ebook } = require("../content/ebook");
const { getAllArticles, addMessage } = require("../db/database");

// Beranda: proyek unggulan + 3 artikel terbaru + sorotan ebook.
router.get("/", async (req, res, next) => {
  try {
    const articles = await getAllArticles();
    res.render("home", {
      title: "Beranda",
      active: "home",
      projects: projects.filter((p) => p.featured),
      articles: articles.slice(0, 3),
      ebook,
    });
  } catch (err) {
    next(err);
  }
});

// Halaman Tentang.
router.get("/about", (req, res) => {
  res.render("about", { title: "Tentang", active: "about" });
});

// Halaman Kontak: tampilkan form kosong.
router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Kontak",
    active: "contact",
    sent: false,
    errors: [],
    values: {},
  });
});

// Proses form Kontak: validasi sederhana, lalu simpan ke database.
router.post("/contact", async (req, res, next) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();

  const errors = [];
  if (!name) errors.push("Nama wajib diisi.");
  if (!email.includes("@")) errors.push("Email tidak valid.");
  if (message.length < 5) errors.push("Pesan terlalu pendek (minimal 5 karakter).");

  if (errors.length > 0) {
    return res.status(400).render("contact", {
      title: "Kontak",
      active: "contact",
      sent: false,
      errors,
      values: { name, email, message },
    });
  }

  try {
    await addMessage({ name, email, message });
    res.render("contact", {
      title: "Kontak",
      active: "contact",
      sent: true,
      errors: [],
      values: {},
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
