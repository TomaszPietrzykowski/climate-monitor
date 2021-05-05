const axios = require("axios")
const AppError = require("../utilities/appError")
const catchError = require("../utilities/catchError")

const { parseTXTNaN, formatChartLabels } = require("../utilities/tools")
const { updateDataset, updatePublicDataset } = require("./dbController")

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
  const data = parseTXTNaN(string)
  return data
}

// --------------------------------------------------------------- PARSING FUNCTIONS

const parseAnnualTempAnomaly = (inputData) => {
  const publicData = []
  const labels = []
  const values = []
  const uncertainty = []
  inputData.forEach((el) => {
    labels.push(el[0])
    values.push(parseFloat(el[1]))
    uncertainty.push(parseFloat(el[2]))
  })
  labels.forEach((label, i) => {
    publicData.push({
      label,
      value: values[i],
      uncertainty: uncertainty[i],
    })
  })
  const output = { chart: { labels, values, uncertainty }, public: publicData }
  return output
}

const parseAnnualTemp = (input, averaged) => {
  const publicData = []
  const newValues = input.values.map((v) =>
    parseFloat((v + averaged).toFixed(2))
  )
  const newUnc = input.uncertainty.map((v) => parseFloat(v.toFixed(2)))

  input.labels.forEach((label, i) => {
    publicData.push({
      label,
      value: newValues[i],
      uncertainty: newUnc[i],
    })
  })

  const output = {
    chart: {
      labels: input.labels,
      values: newValues,
      uncertainty: newUnc,
    },
    public: publicData,
  }
  return output
}
const parseMonthlyTempAnomaly = (inputData) => {
  const publicData = []
  const rawLabels = []
  const values = []
  const uncertainty = []
  inputData.forEach((el) => {
    if (!isNaN(parseFloat(el[2]))) {
      rawLabels.push(`${el[0]}-${el[1]}`)
      values.push(parseFloat(el[2]))
      uncertainty.push(parseFloat(el[3]))
    }
  })
  const labels = formatChartLabels(rawLabels)
  labels.forEach((label, i) => {
    publicData.push({
      label,
      value: values[i],
      uncertainty: uncertainty[i],
    })
  })
  const output = { chart: { labels, values, uncertainty }, public: publicData }

  return output
}

const parseMonthlyTemp = (input, averaged) => {
  const publicData = []
  const newValues = input.values.map((v, i) => {
    const month = parseInt(input.labels[i].split("-")[1])
    let tempFactor = averaged[month - 1]

    return parseFloat((v + tempFactor).toFixed(2))
  })
  const newUnc = input.uncertainty.map((v) => parseFloat(v.toFixed(2)))

  input.labels.forEach((label, i) => {
    if (!isNaN(newValues[i])) {
      publicData.push({
        label,
        value: newValues[i],
        uncertainty: newUnc[i],
      })
    }
  })
  const output = {
    chart: { labels: input.labels, values: newValues, uncertainty: newUnc },
    public: publicData,
  }
  return output
}

const parseDailyTempAnomaly = (inputData) => {
  const publicData = []
  const rawLabels = []
  const values = []
  const decimal = []
  inputData.forEach((el) => {
    rawLabels.push(`${el[1]}-${el[2]}-${el[3]}`)
    values.push(parseFloat(el[5]))
    decimal.push(parseFloat(el[0]))
  })
  const labels = formatChartLabels(rawLabels)
  labels.forEach((label, i) => {
    publicData.push({
      label,
      value: values[i],
      decimal: decimal[i],
    })
  })
  const output = { chart: { labels, values, decimal }, public: publicData }
  return output
}

// ----------------------------------------------------------------------------  UPDATE FUNCTIONS

exports.updateAnnualTempAnomalyLS = async () => {
  endpoints.forEach(async (e) => {
    const data = await getBerkeley(`Complete_${e[0]}_summary.txt`)
    const anomaly = parseAnnualTempAnomaly(data)
    const temp = parseAnnualTemp(anomaly.chart, e[2])

    // console.log(`temp_annual_anomaly_${e[1]}_public`)

    updateDataset(`annual_land_temp_anomaly_${e[1]}`, anomaly.chart)
    updateDataset(`annual_land_temp_${e[1]}`, temp.chart)
    updatePublicDataset(`temp_annual_anomaly_${e[1]}_public`, anomaly.public)
    updatePublicDataset(`temp_annual_${e[1]}_public`, temp.public)
  })
}

exports.updateMonthlyTempAnomalyLS = async () => {
  endpoints.forEach(async (e) => {
    try {
      const data = await getBerkeley(`Complete_${e[0]}_complete.txt`)
      const anomaly = parseMonthlyTempAnomaly(data)
      const temp = parseMonthlyTemp(anomaly.chart, e[3])

      updateDataset(`monthly_land_temp_anomaly_${e[1]}`, anomaly.chart)
      updateDataset(`monthly_land_temp_${e[1]}`, temp.chart)
      updatePublicDataset(`temp_monthly_anomaly_${e[1]}_public`, anomaly.public)
      updatePublicDataset(`temp_monthly_${e[1]}_public`, temp.public)
    } catch (err) {
      throw new AppError(`Gotya! ${err}`, 500)
    }
  })
}

exports.updateDailyTempAnomalyLS = async () => {
  endpoints.forEach(async (e) => {
    try {
      const data = await getBerkeley(`Complete_${e[0]}_daily.txt`)
      const anomaly = parseDailyTempAnomaly(data)
      // console.log(anomaly.chart.labels[3])
      // console.log(anomaly.public[3])
      updateDataset(`daily_land_temp_anomaly_${e[1]}`, anomaly.chart)
      updatePublicDataset(`daily_${e[1]}`, anomaly.public)
    } catch (err) {
      throw new AppError(`Gotya! ${err}`, 500)
    }
  })
}

exports.updateAnnualTempAnomalyLOC = async () => {
  const data = await getBerkeley(`Land_and_Ocean_summary.txt`)
  const anomaly = parseAnnualTempAnomaly(data)
  const temp = parseAnnualTemp(anomaly.chart, 14.18)
  updateDataset(`annual_loc_temp_anomaly`, anomaly.chart)
  updateDataset(`annual_loc_temp`, temp.chart)
  updatePublicDataset(`temp_annual_loc_anomaly_public`, anomaly.public)
  updatePublicDataset(`temp_annual_loc_public`, temp.public)
}

exports.updateMonthlyTempAnomalyLOC = async () => {
  const data = await getBerkeley(`Land_and_Ocean_complete.txt`)
  const filteredLabels = []
  const filteredValues = []
  const filteredUncertainty = []

  const anomaly = parseMonthlyTempAnomaly(data)
  anomaly.chart.labels.forEach((el, i) => {
    if (filteredLabels.filter((lab) => lab === el).length === 0) {
      filteredLabels.push(el)
      filteredValues.push(anomaly.chart.values[i])
      filteredUncertainty.push(anomaly.chart.uncertainty[i])
    }
  })
  const filtered = {
    labels: filteredLabels,
    values: filteredValues,
    uncertainty: filteredUncertainty,
  }
  const publicData = []
  filtered.labels.forEach((label, i) => {
    publicData.push({
      label,
      value: filtered.values[i],
      uncertainty: filtered.uncertainty[i],
    })
  })
  const temp = parseMonthlyTemp(filtered, [
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
  updateDataset(`monthly_loc_temp_anomaly`, filtered)
  updateDataset(`monthly_loc_temp`, temp.chart)
  updatePublicDataset(`temp_monthly_loc_anomaly_public`, publicData)
  updatePublicDataset(`temp_monthly_loc_public`, temp.public)
}
