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
