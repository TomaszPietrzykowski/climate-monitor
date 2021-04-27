const express = require("express");

const publicApiController = require("../controller/publicApiController");

const router = express.Router();

router.route("/:id/for/:date").get(publicApiController.getPublicDataForDate);
router.route("/:id/latest").get(publicApiController.getLatestReading);
router.route("/:id/:dataset").get(publicApiController.getPublicDataset);

module.exports = router;
