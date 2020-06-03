const axios = require("axios")

const { parseTXT } = require("../utilities/tools")
const { updateDataset } = require("./dbController")

const parseAnnualTempAnomalyLS = (inputData) => {
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

const parseAnnualTemp = (input) => {
  const newValues = input.values.map((v) => parseFloat((v + 8.64).toFixed(2)))
  const newUnc = input.uncertainty.map((v) => parseFloat(v.toFixed(2)))
  const output = {
    labels: input.labels,
    values: newValues,
    uncertainty: newUnc,
  }
  return output
}
const parseMonthlyTempAnomalyLS = (inputData) => {
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

const parseMonthlyTemp = (input) => {
  const newValues = input.values.map((v, i) => {
    const month = parseInt(input.labels[i].split("-")[1])
    let tempFactor
    switch (month) {
      case 1:
        tempFactor = 2.62
        break
      case 2:
        tempFactor = 3.23
        break
      case 3:
        tempFactor = 5.33
        break
      case 4:
        tempFactor = 8.34
        break
      case 5:
        tempFactor = 11.33
        break
      case 6:
        tempFactor = 13.47
        break
      case 7:
        tempFactor = 14.34
        break
      case 8:
        tempFactor = 13.87
        break
      case 9:
        tempFactor = 12.09
        break
      case 10:
        tempFactor = 9.25
        break
      case 11:
        tempFactor = 6.12
        break
      default:
        tempFactor = 3.66
    }
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

const parseDailyTempAnomalyLS = (inputData) => {
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

exports.getAnnualTempAnomalyLS = async () => {
  const response = await axios.get(
    "http://berkeleyearth.lbl.gov/auto/Global/Complete_TAVG_summary.txt"
  )
  const string = await response.data
  const data = parseTXT(string)
  const annualAnomaly = parseAnnualTempAnomalyLS(data)
  const annualTemp = parseAnnualTemp(annualAnomaly)

  updateDataset("annual_land_temp_anomaly", annualAnomaly)
  updateDataset("annual_land_temp", annualTemp)
}

exports.getMonthlyTempAnomalyLS = async () => {
  const response = await axios.get(
    "http://berkeleyearth.lbl.gov/auto/Global/Complete_TAVG_complete.txt"
  )
  const string = await response.data
  const data = parseTXT(string)
  const monthlyAnomaly = parseMonthlyTempAnomalyLS(data)
  const monthlyTemp = parseMonthlyTemp(monthlyAnomaly)
  updateDataset("monthly_land_temp_anomaly", monthlyAnomaly)
  updateDataset("monthly_land_temp", monthlyTemp)
}

exports.getDailyTempAnomalyLS = async () => {
  const response = await axios.get(
    "http://berkeleyearth.lbl.gov/auto/Global/Complete_TAVG_daily.txt"
  )
  const string = await response.data
  const data = parseTXT(string)
  const dailyAnomaly = parseDailyTempAnomalyLS(data)

  updateDataset("daily_land_temp_anomaly", dailyAnomaly)
}
