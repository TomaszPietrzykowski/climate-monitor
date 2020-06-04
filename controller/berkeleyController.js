const axios = require("axios")

const { parseTXT } = require("../utilities/tools")
const { updateDataset } = require("./dbController")

const endpoints = [
  [
    "TAVG",
    "avg",
    8.64,
    [
      2.62,
      3.23,
      5.33,
      8.34,
      11.33,
      13.47,
      14.34,
      13.87,
      12.09,
      9.25,
      6.12,
      3.66,
    ],
  ],
  [
    "TMIN",
    "min",
    2.91,
    [-2.82, -2.5, -0.62, 2.35, 5.39, 7.56, 8.5, 8.12, 6.38, 3.61, 0.63, -1.68],
  ],
  [
    "TMAX",
    "max",
    14.42,
    [
      8.17,
      9.01,
      11.28,
      14.3,
      17.23,
      19.3,
      20.14,
      19.71,
      17.98,
      15.08,
      11.73,
      9.13,
    ],
  ],
]

const getBerkeley = async (file) => {
  const response = await axios.get(
    `http://berkeleyearth.lbl.gov/auto/Global/${file}`
  )
  const string = await response.data
  const data = parseTXT(string)
  return data
}

// --------------------------------------------------------------- PARSING FUNKTIONS

const parseAnnualTempAnomaly = (inputData) => {
  const labels = []
  const values = []
  const uncertainty = []
  inputData.forEach((el) => {
    labels.push(el[0])
    values.push(parseFloat(el[1]))
    uncertainty.push(parseFloat(el[2]))
  })
  const output = { labels, values, uncertainty }
  return output
}

const parseAnnualTemp = (input, averaged) => {
  const newValues = input.values.map((v) =>
    parseFloat((v + averaged).toFixed(2))
  )
  const newUnc = input.uncertainty.map((v) => parseFloat(v.toFixed(2)))
  const output = {
    labels: input.labels,
    values: newValues,
    uncertainty: newUnc,
  }
  return output
}
const parseMonthlyTempAnomaly = (inputData) => {
  const labels = []
  const values = []
  const uncertainty = []
  inputData.forEach((el) => {
    labels.push(`${el[0]}-${el[1]}`)
    values.push(parseFloat(el[2]))
    uncertainty.push(parseFloat(el[3]))
  })
  const output = { labels, values, uncertainty }
  return output
}

const parseMonthlyTemp = (input, averaged) => {
  const newValues = input.values.map((v, i) => {
    const month = parseInt(input.labels[i].split("-")[1])
    let tempFactor = averaged[month - 1]

    return parseFloat((v + tempFactor).toFixed(2))
  })
  const newUnc = input.uncertainty.map((v) => parseFloat(v.toFixed(2)))
  const output = {
    labels: input.labels,
    values: newValues,
    uncertainty: newUnc,
  }
  return output
}

const parseDailyTempAnomaly = (inputData) => {
  const labels = []
  const values = []
  const decimal = []
  inputData.forEach((el) => {
    labels.push(`${el[1]}-${el[2]}-${el[3]}`)
    values.push(parseFloat(el[5]))
    decimal.push(parseFloat(el[0]))
  })
  const output = { labels, values, decimal }
  return output
}

// ----------------------------------------------------------------------------  UPDATE FUNCTIONS

exports.updateAnnualTempAnomalyLS = async () => {
  endpoints.forEach(async (e) => {
    const data = await getBerkeley(`Complete_${e[0]}_summary.txt`)
    const anomaly = parseAnnualTempAnomaly(data)
    const temp = parseAnnualTemp(anomaly, e[2])
    updateDataset(`annual_land_temp_anomaly_${e[1]}`, anomaly)
    updateDataset(`annual_land_temp_${e[1]}`, temp)
  })
}

exports.updateMonthlyTempAnomalyLS = async () => {
  endpoints.forEach(async (e) => {
    const data = await getBerkeley(`Complete_${e[0]}_complete.txt`)
    const anomaly = parseMonthlyTempAnomaly(data)
    const temp = parseMonthlyTemp(anomaly, e[3])
    updateDataset(`monthly_land_temp_anomaly_${e[1]}`, anomaly)
    updateDataset(`monthly_land_temp_${e[1]}`, temp)
  })
}

exports.updateDailyTempAnomalyLS = async () => {
  endpoints.forEach(async (e) => {
    const data = await getBerkeley(`Complete_${e[0]}_daily.txt`)
    const anomaly = parseDailyTempAnomaly(data)
    updateDataset(`daily_land_temp_anomaly_${e[1]}`, anomaly)
  })
}

exports.updateAnnualTempAnomalyLOC = async () => {
  const data = await getBerkeley(`Land_and_Ocean_summary.txt`)
  const anomaly = parseAnnualTempAnomaly(data)
  const temp = parseAnnualTemp(anomaly, 14.18)
  updateDataset(`annual_loc_temp_anomaly`, anomaly)
  updateDataset(`annual_loc_temp`, temp)
}

exports.updateMonthlyTempAnomalyLOC = async () => {
  const data = await getBerkeley(`Land_and_Ocean_complete.txt`)
  const anomaly = parseMonthlyTempAnomaly(data)
  const temp = parseMonthlyTemp(anomaly, [
    12.29,
    12.5,
    13.12,
    14.04,
    15.02,
    15.72,
    16.0,
    15.83,
    15.24,
    14.31,
    13.29,
    12.55,
  ])
  updateDataset(`monthly_loc_temp_anomaly`, anomaly)
  updateDataset(`monthly_loc_temp`, temp)
}
