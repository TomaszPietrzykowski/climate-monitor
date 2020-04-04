const chartDataModel = require("../model/chartDataModel")

const updateDataset = async (id, data) => {
  try {
    await chartDataModel.findOneAndUpdate(
      {
        datasetID: id
      },
      { ...data, lastUpdate: Date.now() },
      {
        new: true,
        runValidators: true
      }
    )
    console.log("Dataset updated...")
  } catch (err) {
    console.log(err)
  }
}

module.exports = updateDataset
