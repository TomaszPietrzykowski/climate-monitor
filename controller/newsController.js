const newsModel = require("../model/newsModel");
const axios = require("axios");
const catchError = require("../utilities/catchError");
const logger = require("../Logger");

// @description: Fetch news
// @route: GET /api/news
// @access: Public
exports.getNews = catchError(async (req, res) => {
  const news = await newsModel.findById("607c0f011bd74a1fe04395b2");
  if (news) {
    res.status(200).json(news);
  }
});

// @description: Fetch news from NewsAPI and update db
// @route: none
// @access: Application
exports.updateNewsfeed = catchError(async () => {
  const news = await axios.get(
    `https://newsapi.org/v2/everything?q=climate+change+co2&language=en&sortBy=relevance&apiKey=${process.env.NEWS_API_KEY}`
  );
  const articles = news.data.articles;
  if (articles && articles.length > 1) {
    const updated = [];
    articles.forEach((article) => {
      if (
        article.title &&
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
    logger.log("news updated");
  } else {
    logger.log(
      `FAILED TO UPDATE NEWS: articles array length: ${articles.length}`
    );
  }
});
