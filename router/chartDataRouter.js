const express = require("express")

const dbController = require("../controller/dbController")

const router = express.Router()

router
  .route("/")
  .post(dbController.createChartData)
  .get(dbController.getAllChartData)

router
  .route("/:dataset")
  .get(dbController.getChartData)
  .put(dbController.replaceChartData)
  .patch(dbController.updateChartData)
  .delete(dbController.deleteChartData)

module.exports = router
