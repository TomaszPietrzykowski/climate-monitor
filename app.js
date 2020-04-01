const express = require("express")

const app = express()
const chartDataRouter = require("./router/chartDataRouter")

// Middleware cycle:
app.use(express.json()) // <-- body parser
// -- routing
app.use("/api/v1/chartdata", chartDataRouter)

module.exports = app
