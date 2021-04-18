const mongoose = require("mongoose");

const infoSchema = mongoose.Schema({
  source: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
});

const newsSchema = new mongoose.Schema(
  {
    articles: [infoSchema],
  },
  { timestamps: true }
);

const newsModel = mongoose.model("News", newsSchema);

module.exports = newsModel;
