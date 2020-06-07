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
  const filtered = list.filter(
    (f) => f.mime === "text/plain" && f.basename !== "README.txt"
  )
  const last = filtered.sort(function (a, b) {
    return new Date(b.lastmod) - new Date(a.lastmod)
  })[0].filename
  const file = last.split("/")[last.split("/").length - 1]

  const data = await client.getFileContents(
    `/allData/merged_alt/L2/TP_J1_OSTM/global_mean_sea_level/${file}`,
    { format: "text" }
  )
  const initialArray = parseTXT(data)
  const labels = []
  const values = []
  const decimal = []
  initialArray.forEach((el) => {
    labels.push(el[2].slice(0, 7))
    values.push(el[5])
    decimal.push(el[2])
  })
  const output = { labels, values, decimal }
  updateDataset(`sea_level_trend`, output)
}
exports.updateIceMass = async () => {
  const client = createClient("https://podaac-tools.jpl.nasa.gov/drive/files", {
    username: "climatemonitor.info",
    password: process.env.EARTHDATA_PASS,
  })

  const list = await client.getDirectoryContents(
    "/allData/tellus/L4/ice_mass/RL06/v02/mascon_CRI"
  )
  const filtered = list.filter(
    (f) => f.mime === "text/plain" && f.basename !== "README.txt"
  )
  filtered.forEach(async (file) => {
    const data = await client.getFileContents(
      `/allData/tellus/L4/ice_mass/RL06/v02/mascon_CRI/${file.basename}`,
      { format: "text" }
    )
    const initialArray = parseTXT(data)
    const labels = []
    const values = []
    const uncertainty = []
    initialArray.forEach((el) => {
      labels.push(el[0])
      values.push(parseFloat(el[1]))
      uncertainty.push(parseFloat(el[2]))
    })
    const output = { labels, values, uncertainty }
    updateDataset(`${file.basename.split("_")[0]}_ice_mass`, output)
  })
}

exports.updateOceanMass = async () => {
  const client = createClient("https://podaac-tools.jpl.nasa.gov/drive/files", {
    username: "climatemonitor.info",
    password: process.env.EARTHDATA_PASS,
  })

  const list = await client.getDirectoryContents(
    "allData/tellus/L4/ocean_mass/RL06/v02/mascon_CRI"
  )
  const file = list.filter(
    (f) => f.mime === "text/plain" && f.basename !== "README.txt"
  )[0].basename

  const data = await client.getFileContents(
    `/allData/tellus/L4/ocean_mass/RL06/v02/mascon_CRI/${file}`,
    { format: "text" }
  )
  const initialArray = parseTXT(data)
  const labels = []
  const values = []
  const decimal = []
  initialArray.forEach((el) => {
    labels.push(el[0])
    values.push(parseFloat(el[1]))
    decimal.push(parseFloat(el[0]))
  })
  const output = { labels, values, decimal }
  updateDataset(`global_ocean_mass`, output)
}
