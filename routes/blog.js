// routes/blog.js
// Route blog/artikel: daftar artikel, filter per tag, dan detail artikel.
// Handler-nya async karena akses database (libSQL) bersifat asynchronous.

const express = require("express");
const router = express.Router();

const {
  getAllArticles,
  getArticleBySlug,
  getArticlesByTag,
  getAllTags,
} = require("../db/database");
const { renderMarkdown } = require("../lib/markdown");

// Daftar semua artikel + daftar tag.
router.get("/", async (req, res, next) => {
  try {
    const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
    res.render("blog", { title: "Blog", active: "blog", articles, tags, activeTag: null });
  } catch (err) {
    next(err);
  }
});

// Artikel yang difilter berdasarkan tag.
router.get("/tag/:tag", async (req, res, next) => {
  try {
    const tag = req.params.tag;
    const [articles, tags] = await Promise.all([getArticlesByTag(tag), getAllTags()]);
    res.render("blog", { title: `#${tag}`, active: "blog", articles, tags, activeTag: tag });
  } catch (err) {
    next(err);
  }
});

// Detail satu artikel. Body (Markdown) diubah jadi HTML dulu.
router.get("/:slug", async (req, res, next) => {
  try {
    const article = await getArticleBySlug(req.params.slug);
    if (!article) return next(); // tidak ketemu -> handler 404
    res.render("article", {
      title: article.title,
      active: "blog",
      article,
      contentHtml: renderMarkdown(article.body),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
