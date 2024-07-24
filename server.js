const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const articleRouter = require("./routes/article.js");
const Article = require("./models/articleModel.js");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/articles", articleRouter);

mongoose
  .connect("mongodb://localhost:27017/blog", {})
  .then(() => console.log("connected to blog database...."))
  .catch((err) => console.error("fail to to connect blog database....", err));

app.get("/", async (req, res) => {
  try {
    const articlesArr = await Article.find({}).sort({ createdAt: -1 });
    res.render("articles/index.ejs", {
      articles: articlesArr,
    });
  } catch (err) {
    console.error("Error fetching articles:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, (req, res) => {
  console.log("The server listen to 5000");
});
