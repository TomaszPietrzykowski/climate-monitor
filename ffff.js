const logger = require("./Logger")

logger.log("Pierwszy log")
logger.log("Kolejny log")
logger.log("Nastepny jakis event na serverze...")

logger.show("26-2-2023")

setTimeout(() => {
  logger.show()
}, 3000)
