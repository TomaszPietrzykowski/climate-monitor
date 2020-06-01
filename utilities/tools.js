exports.parseTXT = (string) => {
  const parentArray = string.split("\n")
  const dataArray = parentArray
    .filter((row) => !row.includes("#"))
    .filter((el) => el[0] !== "%")
  const data = []
  dataArray.forEach((el) => {
    const set = el
      .trim()
      .split(" ")
      .filter((s) => s !== "")

    if (set[0]) {
      data.push(set)
    }
  })
  return data
}
