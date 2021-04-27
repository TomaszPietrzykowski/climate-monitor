const chartDataModel = require("../model/chartDataModel");
const publicDataModel = require("../model/publicDataModel");

const catchError = require("../utilities/catchError");
const logger = require("../Logger");

exports.getAllChartData = catchError(async (req, res) => {
  const data = await chartDataModel.find();
  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
  res.status(404).json({
    status: "fail",
    message: err.errmsg,
  });
});

exports.getChartData = catchError(async (req, res) => {
  const dataset = await chartDataModel.findOne({
    datasetID: req.params.dataset,
  });
  res.status(200).json({
    status: "success",
    data: dataset,
  });
});

exports.createChartData = catchError(async (req, res) => {
  const newDataset = await chartDataModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: newDataset,
  });
});

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
  );
  res.status(200).json({
    status: "success",
    data: updated,
  });
});

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
  );
  res.status(200).json({
    status: "success",
    data: updated,
  });
});

exports.deleteChartData = catchError(async (req, res) => {
  await chartDataModel.findOneAndDelete({
    datasetID: req.params.dataset,
  });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateDataset = catchError(async (id, data) => {
  await chartDataModel.findOneAndUpdate(
    {
      datasetID: id,
    },
    { ...data, lastUpdate: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );
  logger.log(`Dataset id: ${id} updated...`);
});

exports.getEndpoints = catchError(async (req, res) => {
  const array = await chartDataModel.distinct("datasetID");
  res.status(200).json({
    status: "success",
    results: array.length,
    data: array,
  });
});

// -------------- PUBLIC DATA CONTROLLERS -------------

exports.createPublicDataset = catchError(async (req, res) => {
  const newDataset = await publicDataModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: newDataset,
  });
});
exports.forgePublicDataset = catchError(async (obj) => {
  const newDataset = await publicDataModel.create({
    datasetID: obj.datasetID,
    title: obj.title,
    description: obj.description,
    readings: obj.readings,
  });
  logger.log(`Dataset created`);
});

exports.updatePublicDataset = catchError(async (id, data) => {
  await publicDataModel.findOneAndUpdate(
    {
      datasetID: id,
    },
    { readings: data },
    {
      new: true,
      runValidators: true,
    }
  );
  logger.log(`Dataset id: ${id} updated...`);
});

exports.getPublicDataset = catchError(async (req, res) => {
  const id = req.params.id;
  const dataset = req.params.dataset;
  const datasetID = `${id.toLowerCase()}_${dataset.toLowerCase()}_public`;
  const data = await publicDataModel.findOne({
    datasetID: datasetID,
  });
  res.status(200).json({
    status: "success",
    data: data,
  });
});

exports.getPublicDataForDate = catchError(async (req, res) => {
  const id = req.params.id;
  const date = req.params.date;
  const dataset =
    date.length === 4
      ? "annual_ml"
      : date.length === 7
      ? "monthly_ml"
      : "daily";
  const datasetID = `${id.toLowerCase()}_${dataset}_public`;
  const data = await publicDataModel.findOne({
    datasetID: datasetID,
  });
  const reading = data.readings.filter((r) => r.label == date.toString())[0];
  // UNFINISHED
  if (reading) {
    res.status(200).json({
      status: "success",
      data: {
        label: reading.label,
        value: reading.value,
        unit: data.unit,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: `No data for the date or querry outside data scope: ${
        data.readings[0].label
      } - ${data.readings[data.readings.length - 1].label}`,
    });
  }
});
