const FTPClient = require("ftp")

const { updateDataset } = require("./dbController")
const { parseTXT } = require("../utilities/tools")
const catchError = require("../utilities/catchError")
const logger = require("../Logger")

const host = "aftp.cmdl.noaa.gov"
const path = "products/trends/sf6/"

exports.readAnnualSF6 = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    logger.log("connected to ftp...")
    c.get(`${path}sf6_annmean_gl.txt`, function (err, stream) {
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
        updateDataset("annual_sf6_gl", output)
        c.end()
      })
    })
  })
})

exports.readAnnualGrowthRateSF6 = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    logger.log("connected to ftp...")
    c.get(`${path}sf6_gr_gl.txt`, function (err, stream) {
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
        updateDataset("annual_sf6_gr_gl", output)
        c.end()
      })
    })
  })
})

exports.readMonthlySF6GL = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    logger.log("connected to ftp...")
    c.get(`${path}sf6_mm_gl.txt`, function (err, stream) {
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
        updateDataset("monthly_sf6_gl", output)
        c.end()
      })
    })
  })
})
