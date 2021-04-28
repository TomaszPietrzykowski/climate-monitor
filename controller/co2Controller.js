const FTPClient = require("ftp");

const {
  updateDataset,
  updatePublicDataset,
  forgePublicDataset,
} = require("./dbController");
const { parseTXT, formatChartLabels } = require("../utilities/tools");
const catchError = require("../utilities/catchError");
const logger = require("../Logger");

const host = "aftp.cmdl.noaa.gov";
const path = "products/trends/co2/";

exports.readDailyCO2 = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_trend_gl.txt`, function (err, stream) {
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
        // parse data from txt
        const data = parseTXT(content);
        data.forEach((set) => {
          rawLabels.push(`${set[0]}-${set[1]}-${set[2]}`);
          values.push(parseFloat(set[3]));
          trend.push(parseFloat(set[4]));
        });
        // format labels to YYYY-MM-DD format
        const labels = formatChartLabels(rawLabels);
        // parse data to object format
        labels.forEach((l, i) => {
          publicData.push({
            label: l,
            value: values[i],
            trend: trend[i],
          });
        });
        const output = {
          labels,
          values,
          trend,
        };
        const l = output.labels;
        const v = output.values;
        const t = output.trend;
        const latestOutput = {
          labels: [
            l[l.length - 1],
            l[l.length - 367],
            l[l.length - 1828],
            l[l.length - 3654],
          ],
          values: [
            v[v.length - 1],
            v[v.length - 367],
            v[v.length - 1828],
            v[v.length - 3654],
          ],
          trend: [
            t[t.length - 1],
            t[t.length - 367],
            t[t.length - 1828],
            t[t.length - 3654],
          ],
        };
        updateDataset("daily_co2", output);
        updateDataset("latest_co2", latestOutput);
        updatePublicDataset("co2_daily_public", publicData);
        c.end();
      });
    });
  });
});

exports.readAnnualCO2GL = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_annmean_gl.txt`, function (err, stream) {
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
        updateDataset("annual_co2_gl", output);
        updatePublicDataset("co2_annual_gl_public", publicData);
        c.end();
      });
    });
  });
});
exports.readAnnualCO2ML = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_annmean_mlo.txt`, function (err, stream) {
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
        updateDataset("annual_co2_ml", output);
        updatePublicDataset("co2_annual_ml_public", publicData);
        c.end();
      });
    });
  });
});

//
//  -------------------------  W O R K B E N CH  ---------------------------------
//

exports.readAnnualCO2IncreaseGL = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_gr_gl.txt`, function (err, stream) {
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
        updateDataset("annual_co2_increase_gl", output);
        updatePublicDataset("co2__increase_gl_public", publicData);
        c.end();
      });
    });
  });
});
exports.readAnnualCO2IncreaseML = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_gr_mlo.txt`, function (err, stream) {
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
        updateDataset("annual_co2_increase_ml", output);
        updatePublicDataset("co2_increase_ml_public", publicData);
        c.end();
      });
    });
  });
});
exports.readMonthlyCO2ML = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_mm_mlo.txt`, function (err, stream) {
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
        // parse txt data
        const data = parseTXT(content);
        data.forEach((set) => {
          rawLabels.push(`${set[0]}-${set[1]}`);
          values.push(parseFloat(set[3]));
          trend.push(parseFloat(set[4]));
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

        updateDataset("monthly_co2_ml", output);
        updatePublicDataset("co2_monthly_ml_public", publicData);
        c.end();
      });
    });
  });
});
exports.readMonthlyCO2GL = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_mm_gl.txt`, function (err, stream) {
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
        // parse txt data
        const data = parseTXT(content);
        data.forEach((set) => {
          rawLabels.push(`${set[0]}-${set[1]}`);
          values.push(parseFloat(set[3]));
          trend.push(parseFloat(set[4]));
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
        updateDataset("monthly_co2_gl", output);
        updatePublicDataset("co2_monthly_gl_public", publicData);
        c.end();
      });
    });
  });
});
exports.readWeeklyCO2 = catchError(async () => {
  const c = new FTPClient();
  c.connect({
    host,
  });
  c.on("ready", function () {
    logger.log("connected to ftp...");
    c.get(`${path}co2_weekly_mlo.txt`, function (err, stream) {
      if (err) throw err;
      let content = "";
      stream.on("data", function (chunk) {
        content += chunk.toString();
      });
      stream.on("end", function () {
        const publicData = [];
        const rawLabels = [];
        const values = [];
        const since1800 = [];
        // parse txt data
        const data = parseTXT(content);
        data.forEach((set) => {
          rawLabels.push(`${set[0]}-${set[1]}-${set[2]}`);
          values.push(parseFloat(set[4]));
          since1800.push(parseFloat(set[8]));
        });
        // format labels
        const labels = formatChartLabels(rawLabels);
        // parse object data
        labels.forEach((l, i) => {
          publicData.push({
            label: l,
            value: values[i],
            since1800: since1800[i],
          });
        });

        const output = { labels, values, since1800 };

        updateDataset("weekly_co2", output);
        updatePublicDataset("co2_weekly_public", publicData);
        c.end();
      });
    });
  });
});
