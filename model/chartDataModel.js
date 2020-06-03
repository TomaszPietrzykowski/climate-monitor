const mongoose = require("mongoose")

const chartDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now(),
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
  uncertainty: {
    type: Array,
  },
  since1800: {
    type: Array,
  },
  growthRate: {
    type: Array,
  },
  decimal: {
    type: Array,
  },
})

const chartDataModel = mongoose.model("Chart_Dataset", chartDataSchema)

module.exports = chartDataModel
