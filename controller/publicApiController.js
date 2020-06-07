const chartDataModel = require("../model/chartDataModel")

const catchError = require("../utilities/catchError")
const logger = require("../Logger")

const parseObjectData = (dataset) => {
  const responseArray = []
  dataset.labels.forEach((v, i) => {
    const obj = { label: v, value: dataset.values[i] }
    responseArray.push(obj)
  })
  return responseArray
}

const getLastValue = (obj) => {
  const res = {
    label: obj.labels[obj.labels.length - 1],
    value: obj.values[obj.values.length - 1],
  }
  return res
}

exports.getLatestCo2 = catchError(async (req, res) => {
  const dataset = await chartDataModel.findOne({
    datasetID: "latest_co2",
  })
  const data = parseObjectData(dataset)
  res.status(200).json({
    status: "success",
    lastUpdate: dataset.lastUpdate,
    description:
      "Latest available reading for earth atmospheric CO2 (ppm) and corresponding readings for 1, 5 and 10 years ago. Data parsed by *climatemonitor.info*, data source: NOAA @ aftp.cmdl.noaa.gov",
    data: data,
  })
})

exports.getMonthlyCo2 = catchError(async (req, res) => {
  const dataset = await chartDataModel.findOne({
    datasetID: "monthly_co2_ml",
  })
  const data = parseObjectData(dataset)
  res.status(200).json({
    status: "success",
    lastUpdate: dataset.lastUpdate,
    description:
      "Monthly average earth atmospheric CO2 values (ppm). Measurements taken at Mauna Loa Observatory, Hawaii. Data parsed by *climatemonitor.info*, data source: NOAA @ aftp.cmdl.noaa.gov",
    data: data,
  })
})

exports.getAnnualCo2 = catchError(async (req, res) => {
  const dataset = await chartDataModel.findOne({
    datasetID: "annual_co2_ml",
  })
  const data = parseObjectData(dataset)
  res.status(200).json({
    status: "success",
    lastUpdate: dataset.lastUpdate,
    description:
      "Annual average earth atmospheric CO2 values (ppm). Measurements taken at Mauna Loa Observatory, Hawaii. Data parsed by *climatemonitor.info*, data source: NOAA @ aftp.cmdl.noaa.gov",
    data: data,
  })
})

exports.getClimateSummary = catchError(async (req, res) => {
  const co2 = await chartDataModel.findOne({
    datasetID: "latest_co2",
  })
  const ch4 = await chartDataModel.findOne({
    datasetID: "monthly_ch4_gl",
  })
  const n2o = await chartDataModel.findOne({
    datasetID: "monthly_n2o_gl",
  })
  const sf6 = await chartDataModel.findOne({
    datasetID: "monthly_sf6_gl",
  })
  const temp = await chartDataModel.findOne({
    datasetID: "monthly_land_temp_anomaly_avg",
  })
  const latest_CO2 = getLastValue(co2)
  const latest_CH4 = getLastValue(ch4)
  const latest_N2O = getLastValue(n2o)
  const latest_SF6 = getLastValue(sf6)
  const latest_temp = getLastValue(temp)
  res.status(200).json({
    status: "success",
    lastUpdate: co2.lastUpdate,
    description:
      "Latest available data summary on main climate change factors: levels of main greenhouse gases (co2, ch4, n2o, sf6), global temperature, sea levels and ice mass anomalies. Data parsed by *climatemonitor.info*, data sources: NOAA @ aftp.cmdl.noaa.gov, NASA @ ... , berkeley...",
    data: {
      co2: {
        description: "Earth atmospheric Carbon Dioxide (CO2)",
        ...latest_CO2,
        unit: "ppm",
      },
      ch4: {
        description: "Earth atmospheric Methane (CH4)",
        ...latest_CH4,
        unit: "ppb",
      },
      n2o: {
        description: "Earth atmospheric Nitrous Oxide (N2O)",
        ...latest_N2O,
        unit: "ppb",
      },
      sf6: {
        description: "Earth atmospheric Sulfur Hexafluoride (SF6)",
        ...latest_SF6,
        unit: "ppt",
      },
      temp: {
        description:
          "Land-surface average temperature anomaly relative to the 1951-1980 average (8.64°C)",
        ...latest_temp,
        unit: "°C",
      },
    },
  })
})
