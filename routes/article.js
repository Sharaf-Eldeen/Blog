const express = require("express");
const { marked } = require("marked");
const Article = require("../models/articleModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("in articles");
});

router.post("/", async (req, res) => {
  let newArticle = new Article({
    title: req.body.title,
    description: req.body.description,
    MarkDown: req.body.markdown,
  });
  try {
    let savedArticle = await newArticle.save();
    let articleSlug = savedArticle.slug;
    res.redirect(`/articles/${articleSlug}`);
  } catch (err) {
    console.error(err);
    res.render("articles/new", { article: newArticle });
  }
});
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:slug", async (req, res) => {
  let requiredArticle = await Article.findOne({ slug: req.params.slug });
  res.render("articles/edit", { article: requiredArticle });
});
router.put("/edit/:slug", async (req, res) => {
  try {
    let updatedArticle = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    console.log(updatedArticle);
    if (!updatedArticle) {
      return res.status(404).send("Article not found.");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error updating article:", err.message);
  }
});

router.get("/:slug", async (req, res) => {
  try {
    let foundedArticle = await Article.findOne({ slug: req.params.slug });
    if (!foundedArticle) {
      return res.status(404).send("No article with given slug");
    }
    let htmlContent = marked(foundedArticle.MarkDown);
    foundedArticle.MarkDown = htmlContent;
    console.log(foundedArticle);

    res.render("articles/show", { article: foundedArticle });
  } catch (err) {
    console.error("Error reading article:", err.message);
    res.redirect("/");
  }
});

router.put("/edit/:slug", async (req, res) => {
  try {
    let updatedArticle = Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArticle) {
      return res.status(404).send("Article not found.");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error updating article:", err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
