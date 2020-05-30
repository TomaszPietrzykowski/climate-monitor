const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const chartDataRouter = require("./router/chartDataRouter")
const co2 = require("./controller/co2Controller")
const n2o = require("./controller/n2oController")

dotenv.config({ path: "./config.env" })

const app = express()

// Middleware cycle:
app.use(express.urlencoded({ extended: false }))
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

// co2.readDailyCO2()
// co2.readWeeklyCO2()
// co2.readAnnualCO2GL()
// co2.readAnnualCO2ML()
// co2.readAnnualCO2IncreaseGL()
// co2.readAnnualCO2IncreaseML()
// co2.readMonthlyCO2ML()
// co2.readMonthlyCO2GL()
// ch4.readAnnualCH4()
// ch4.readAnnualGrowthRateCH4()
// ch4.readMonthlyCH4GL()
// n2o.readAnnualN2O()
// n2o.readAnnualGrowthRateN2O()
// n2o.readMonthlyN2OGL()

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}......`)
)
