const chartDataModel = require("../model/chartDataModel")
const publicDataModel = require("../model/publicDataModel")

const catchError = require("../utilities/catchError")
const logger = require("../Logger")
const AppError = require("../utilities/appError")

exports.getAllChartData = catchError(async (req, res) => {
  const data = await chartDataModel.find()
  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  })
  res.status(404).json({
    status: "fail",
    message: err.errmsg,
  })
})

exports.getChartData = catchError(async (req, res) => {
  const dataset = await chartDataModel.findOne({
    datasetID: req.params.dataset,
  })
  res.status(200).json({
    status: "success",
    data: dataset,
  })
})

exports.createChartData = catchError(async (req, res) => {
  const newDataset = await chartDataModel.create(req.body)
  res.status(201).json({
    status: "success",
    data: newDataset,
  })
})

exports.replaceChartData = catchError(async (req, res) => {
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
})

exports.updateChartData = catchError(async (req, res) => {
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
})

exports.deleteChartData = catchError(async (req, res) => {
  await chartDataModel.findOneAndDelete({
    datasetID: req.params.dataset,
  })
  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.updateDataset = async (id, data) => {
  try {
    const current = await chartDataModel.findOne({
      datasetID: id,
    })
    if (current) {
      if (
        current.labels[current.labels.length - 1] !==
        data.labels[data.labels.length - 1]
      ) {
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
        logger.log(`Dataset id: ${id} updated...`)
      } else {
        logger.log(`Dataset id: ${id} update skipped, data unchanged`)
      }
    } else {
      logger.log(`Dataset: ${id} not found`)
    }
  } catch (err) {
    logger.log(`Error updating public dataset: ${err}`)
  }
}

exports.getEndpoints = catchError(async (req, res) => {
  const array = await chartDataModel.distinct("datasetID")
  res.status(200).json({
    status: "success",
    results: array.length,
    data: array,
  })
})

// -------------- PUBLIC DATA CONTROLLERS -------------

exports.createPublicDataset = catchError(async (req, res) => {
  const newDataset = await publicDataModel.create(req.body)
  res.status(201).json({
    status: "success",
    data: newDataset,
  })
})
exports.forgePublicDataset = async (obj) => {
  try {
    await publicDataModel.create({
      datasetID: obj.datasetID,
      title: obj.title,
      description: obj.description,
      readings: obj.readings,
      unit: obj.unit,
    })
    logger.log(`Dataset created`)
  } catch (err) {
    logger.log(`Error forging public dataset: ${err}`)
  }
}

exports.updatePublicDataset = async (id, data) => {
  try {
    const current = await publicDataModel.findOne({
      datasetID: id,
    })
    if (current) {
      if (
        current.readings[current.readings.length - 1].label !==
        data[data.length - 1].label
      ) {
        current.readings = data
        await current.save()
        logger.log(`Dataset id: ${id} updated...`)
      } else {
        logger.log(`Dataset id: ${id} update skipped, data unchanged`)
      }
    } else {
      logger.log(`Dataset: ${id} not found`)
    }
  } catch (err) {
    logger.log(`Error updating public dataset: ${err}`)
  }
}
