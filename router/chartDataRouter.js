const express = require("express")

const chartDataController = require("../controller/chartDataController")

const router = express.Router()

router
  .route("/")
  .post(chartDataController.createChartData)
  .get(chartDataController.getAllChartData)

router
  .route("/:dataset")
  .get(chartDataController.getChartData)
  .put(chartDataController.replaceChartData)
  .patch(chartDataController.updateChartData)
  .delete(chartDataController.deleteChartData)

module.exports = router
