const FTPClient = require("ftp");

const { updateDataset, updatePublicDataset } = require("./dbController");
const { parseTXT, formatChartLabels } = require("../utilities/tools");
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
        updateDataset("annual_ch4_gl", output);
        updatePublicDataset("ch4_annual_public", publicData);
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
        updateDataset("annual_ch4_gr_gl", output);
        updatePublicDataset("ch4_growth_public", publicData);
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
        const publicData = [];
        const rawLabels = [];
        const values = [];
        const trend = [];

        const data = parseTXT(content);
        data.forEach((set) => {
          rawLabels.push(`${set[0]}-${set[1]}`);
          values.push(parseFloat(set[3]));
          trend.push(parseFloat(set[5]));
        });

        // format labels
        const labels = formatChartLabels(rawLabels);
        // parse object data
        labels.forEach((l, i) => {
          publicData.push({
            label: l,
            value: values[i],
            trend: trend[i],
          });
        });

        const output = { labels, values, trend };
        updateDataset("monthly_ch4_gl", output);
        updatePublicDataset("ch4_monthly_public", publicData);
        c.end();
      });
    });
  });
});
