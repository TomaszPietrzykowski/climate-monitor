const FTPClient = require("ftp")

const { updateDataset, updatePublicDataset } = require("./dbController")
const { parseAnnualData, parseMonthlyData } = require("../utilities/tools")
const catchError = require("../utilities/catchError")
const logger = require("../Logger")

const host = "aftp.cmdl.noaa.gov"
const path = "products/trends/n2o/"

exports.readAnnualN2O = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    logger.log("connected to ftp...")
    c.get(`${path}n2o_annmean_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const output = parseAnnualData(content)
        updateDataset("annual_n2o_gl", output.chart)
        updatePublicDataset("n2o_annual_public", output.public)
        c.end()
      })
    })
  })
})

exports.readAnnualGrowthRateN2O = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    logger.log("connected to ftp...")
    c.get(`${path}n2o_gr_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const output = parseAnnualData(content)
        updateDataset("annual_n2o_gr_gl", output.chart)
        updatePublicDataset("n2o_growth_public", output.public)
        c.end()
      })
    })
  })
})

exports.readMonthlyN2OGL = catchError(async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    logger.log("connected to ftp...")
    c.get(`${path}n2o_mm_gl.txt`, function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const output = parseMonthlyData(content)
        updateDataset("monthly_n2o_gl", output.chart)
        updatePublicDataset("n2o_monthly_public", output.public)
        c.end()
      })
    })
  })
})
