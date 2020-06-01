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

exports.getAnnualTempAnomalyLS = async () => {
  const response = await axios.get(
    "http://berkeleyearth.lbl.gov/auto/Global/Complete_TAVG_summary.txt"
  )
  const string = await response.data
  const data = parseTXT(string)
  const annualAnomaly = parseAnnualTempAnomalyLS(data)
  const annualTemp = parseAnnualTemp(annualAnomaly)

  updateDataset("annual_landsea_temp_anomaly", annualAnomaly)
  updateDataset("annual_landsea_temp", annualTemp)
}
