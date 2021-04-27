const chartDataModel = require("../model/chartDataModel");
const publicDataModel = require("../model/publicDataModel");
const tools = require("../utilities/tools");

const catchError = require("../utilities/catchError");
const logger = require("../Logger");

exports.getPublicDataset = catchError(async (req, res) => {
  const id = req.params.id;
  const dataset = req.params.dataset;
  const datasetID = `${id.toLowerCase()}_${dataset.toLowerCase()}_public`;
  const data = await publicDataModel.findOne({
    datasetID: datasetID,
  });
  res.status(200).json({
    status: "success",
    data: {
      title: data.title,
      description: data.description,
      readings: data.readings,
      unit: data.unit,
      source: "www.climatemonitor.info",
      sourceUrl: "https://climatemonitor.info",
      lastUpdate: data.updatedAt,
    },
  });
});

exports.getPublicDataForDate = catchError(async (req, res) => {
  const id = req.params.id;
  const date = req.params.date;
  let dataset = null;

  if (date.length === 4) {
    dataset = "annual_ml";
  } else if (date.length === 7 && date.split("-").length === 2) {
    dataset = "monthly_ml";
  } else if (date.length === 10 && date.split("-").length === 3) {
    dataset = "daily";
  }
  // check query format
  if (dataset) {
    const datasetID = `${id.toLowerCase()}_${dataset}_public`;
    const data = await publicDataModel.findOne({
      datasetID: datasetID,
    });
    // check if date is in scope
    if (tools.validateDateQueryScope(data.readings, date)) {
      const reading = data.readings.filter(
        (r) => r.label == date.toString()
      )[0];
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
          message: `No data for query: ${date}`,
        });
      }
    } else {
      res.status(400).json({
        status: "fail",
        message: `Requested date is outside of dataset scope: ${
          data.readings[0].label
        } - ${data.readings[data.readings.length - 1].label}`,
      });
    }
  } else {
    res.status(400).json({
      status: "fail",
      message:
        "Incorrect querry format. Supported formats: YYYY, YYYY-MM, YYYY-MM-DD",
    });
  }
});

exports.getLatestReading = catchError(async (req, res) => {
  const id = req.params.id;
  let factor = id === "co2" ? "daily" : "placeholder";
  // build up conditional to target the highest density dataset for each factor /\ /\

  const datasetID = `${id.toLowerCase()}_${factor.toLowerCase()}_public`;
  const dataset = await publicDataModel.findOne({
    datasetID,
  });
  const reading = dataset.readings[dataset.readings.length - 1];
  const data = {
    label: reading.label,
    value: reading.value,
    unit: dataset.unit,
  };
  if (reading.trend) {
    data.trend = reading.trend;
  }
  res.status(200).json({
    status: "success",
    data,
  });
});
