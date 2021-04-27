const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const cron = require("./controller/cronController");
const globalErrorHandler = require("./controller/errorController");
const chartDataRouter = require("./router/chartDataRouter");
const publicApiRouter = require("./router/publicApiRouter");
const newsRouter = require("./router/newsRouter");
const news = require("./controller/newsController");
const logger = require("./Logger");
const validate = require("./utilities/tools").validateDateQueryScope;

dotenv.config({ path: "./config.env" });

const app = express();

// Middleware cycle:
app.use(cors(false));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // <-- body parser

// -- routing
app.use("/api/v1/chartdata", chartDataRouter);
app.use("/api/public/v1", publicApiRouter);
app.use("/api/news", newsRouter);

// catch all invalid routes - push err to error middleware by passing arg to next()
app.all("*", (req, res, next) => {
  next(new AppError(`Couldn't find ${req.originalUrl}`, 404));
});

//global error handling middleware
app.use(globalErrorHandler);

// -- db CONNECTION
const DB = process.env.MONGO_ACCESS_STRING.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
);

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
    );
  })
  .catch(() => {
    console.log("DB connection failed");
  });

// run data update schedule
cron.run();
// --- TESTS ---
// console.log(
//   validate([{ label: "2011-01-01" }, { label: "2012-01-01" }], "2011-06-01")
// );
// news.updateNewsfeed();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}......`)
);
