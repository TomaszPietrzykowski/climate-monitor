const mongoose = require("mongoose")
// Mongoose constructor:
// --- schema:
const chartDataSchema = new mongoose.Schema({
  lastUpdate: {
    type: Date,
    default: Date.now()
  },
  description: {
    type: String,
    trim: true
  },
  datasetID: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  labels: {
    type: Array,
    required: true
  },
  values: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
// --- model:
const chartDataModel = mongoose.model("Chart_Dataset", chartDataSchema)
// --- instance/document:
// const TestData = new chartDataModel({
//   datasetID: "dailyco2",
//   labels: [1950, 1951, 1952],
//   values: [318, 320, 321],
//   title: "Modern days daily CO2"
// })
// // --- execution:
// // --- .save() returns a promise with access to newly created document
// TestData.save()
//   .then(doc => console.log(doc))
//   .catch(err => console.log(err))
module.exports = chartDataModel
