const chartDataModel = require("../model/chartDataModel")

exports.getAllChartData = async (req, res) => {
  try {
    const data = await chartDataModel.find()
    res.status(200).json({
      status: "success",
      data: data,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg,
    })
  }
}
exports.getChartData = async (req, res) => {
  try {
    const dataset = await chartDataModel.findOne({
      datasetID: req.params.dataset,
    })
    res.status(200).json({
      status: "success",
      data: dataset,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg,
    })
  }
}
exports.createChartData = async (req, res) => {
  try {
    const newDataset = await chartDataModel.create(req.body)
    res.status(201).json({
      status: "success",
      data: newDataset,
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.errmsg,
    })
  }
}
exports.replaceChartData = async (req, res) => {
  try {
    const updated = await chartDataModel.findOneAndReplace(
      {
        datasetID: req.params.dataset,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      status: "success",
      data: updated,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg,
    })
  }
}
exports.updateChartData = async (req, res) => {
  try {
    const updated = await chartDataModel.findOneAndUpdate(
      {
        datasetID: req.params.dataset,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      status: "success",
      data: updated,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg,
    })
  }
}
exports.deleteChartData = async (req, res) => {
  try {
    await chartDataModel.findOneAndDelete({
      datasetID: req.params.dataset,
    })
    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.errmsg,
    })
  }
}
exports.updateDataset = async (id, data) => {
  try {
    await chartDataModel.findOneAndUpdate(
      {
        datasetID: id,
      },
      { ...data, lastUpdate: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    )
    console.log(`Dataset id: ${id} updated...`)
  } catch (err) {
    console.log(err)
  }
}
