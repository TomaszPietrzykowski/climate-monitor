const express = require("express");
const newsController = require("../controller/newsController.js");

const router = express.Router();

router.route("/").get(newsController.getNews);

module.exports = router;
