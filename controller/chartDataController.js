const chartDataModel = require("../model/chartDataModel")

exports.getChartData = (req, res) => {
  res
    .status(200)
    .json(
      "GET request for CHART DATA received. Controller not yet implemented..."
    )
}
exports.createChartData = async (req, res) => {
  try {
    const newDataset = await chartDataModel.create(req.body)
    res.status(201).json({
      status: "success",
      data: newDataset
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.errmsg
    })
  }
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
