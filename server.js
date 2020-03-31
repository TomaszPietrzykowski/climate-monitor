const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

const app = require("./app")

const DB = process.env.MONGO_ACCESS_STRING.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
)

mongoose
  .connect(DB, {
    //options object - settings dealing with deprication warnings:
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    // .connect() returns a promise
  })
  .then(con => {
    // with .then we have access to connection obj, here: con
    console.log(
      `MongoDB successfuly connected...... \nuser: ${con.connections[0].user}`
    )
  })
  .catch(() => {
    console.log("DB connection failed")
  })

// Mongoose constructor:
// --- schema:
const chartDataSchema = new mongoose.Schema({
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
    required: true,
    unique: true
  }
})
// --- model:
const chartDataModel = mongoose.model("ChartData", chartDataSchema)
// --- instance/document:
const TestData = new chartDataModel({
  labels: [],
  values: [],
  title: "testchartdata"
})
// --- execution:
// --- .save() returns a promise with access to newly created document
TestData.save()
  .then(doc => console.log(doc))
  .catch(err => console.log(err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}......`))
