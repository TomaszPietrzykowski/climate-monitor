const FTPClient = require("ftp")

const { updateDataset } = require("./dbController")
const { parseTXT } = require("../utilities/tools")

const host = "aftp.cmdl.noaa.gov"
const path = "products/trends/n2o/"

exports.readAnnualN2O = async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}n2o_annmean_gl.txt`, function (err, stream) {
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
        updateDataset("annualn2ogl", output)
      })
    })
  })
}
exports.readAnnualGrowthRateN2O = async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}n2o_gr_gl.txt`, function (err, stream) {
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
        updateDataset("annualn2ogrgl", output)
      })
    })
  })
}
exports.readMonthlyN2OGL = async () => {
  const c = new FTPClient()
  c.connect({
    host,
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get(`${path}n2o_mm_gl.txt`, function (err, stream) {
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
        updateDataset("monthlyn2ogl", output)
      })
    })
  })
}
