const FTPClient = require("ftp");

const { updateDataset, updatePublicDataset } = require("./dbController");
const {
  parseTXT,
  formatChartLabels,
  parseAnnualData,
  parseMonthlyData,
} = require("../utilities/tools");
const catchError = require("../utilities/catchError");
const logger = require("../Logger");

const host = "aftp.cmdl.noaa.gov";
const path = "products/trends/ch4/";

exports.readAnnualCH4 = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}ch4_annmean_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const output = parseAnnualData(content);
        updateDataset("annual_ch4_gl", output.chart);
        updatePublicDataset("ch4_annual_public", output.public);
        c.end();
      });
    });
  });
});
exports.readAnnualGrowthRateCH4 = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}ch4_gr_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const output = parseAnnualData(content);
        updateDataset("annual_ch4_gr_gl", output.chart);
        updatePublicDataset("ch4_growth_public", output.public);
        c.end();
      });
    });
  });
});
exports.readMonthlyCH4GL = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}ch4_mm_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const output = parseMonthlyData(content);
        updateDataset("monthly_ch4_gl", output.chart);
        updatePublicDataset("ch4_monthly_public", output.public);
        c.end();
      });
    });
  });
});
