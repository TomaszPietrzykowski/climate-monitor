const {
  parseTXT,
  formatChartLabels,
  decimalToMonth,
} = require("../utilities/tools")
const { updateDataset, updatePublicDataset } = require("./dbController")
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
    `/allData/merged_alt/L2/TP_J1_OSTM/global_mean_sea_level/${file.replace(
      ".txt.md5",
      ".txt"
    )}`,
    { format: "text" }
  )
  // console.log(data.substring(0, 2600))
  const publicData = []
  const rawLabels = []
  const values = []
  const decimal = []

  const initialArray = parseTXT(data)
  initialArray.forEach((el) => {
    rawLabels.push(el[2].slice(0, 7))
    decimal.push(el[2])
    values.push(parseFloat(el[5]))
  })
  const labels = formatChartLabels(decimalToMonth(rawLabels))
  labels.forEach((label, i) => {
    publicData.push({
      label,
      value: values[i],
      decimal: decimal[i],
    })
  })

  const output = { chart: { labels, values, decimal }, public: publicData }
  updateDataset(`sea_level_trend`, output.chart)
  updatePublicDataset(`ocean_level_public`, output.public)
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

    const publicData = []
    const rawLabels = []
    const values = []
    const decimal = []
    const uncertainty = []

    const initialArray = parseTXT(data)
    initialArray.forEach((el) => {
      rawLabels.push(el[0])
      decimal.push(el[0])
      values.push(parseFloat(el[1]))
      uncertainty.push(parseFloat(el[2]))
    })
    const labels = formatChartLabels(decimalToMonth(rawLabels))
    labels.forEach((label, i) => {
      publicData.push({
        label,
        value: values[i],
        uncertainty: uncertainty[i],
        decimal: decimal[i],
      })
    })

    const output = {
      chart: { labels, values, decimal, uncertainty },
      public: publicData,
    }
    updateDataset(`${file.basename.split("_")[0]}_ice_mass`, output.chart)
    updatePublicDataset(
      `glaciers_${file.basename.split("_")[0]}_public`,
      output.public
    )
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
  const publicData = []
  const rawLabels = []
  const values = []
  const decimal = []

  const initialArray = parseTXT(data)
  initialArray.forEach((el) => {
    rawLabels.push(el[0])
    decimal.push(el[0])
    values.push(parseFloat(el[1]))
  })
  const labels = formatChartLabels(decimalToMonth(rawLabels))
  labels.forEach((label, i) => {
    publicData.push({
      label,
      value: values[i],
      decimal: decimal[i],
    })
  })

  const output = { chart: { labels, values, decimal }, public: publicData }

  updateDataset(`global_ocean_mass`, output.chart)
  updatePublicDataset(`ocean_mass_public`, output.public)
}
