const mongoose = require("mongoose")

const chartDataSchema = new mongoose.Schema({
  lastUpdate: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    trim: true,
  },
  datasetID: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
  trend: {
    type: Array,
  },
  title: {
    type: String,
    required: true,
  },
})

const chartDataModel = mongoose.model("Chart_Dataset", chartDataSchema)

module.exports = chartDataModel
