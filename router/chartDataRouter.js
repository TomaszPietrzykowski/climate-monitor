const express = require("express")

const dbController = require("../controller/dbController")
const authController = require("../controller/authController")

const router = express.Router()

router
  .route("/")
  .post(authController.protect, dbController.createChartData)
  .get(dbController.getAllChartData)

router
  .route("/:dataset")
  .get(dbController.getChartData)
  .put(authController.protect, dbController.replaceChartData)
  .patch(authController.protect, dbController.updateChartData)
  .delete(authController.protect, dbController.deleteChartData)

module.exports = router
