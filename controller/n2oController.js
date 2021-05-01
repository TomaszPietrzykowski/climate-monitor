const FTPClient = require("ftp");

const { updateDataset, updatePublicDataset } = require("./dbController");
const { parseTXT, formatChartLabels } = require("../utilities/tools");
const catchError = require("../utilities/catchError");
const logger = require("../Logger");

const host = "aftp.cmdl.noaa.gov";
const path = "products/trends/n2o/";

exports.readAnnualN2O = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}n2o_annmean_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const publicData = [];
        const rawLabels = [];
        const values = [];
        // parse txt data
        const data = parseTXT(content);
        data.forEach((set) => {
          rawLabels.push(set[0]);
          values.push(parseFloat(set[1]));
        });
        // format labels
        const labels = formatChartLabels(rawLabels);
        // parse object data
        labels.forEach((l, i) => {
          publicData.push({
            label: l,
            value: values[i],
          });
        });
        const output = { labels, values };
        updateDataset("annual_n2o_gl", output);
        updatePublicDataset("n2o_annual_public", publicData);
        // console.log(publicData);
        c.end();
      });
    });
  });
});

exports.readAnnualGrowthRateN2O = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}n2o_gr_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const data = parseTXT(content);
        const labels = [];
        const values = [];
        data.forEach((set) => {
          labels.push(set[0]);
          values.push(set[1] * 1);
        });
        const output = { labels, values };
        updateDataset("annual_n2o_gr_gl", output);
        c.end();
      });
    });
  });
});

exports.readMonthlyN2OGL = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}n2o_mm_gl.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const data = parseTXT(content);
        const labels = [];
        const values = [];
        const trend = [];
        data.forEach((set) => {
          labels.push(`${set[0]}-${set[1]}`);
          values.push(set[3] * 1);
          trend.push(set[5] * 1);
        });
        const output = { labels: formatChartLabels(labels), values, trend };
        updateDataset("monthly_n2o_gl", output);
        c.end();
      });
    });
  });
});
