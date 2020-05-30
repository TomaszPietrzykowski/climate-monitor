const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const readDailyCO2 = require("./controller/readDailyCO2")
const readAnnualCO2 = require("./controller/readAnnualCO2")
const chartDataRouter = require("./router/chartDataRouter")

dotenv.config({ path: "./config.env" })

// Middleware cycle:
app.use(express.json()) // <-- body parser

// -- routing
app.use("/api/v1/chartdata", chartDataRouter)

// -- db CONNECTION
const DB = process.env.MONGO_ACCESS_STRING.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
)

mongoose
  .connect(DB, {
    //options object - settings dealing with deprecation warnings:
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(
      `MongoDB successfuly connected...... \nDB user: ${con.connections[0].user}`
    )
  })
  .catch(() => {
    console.log("DB connection failed")
  })

readDailyCO2()
readAnnualCO2()

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}......`)
)
