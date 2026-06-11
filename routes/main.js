// routes/main.js
// Route halaman utama: Beranda, Tentang, Jasa, Now, Changelog, Kontak.

const express = require("express");
const router = express.Router();

const { projects } = require("../data/projects");
const { ebook, chapters } = require("../content/ebook");
const { getAllArticles } = require("../content/blog");
const { now } = require("../data/now");
const { changelog } = require("../data/changelog");
const { addMessage } = require("../db/database");

// Beranda: proyek unggulan + statistik + 3 artikel terbaru + ebook.
router.get("/", async (req, res, next) => {
  try {
    const articles = await getAllArticles();
    res.render("home", {
      title: "Beranda",
      active: "home",
      projects: projects.filter((p) => p.featured),
      articles: articles.slice(0, 3),
      ebook,
      stats: {
        projects: projects.length,
        articles: articles.length,
        chapters: chapters.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Halaman Tentang.
router.get("/about", (req, res) => {
  res.render("about", { title: "Tentang", active: "about" });
});

// Halaman Now: apa yang lagi dikerjain sekarang.
router.get("/now", (req, res) => {
  res.render("now", { title: "Now", active: "now", now });
});

// Halaman Changelog: riwayat perubahan website.
router.get("/changelog", (req, res) => {
  res.render("changelog", { title: "Changelog", active: "", changelog });
});

// Halaman Jasa (hire me).
router.get("/jasa", (req, res) => {
  const showcase = projects.filter((p) => !p.internal).slice(0, 3);
  res.render("jasa", { title: "Jasa", active: "jasa", showcase });
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

// Proses form Kontak.
router.post("/contact", async (req, res, next) => {
  // Honeypot anti-bot.
  if ((req.body.website || "").trim() !== "") {
    return res.render("contact", {
      title: "Kontak", active: "contact", sent: true, errors: [], values: {},
    });
  }

  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();

  const errors = [];
  if (!name) errors.push("Nama wajib diisi.");
  if (!email.includes("@")) errors.push("Email tidak valid.");
  if (message.length < 5) errors.push("Pesan terlalu pendek (minimal 5 karakter).");

  if (errors.length > 0) {
    return res.status(400).render("contact", {
      title: "Kontak", active: "contact", sent: false, errors,
      values: { name, email, message },
    });
  }

  try {
    await addMessage({ name, email, message });
    res.render("contact", {
      title: "Kontak", active: "contact", sent: true, errors: [], values: {},
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
