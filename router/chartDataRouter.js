const express = require("express")

const chartDataController = require("../controller/chartDataController")

const router = express.Router()

router
  .route("/")
  .get(chartDataController.getChartData)
  .post(chartDataController.createChartData)
  .put(chartDataController.updateChartData)
  .delete(chartDataController.deleteChartData)

module.exports = router
