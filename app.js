const express = require("express")

const app = express()
const co2Router = require("./router/co2Router")

// Middleware cycle:
app.use(express.json()) // <-- body parser
// -- routing
app.use("/api/v1/co2", co2Router)

module.exports = app
