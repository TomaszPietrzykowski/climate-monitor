var FTPClient = require("ftp")
var c = new FTPClient()

const readDailyValues = async () => {
  c.connect({
    host: "aftp.cmdl.noaa.gov"
  })
  c.on("ready", function() {
    console.log("connected to ftp...")
    c.get("products/trends/co2/co2_trend_gl.txt", function(err, stream) {
      if (err) throw err
      var content = ""
      stream.on("data", function(chunk) {
        content += chunk.toString()
      })
      stream.on("end", function() {
        const parentArray = content.split("\n")
        const dataArray = parentArray.filter(row => !row.includes("#"))
        const outputLabels = []
        const outputValues = []
        dataArray.forEach(string => {
          const set = string.trim().split(" ")
          if (set[0]) {
            outputLabels.push(
              `${set[0]}-${set[5]}-${set[10] ? set[10] : set[9]}`
            )
            outputValues.push((set[13] ? set[13] : set[12]) * 1)
          }
        })
        const output = { labels: outputLabels, values: outputValues }
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
        return output
      })
    })
  })
}

module.exports = readDailyValues
