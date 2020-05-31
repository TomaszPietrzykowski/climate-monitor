module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next) // simplified: err => next(err)
  }
}
