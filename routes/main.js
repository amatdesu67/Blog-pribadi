// routes/main.js
// Route halaman utama: Beranda, Tentang, dan Kontak (tampil + proses form).

const express = require("express");
const router = express.Router();

const { projects } = require("../data/projects");
const { ebook } = require("../content/ebook");
const { getAllArticles, addMessage } = require("../db/database");

// Beranda: tampilkan proyek unggulan + 3 artikel terbaru + sorotan ebook.
router.get("/", (req, res) => {
  res.render("home", {
    title: "Beranda",
    active: "home",
    projects: projects.filter((p) => p.featured),
    articles: getAllArticles().slice(0, 3),
    ebook,
  });
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
router.post("/contact", (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();

  const errors = [];
  if (!name) errors.push("Nama wajib diisi.");
  if (!email.includes("@")) errors.push("Email tidak valid.");
  if (message.length < 5) errors.push("Pesan terlalu pendek (minimal 5 karakter).");

  // Kalau ada error, tampilkan lagi form-nya beserta isian sebelumnya.
  if (errors.length > 0) {
    return res.status(400).render("contact", {
      title: "Kontak",
      active: "contact",
      sent: false,
      errors,
      values: { name, email, message },
    });
  }

  addMessage({ name, email, message });
  res.render("contact", {
    title: "Kontak",
    active: "contact",
    sent: true,
    errors: [],
    values: {},
  });
});

module.exports = router;
