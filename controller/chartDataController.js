const chartDataModel = require("../model/chartDataModel")

exports.getChartData = (req, res) => {
  console.log(req.params)
  res
    .status(200)
    .json(
      "GET request for CHART DATA received. Controller not yet implemented..."
    )
}
exports.createChartData = (req, res) => {
  res
    .status(200)
    .json(
      "POST request for CHART DATA received. Controller not yet implemented..."
    )
}
exports.updateChartData = (req, res) => {
  res
    .status(200)
    .json(
      "PUT request for CHART DATA received. Controller not yet implemented..."
    )
}
exports.deleteChartData = (req, res) => {
  res
    .status(200)
    .json(
      "DELETE request for CHART DATA received. Controller not yet implemented..."
    )
}
