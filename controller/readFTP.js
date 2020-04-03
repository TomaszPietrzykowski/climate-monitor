// var fs = require("fs")
var FTPClient = require("ftp")
var c = new FTPClient()

const readFTPData = async (ftpHost, ftpPath) => {
  c.connect({
    host: ftpHost
  })
  c.on("ready", function() {
    console.log("connected to ftp...")
    c.get(ftpPath, function(err, stream) {
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
          if (set[0] && set[3]) {
            outputLabels.push(set[0])
            outputValues.push(set[3] * 1)
          }
        })
        const output = { labels: outputLabels, values: outputValues }
        console.log(output)
        return output
      })
    })
  })
}

module.exports = readFTPData
