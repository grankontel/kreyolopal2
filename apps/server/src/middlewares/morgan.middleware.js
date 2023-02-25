const morgan = require('morgan')
import logger from '../services/logger'

// create a stream object with a 'write' function that will be used by `morgan`
const stream = {
  write: (message) => {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  },
}

const morganMiddleware = morgan('combined', { stream: stream })

export default morganMiddleware
