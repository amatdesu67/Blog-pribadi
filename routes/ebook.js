// routes/ebook.js
// Route untuk membaca ebook online: halaman daftar isi + halaman per bab.

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const { ebook, chapters, getChapter } = require("../content/ebook");
const { renderMarkdown } = require("../lib/markdown");

// Folder tempat file markdown tiap bab berada.
const EBOOK_DIR = path.join(__dirname, "..", "content", "ebook");

// Halaman depan ebook: judul + daftar isi.
router.get("/", (req, res) => {
  res.render("ebook", {
    title: ebook.title,
    active: "projects",
    ebook,
    chapters,
  });
});

// Baca satu bab. Isi bab dibaca dari file .md lalu diubah jadi HTML.
router.get("/:slug", (req, res, next) => {
  const found = getChapter(req.params.slug);
  if (!found) return next(); // bab tidak ada -> 404

  let markdown = "";
  try {
    markdown = fs.readFileSync(path.join(EBOOK_DIR, found.chapter.file), "utf8");
  } catch {
    return next();
  }

  res.render("ebook-chapter", {
    title: found.chapter.title,
    active: "projects",
    ebook,
    chapters,
    chapter: found.chapter,
    prev: found.prev,
    next: found.next,
    contentHtml: renderMarkdown(markdown),
  });
});

module.exports = router;
