const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const readFTP = require("./controller/dataUpdateController")
const readAnnualCO2 = require("./controller/readAnnualCO2")
const readDailyCO2 = require("./controller/readDailyCO2")

dotenv.config({ path: "./config.env" })

const app = require("./app")

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
    useUnifiedTopology: true
    // .connect() returns a promise
  })
  .then(con => {
    // with .then we have access to connection obj, here: con
    console.log(
      `MongoDB successfuly connected...... \nDB user: ${con.connections[0].user}`
    )
  })
  .catch(() => {
    console.log("DB connection failed")
  })

// readDailyCO2()
// readAnnualCO2()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}......`))
