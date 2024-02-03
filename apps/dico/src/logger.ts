import winston from 'winston'

const config = {
  level: process.env.LOGLEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
}
const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info

    const ts = timestamp.slice(0, 19).replace('T', ' ')
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`
  })
)

const standardObjectFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

const options = {
  console: {
    level: config.level,
    format: config.prettyPrint
      ? alignedWithColorsAndTime
      : standardObjectFormat, // alignedWithColorsAndTime,
  },
}

const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console(options.console),
  /*
    // Allow to print all the error level messages inside the error.log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Allow to print all the error message inside the all.log file
    // (also the error log that are also printed inside the error.log(
    new winston.transports.File({ filename: 'logs/all.log' }),
  */
]

export const logger = winston.createLogger({
  transports,
  exitOnError: false, // do not exit on handled exceptions
})
