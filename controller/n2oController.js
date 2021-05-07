const FTPClient = require("ftp")

const { updateDataset, updatePublicDataset } = require("./dbController")
const { parseAnnualData, parseMonthlyData } = require("../utilities/tools")
const logger = require("../Logger")

const host = "aftp.cmdl.noaa.gov"
const path = "products/trends/n2o/"

exports.readAnnualN2O = async () => {
  try {
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
  } catch (err) {
    logger.log(`Error updating annual n2o: ${err}`)
  }
}

exports.readAnnualGrowthRateN2O = async () => {
  try {
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
  } catch (err) {
    logger.log(`Error updating n2o growth rate: ${err}`)
  }
}

exports.readMonthlyN2OGL = async () => {
  try {
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
  } catch (err) {
    logger.log(`Error updating monthly n2o: ${err}`)
  }
}
