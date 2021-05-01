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
const path = "products/trends/sf6/";

exports.readAnnualSF6 = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}sf6_annmean_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const output = parseAnnualData(content);
        updateDataset("annual_sf6_gl", output.chart);
        updatePublicDataset("sf6_annual_public", output.public);
        c.end();
      });
    });
  });
});

exports.readAnnualGrowthRateSF6 = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}sf6_gr_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const output = parseAnnualData(content);
        updateDataset("annual_sf6_gr_gl", output.chart);
        updatePublicDataset("sf6_growth_public", output.public);
        c.end();
      });
    });
  });
});

exports.readMonthlySF6GL = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}sf6_mm_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const output = parseMonthlyData(content);
        updateDataset("monthly_sf6_gl", output.chart);
        updatePublicDataset("sf6_monthly_public", output.public);
        c.end();
      });
    });
  });
});
