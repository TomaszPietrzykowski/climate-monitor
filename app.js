const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const cron = require("./controller/cronController")
// custom
const globalErrorHandler = require("./controller/errorController")
const chartDataRouter = require("./router/chartDataRouter")
const publicApiRouter = require("./router/publicApiRouter")
const newsRouter = require("./router/newsRouter")
const logger = require("./Logger")
// init
const app = express()
dotenv.config({ path: "./config.env" })
// middleware
app.use(cors(false))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// routing
app.use("/api/v1/chartdata", chartDataRouter)
app.use("/api/public/v1", publicApiRouter)
app.use("/api/news", newsRouter)
// static
app.use(express.static(path.join(__dirname, "/view")))
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "view", "index.html"))
)
//global error handling middleware
app.use(globalErrorHandler)
// db connection
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
  .catch((err) => {
    logger.log(`DB connection failed\nError: ${err}`)
  })
// run data update scheduler
cron.run()
// start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}......`))
