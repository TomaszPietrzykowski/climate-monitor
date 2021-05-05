const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

const cron = require("./controller/cronController")
const globalErrorHandler = require("./controller/errorController")
const chartDataRouter = require("./router/chartDataRouter")
const publicApiRouter = require("./router/publicApiRouter")
const newsRouter = require("./router/newsRouter")
const news = require("./controller/newsController")
const nasa = require("./controller/nasaController")
const ber = require("./controller/berkeleyController")
const sf6 = require("./controller/sf6Controller")
const n2o = require("./controller/n2oController")
const ch4 = require("./controller/ch4Controller")
const logger = require("./Logger")
const tools = require("./controller/dbController")

dotenv.config({ path: "./config.env" })

const app = express()

// Middleware cycle:
app.use(cors(false))
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // <-- body parser

// -- routing
app.use("/api/v1/chartdata", chartDataRouter)
app.use("/api/public/v1", publicApiRouter)
app.use("/api/news", newsRouter)

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

// run data update schedule
cron.run()
// --- TESTS ---

// Create public dataset: ****************
// tools.forgePublicDataset({
//   datasetID: "temp_daily_max_public",
//   title: "Land surface daily temperature anomaly maximum",
//   description: "temporary description",
//   unit: "C",
//   readings: [],
// })
// ***************************************

// nasa.updateIceMass()
// ch4.readAnnualCH4();
// ch4.readAnnualGrowthRateCH4();
// n2o.readMonthlyN2OGL();
// n2o.readAnnualN2O();
// n2o.readAnnualGrowthRateN2O();
// sf6.readMonthlySF6GL();
// sf6.readAnnualSF6();
// sf6.readAnnualGrowthRateSF6();

ber.updateDailyTempAnomalyLS()

// news.updateNewsfeed();
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}......`)
)
