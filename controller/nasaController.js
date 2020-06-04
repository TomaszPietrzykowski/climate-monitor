const axios = require("axios")
const { parseTXT } = require("../utilities/tools")
const { updateDataset } = require("./dbController")
const { createClient } = require("webdav")

exports.updateSeaLevels = async () => {
  const client = createClient("https://podaac-tools.jpl.nasa.gov/drive/files", {
    username: "climatemonitor.info",
    password: process.env.EARTHDATA_PASS,
  })

  const list = await client.getDirectoryContents(
    "/allData/merged_alt/L2/TP_J1_OSTM/global_mean_sea_level"
  )
  const filtered = list.filter((f) => f.mime === "text/plain")
  const last = filtered.sort(function (a, b) {
    return new Date(b.lastmod) - new Date(a.lastmod)
  })[0].filename
  const file = last.split("/")[last.split("/").length - 1]

  const data = await client.getFileContents(
    `/allData/merged_alt/L2/TP_J1_OSTM/global_mean_sea_level/${file}`,
    { format: "text" }
  )

  console.log(parseTXT(data))

  //   const anomaly = parseAnnualTempAnomaly(data)
  //   const temp = parseAnnualTemp(anomaly, e[2])
  //   updateDataset(`annual_land_temp_anomaly_${e[1]}`, anomaly)
  //   updateDataset(`annual_land_temp_${e[1]}`, temp)
}
