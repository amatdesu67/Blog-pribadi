// routes/projects.js
// Route portofolio: daftar proyek dan halaman detail tiap proyek.

const express = require("express");
const router = express.Router();

const { projects, getProjectBySlug } = require("../data/projects");
const { renderMarkdown } = require("../lib/markdown");

// Daftar semua proyek.
router.get("/", (req, res) => {
  res.render("projects", { title: "Projects", active: "projects", projects });
});

// Detail satu proyek.
router.get("/:slug", (req, res, next) => {
  const project = getProjectBySlug(req.params.slug);
  if (!project) return next(); // tidak ketemu -> 404

  res.render("project", {
    title: project.title,
    active: "projects",
    project,
    descriptionHtml: renderMarkdown(project.description),
  });
});

module.exports = router;
