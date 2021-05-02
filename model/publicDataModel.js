const mongoose = require("mongoose")

const dataSchema = mongoose.Schema(
  {
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
    since1800: {
      type: Number,
    },
    decimal: {
      type: String,
    },
  },
  { _id: false }
)

const publicDataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
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
  },
  {
    timestamps: true,
  }
)

const publicDataModel = mongoose.model("Public_Dataset", publicDataSchema)

module.exports = publicDataModel
