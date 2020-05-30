const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const chartDataRouter = require("./router/chartDataRouter")
const noaa = require("./controller/sourceController")

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

noaa.readDailyCO2()
noaa.readAnnualCO2()

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}......`)
)
