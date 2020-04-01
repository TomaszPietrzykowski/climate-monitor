const chartDataModel = require("../model/chartDataModel")

exports.getAllChartData = async (req, res) => {
  try {
    const data = await chartDataModel.find()
    res.status(200).json({
      status: "success",
      data: data
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg
    })
  }
}
exports.getChartData = async (req, res) => {
  try {
    const dataset = await chartDataModel.findOne({
      datasetID: req.params.dataset
    })
    res.status(200).json({
      status: "success",
      data: dataset
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg
    })
  }
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
