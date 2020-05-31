const catchError = require("../utilities/catchError")
const AppError = require("../utilities/appError")

exports.protect = catchError(async (req, res, next) => {
  // check if token provided
  let token = req.headers.authorization
  if (!token || token !== process.env.ROUTE_TOKEN) {
    return next(new AppError("Route protected, authorization required", 401))
  }

  next()
})
