const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  trend: {
    type: Number,
  },
  uncertainty: {
    type: Number,
  },
  since1800: {
    type: Number,
  },
  growthRate: {
    type: Number,
  },
  decimal: {
    type: Number,
  },
});

const publicDataSchema = new mongoose.Schema({
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
  readings: {
    type: [dataSchema],
  },
});

const publicDataModel = mongoose.model("Public_Dataset", publicDataSchema);

module.exports = publicDataModel;
