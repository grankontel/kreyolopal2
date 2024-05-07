import winston from 'winston'
const SlackHook = require('winston-slack-webhook-transport')

import config from '../config'

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info

    const ts = timestamp.slice(0, 19).replace('T', ' ')
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`
  })
)

const standardObjectFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

// console options
const options = {
  console: {
    level: config.log.level,
    format: config.log.prettyPrint
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

if (!config.slack.noSend)
  transports.push(
    new SlackHook({ level: 'warn', webhookUrl: config.slack.webhook })
  )

/* export const winston_logger = winston.createLogger({
    transports: [

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.json(),
            )
        })]
})
 */

export const winston_logger = winston.createLogger({
  transports,
  exitOnError: false, // do not exit on handled exceptions
})
