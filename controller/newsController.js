const newsModel = require("../model/newsModel");
const axios = require("axios");
const catchError = require("../utilities/catchError");
const logger = require("../Logger");

exports.getNews = catchError(async (req, res) => {
  const news = await newsModel.findById("607c0f011bd74a1fe04395b2");
  if (news) {
    res.status(200).json(news);
  }
});

exports.updateNewsfeed = catchError(async () => {
  const news = await axios.get(
    `https://newsapi.org/v2/everything?q=climate+change&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
  );
  const articles = data.articles;
  //   console.log(articles);
  if (articles.length > 1) {
    const updated = [];
    articles.forEach((article) => {
      if (
        article.source.name &&
        article.title &&
        article.description &&
        article.author &&
        article.content &&
        article.url &&
        article.urlToImage
      ) {
        updated.push({
          source: article.source.name,
          title: article.title,
          description: article.description,
          author: article.author,
          content: article.content,
          url: article.url,
          image: article.urlToImage,
          publishedAt: article.publishedAt.substring(0, 10),
        });
      }
    });
    let output = await newsModel.findById("607c0f011bd74a1fe04395b2");
    output.articles = updated;
    await output.save();
  }
});
