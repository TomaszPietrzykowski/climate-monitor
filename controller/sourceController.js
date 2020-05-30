const FTPClient = require("ftp")
const updateDataset = require("./updateDataset")

exports.readDailyCO2 = async () => {
  const c = new FTPClient()
  c.connect({
    host: "aftp.cmdl.noaa.gov",
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get("products/trends/co2/co2_trend_gl.txt", function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const parentArray = content.split("\n")
        const dataArray = parentArray.filter((row) => !row.includes("#"))
        const outputLabels = []
        const outputValues = []
        const outputTrend = []
        dataArray.forEach((string) => {
          const set = string
            .trim()
            .split(" ")
            .filter((s) => s !== "")

          if (set[0]) {
            outputLabels.push(`${set[0]}-${set[1]}-${set[2]}`)
            outputValues.push(set[3] * 1)
            outputTrend.push(set[4] * 1)
          }
        })
        const output = {
          labels: outputLabels,
          values: outputValues,
          trend: outputTrend,
        }
        const latestOutput = {
          labels: [
            output.labels[output.labels.length - 1],
            output.labels[output.labels.length - 367],
            output.labels[output.labels.length - 1828],
            output.labels[output.labels.length - 3654],
          ],
          values: [
            output.values[output.values.length - 1],
            output.values[output.values.length - 367],
            output.values[output.values.length - 1828],
            output.values[output.values.length - 3654],
          ],
          trend: [
            output.values[output.trend.length - 1],
            output.values[output.trend.length - 367],
            output.values[output.trend.length - 1828],
            output.values[output.trend.length - 3654],
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
      })
    })
  })
}

exports.readAnnualCO2 = async () => {
  const c = new FTPClient()
  c.connect({
    host: "aftp.cmdl.noaa.gov",
  })
  c.on("ready", function () {
    console.log("connected to ftp...")
    c.get("products/trends/co2/co2_annmean_mlo.txt", function (err, stream) {
      if (err) throw err
      let content = ""
      stream.on("data", function (chunk) {
        content += chunk.toString()
      })
      stream.on("end", function () {
        const parentArray = content.split("\n")
        const dataArray = parentArray.filter((row) => !row.includes("#"))
        const outputLabels = []
        const outputValues = []
        dataArray.forEach((string) => {
          const set = string
            .trim()
            .split(" ")
            .filter((s) => s !== "")

          if (set[0] && set[1]) {
            outputLabels.push(set[0])
            outputValues.push(set[1] * 1)
          }
        })
        const output = { labels: outputLabels, values: outputValues }
        updateDataset("annualco2", output)
      })
    })
  })
}
