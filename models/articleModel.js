const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  MarkDown: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, unique: true, required: true },
});

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Article = mongoose.model("article", articleSchema);

module.exports = Article;
