const express = require("express")

const co2Controller = require("../controller/co2Controller")

const router = express.Router()

router
  .route("/")
  .get(co2Controller.getLatestCo2)
  .put(co2Controller.updateLatestCo2)

router
  .route("/daily")
  .get(co2Controller.getDailyCo2)
  .put(co2Controller.updateDailyCo2)

module.exports = router
