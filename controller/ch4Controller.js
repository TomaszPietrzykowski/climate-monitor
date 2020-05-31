const FTPClient = require("ftp")

const { updateDataset } = require("./dbController")
const { parseTXT } = require("../utilities/tools")
const catchError = require("../utilities/catchError")

const host = "aftp.cmdl.noaa.gov"
const path = "products/trends/ch4/"

exports.readAnnualCH4 = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}ch4_annmean_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const labels = []
        const values = []
        data.forEach((set) => {
          labels.push(set[0])
          values.push(set[1] * 1)
        })
        const output = { labels, values }
        updateDataset("annualch4gl", output)
      })
    })
  })
})
exports.readAnnualGrowthRateCH4 = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}ch4_gr_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const data = parseTXT(content)
        const labels = []
        const values = []
        data.forEach((set) => {
          labels.push(set[0])
          values.push(set[1] * 1)
        })
        const output = { labels, values }
        updateDataset("annualch4grgl", output)
      })
    })
  })
})
exports.readMonthlyCH4GL = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}ch4_mm_gl.txt`, function (err, stream) {
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
        updateDataset("monthlych4gl", output)
      })
    })
  })
})
