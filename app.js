const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const CronJob = require("cron").CronJob

const globalErrorHandler = require("./controller/errorController")
const chartDataRouter = require("./router/chartDataRouter")
// const co2 = require("./controller/co2Controller")
// const ch4 = require("./controller/ch4Controller")
// const n2o = require("./controller/n2oController")
// const sf6 = require("./controller/sf6Controller")
const {
  runDailyUpdate,
  runMonthlyUpdate,
  runAnnualCO2Update,
  runAnnualOtherUpdate,
} = require("./controller/cronController")

dotenv.config({ path: "./config.env" })

const app = express()

// Middleware cycle:
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // <-- body parser

// -- routing
app.use("/api/v1/chartdata", chartDataRouter)

// catch all invalid routes - push err to error middleware by passing arg to next()
app.all("*", (req, res, next) => {
  next(new AppError(`Couldn't find ${req.originalUrl}`, 404))
})

//global error handling middleware
app.use(globalErrorHandler)

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
// --------- cron sandbox -----------------------------------------

const dailyUpdate = new CronJob(
  "0 0 0,6,12,18 * * *",
  runDailyUpdate,
  null,
  true,
  "America/Los_Angeles"
)

const monthlyUpdate = new CronJob(
  "0 1 2 * * *",
  runMonthlyUpdate,
  null,
  true,
  "America/Los_Angeles"
)

const annualCO2Update = new CronJob(
  "0 2 4 0,3 * *",
  runAnnualCO2Update,
  null,
  true,
  "America/Los_Angeles"
)

const annualOtherUpdate = new CronJob(
  "0 3 5 1,4 * *",
  runAnnualOtherUpdate,
  null,
  true,
  "America/Los_Angeles"
)

dailyUpdate.start()
monthlyUpdate.start()
annualCO2Update.start()
annualOtherUpdate.start()

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}......`)
)
