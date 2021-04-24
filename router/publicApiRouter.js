const express = require("express");

const publicApiController = require("../controller/publicApiController");
const dbController = require("../controller/dbController");

const router = express.Router();

router
  .route("/co2/daily")
  .post(dbController.createPublicDataset)
  .get(dbController.getPublicDataset);

// router.route("/summary").get(publicApiController.getClimateSummary)

// router.route("/co2/latest").get(publicApiController.getLatestCo2)

// router.route("/co2/monthly").get(publicApiController.getMonthlyCo2)

// router.route("/co2/annual").get(publicApiController.getAnnualCo2)

module.exports = router;
