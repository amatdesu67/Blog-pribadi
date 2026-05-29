// routes/blog.js
// Route blog/artikel: daftar artikel, filter per tag, dan detail artikel.

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
router.get("/", (req, res) => {
  res.render("blog", {
    title: "Blog",
    active: "blog",
    articles: getAllArticles(),
    tags: getAllTags(),
    activeTag: null,
  });
});

// Artikel yang difilter berdasarkan tag.
router.get("/tag/:tag", (req, res) => {
  const tag = req.params.tag;
  res.render("blog", {
    title: `#${tag}`,
    active: "blog",
    articles: getArticlesByTag(tag),
    tags: getAllTags(),
    activeTag: tag,
  });
});

// Detail satu artikel. Body (Markdown) diubah jadi HTML dulu.
router.get("/:slug", (req, res, next) => {
  const article = getArticleBySlug(req.params.slug);
  if (!article) return next(); // tidak ketemu -> lanjut ke handler 404

  res.render("article", {
    title: article.title,
    active: "blog",
    article,
    contentHtml: renderMarkdown(article.body),
  });
});

module.exports = router;
