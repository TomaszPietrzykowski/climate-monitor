exports.parseTXT = (string) => {
  const parentArray = string.split("\n");
  const dataArray = parentArray
    .filter((row) => !row.includes("#"))
    .filter((el) => el[0] !== "%")
    .filter((el) => !el.includes("HDR"))
    .filter((el) => !el.includes("-999.99"))
    .filter((el) => !el.includes("NaN"));
  const data = [];
  dataArray.forEach((el) => {
    const set = el
      .trim()
      .split(" ")
      .filter((s) => s !== "");

    if (set[0]) {
      data.push(set);
    }
  });
  return data;
};
exports.formatChartLabels = (labels) => {
  const newArray = labels.map((label) => {
    if (label.length === 4) {
      return label;
    } else {
      const arr = label.split("-");
      const m = arr[1].length === 2 ? arr[1] : `0${arr[1]}`;
      let d = "";
      if (arr[2]) {
        d = arr[2].length === 2 ? arr[2] : `0${arr[2]}`;
      }
      const output =
        arr.length === 2
          ? `${arr[0]}-${m}`
          : arr.length === 3
          ? `${arr[0]}-${m}-${d}`
          : label;
      return output;
    }
  });

  return newArray;
};
exports.validateDateQueryScope = (dataArray, query) => {
  //constructors
  const min = new Date(dataArray[0].label);
  const max = new Date(dataArray[dataArray.length - 1].label);
  const date = new Date(query);
  // validate
  if (
    date.getTime() === min.getTime() ||
    date.getTime() === max.getTime() ||
    (date > min && date < max)
  ) {
    return true;
  } else {
    return false;
  }
};
exports.parseAnnualData = (streamContent) => {
  const publicData = [];
  const rawLabels = [];
  const values = [];
  // parse txt data
  const data = this.parseTXT(streamContent);
  data.forEach((set) => {
    rawLabels.push(set[0]);
    values.push(parseFloat(set[1]));
  });
  // format labels
  const labels = this.formatChartLabels(rawLabels);
  // parse object data
  labels.forEach((l, i) => {
    publicData.push({
      label: l,
      value: values[i],
    });
  });
  const output = { chart: { labels, values }, public: publicData };
  return output;
};
exports.parseMonthlyData = (streamContent) => {
  const publicData = [];
  const rawLabels = [];
  const values = [];
  const trend = [];

  const data = this.parseTXT(streamContent);
  data.forEach((set) => {
    rawLabels.push(`${set[0]}-${set[1]}`);
    values.push(parseFloat(set[3]));
    trend.push(parseFloat(set[5]));
  });

  // format labels
  const labels = this.formatChartLabels(rawLabels);
  // parse object data
  labels.forEach((l, i) => {
    publicData.push({
      label: l,
      value: values[i],
      trend: trend[i],
    });
  });

  const output = { chart: { labels, values, trend }, public: publicData };

  return output;
};
