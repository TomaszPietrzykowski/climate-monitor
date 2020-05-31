const FTPClient = require("ftp")

const { updateDataset } = require("./dbController")
const { parseTXT } = require("../utilities/tools")
const catchError = require("../utilities/catchError")

const host = "aftp.cmdl.noaa.gov"
const path = "products/trends/co2/"

exports.readDailyCO2 = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_trend_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const labels = []
        const values = []
        const trend = []
        data.forEach((set) => {
          labels.push(`${set[0]}-${set[1]}-${set[2]}`)
          values.push(set[3] * 1)
          trend.push(set[4] * 1)
        })
        const output = {
          labels,
          values,
          trend,
        }
        const l = output.labels
        const v = output.values
        const t = output.trend
        const latestOutput = {
          labels: [
            l[l.length - 1],
            l[l.length - 367],
            l[l.length - 1828],
            l[l.length - 3654],
          ],
          values: [
            v[v.length - 1],
            v[v.length - 367],
            v[v.length - 1828],
            v[v.length - 3654],
          ],
          trend: [
            t[t.length - 1],
            t[t.length - 367],
            t[t.length - 1828],
            t[t.length - 3654],
          ],
        }
        updateDataset("dailyco2", output)
        updateDataset("latestco2", latestOutput)
        console.log(
          `\n***** climatemonitor.info *****\n\n * Latest CO2 data: ${
            output.values[output.values.length - 1]
          } ppm *\n\nMesurment taken on: ${
            output.labels[output.labels.length - 1]
          } value: ${
            output.values[output.values.length - 1]
          }\nCorresponding reading 1 year ago: ${
            output.values[output.values.length - 365]
          }\nCorresponding reading 10 years ago: ${
            output.values[output.values.length - 3646]
          }\n\n******************************.`
        )
        c.end()
      })
    })
  })
})

exports.readAnnualCO2GL = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_annmean_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const outputLabels = []
        const outputValues = []
        data.forEach((set) => {
          outputLabels.push(set[0])
          outputValues.push(set[1] * 1)
        })
        const output = { labels: outputLabels, values: outputValues }
        updateDataset("annualco2gl", output)
        c.end()
      })
    })
  })
})
exports.readAnnualCO2ML = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_annmean_mlo.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const outputLabels = []
        const outputValues = []
        data.forEach((set) => {
          outputLabels.push(set[0])
          outputValues.push(set[1] * 1)
        })
        const output = { labels: outputLabels, values: outputValues }
        updateDataset("annualco2ml", output)
        c.end()
      })
    })
  })
})

exports.readAnnualCO2IncreaseGL = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_gr_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const outputLabels = []
        const outputValues = []
        data.forEach((set) => {
          outputLabels.push(set[0])
          outputValues.push(set[1] * 1)
        })
        const output = { labels: outputLabels, values: outputValues }
        updateDataset("annualco2increasegl", output)
        c.end()
      })
    })
  })
})
exports.readAnnualCO2IncreaseML = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_gr_mlo.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const outputLabels = []
        const outputValues = []
        data.forEach((set) => {
          outputLabels.push(set[0])
          outputValues.push(set[1] * 1)
        })
        const output = { labels: outputLabels, values: outputValues }
        updateDataset("annualco2increaseml", output)
        c.end()
      })
    })
  })
})
exports.readMonthlyCO2ML = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_mm_mlo.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const labels = []
        const values = []
        const trend = []
        data.forEach((set) => {
          labels.push(`${set[0]}-${set[1]}`)
          values.push(set[3] * 1)
          trend.push(set[5] * 1)
        })
        const output = { labels, values, trend }
        updateDataset("monthlyco2ml", output)
        c.end()
      })
    })
  })
})
exports.readMonthlyCO2GL = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_mm_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const labels = []
        const values = []
        const trend = []
        data.forEach((set) => {
          labels.push(`${set[0]}-${set[1]}`)
          values.push(set[3] * 1)
          trend.push(set[4] * 1)
        })
        const output = { labels, values, trend }
        updateDataset("monthlyco2gl", output)
        c.end()
      })
    })
  })
})
exports.readWeeklyCO2 = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}co2_weekly_mlo.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const labels = []
        const values = []
        const since1800 = []
        data.forEach((set) => {
          labels.push(`${set[0]}-${set[1]}-${set[2]}`)
          values.push(set[4] * 1)
          since1800.push(set[8] * 1)
        })
        const output = { labels, values, since1800 }
        updateDataset("weeklyco2", output)
        c.end()
      })
    })
  })
})
