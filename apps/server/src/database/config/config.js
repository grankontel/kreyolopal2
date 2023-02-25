require('dotenv').config()
const logger = require('../../services/logger')

module.exports = {
  development: {
    username: process.env.DEV_POSTGRES_USERNAME,
    password: process.env.DEV_POSTGRES_PASSWORD,
    database: process.env.DEV_POSTGRES_DB,
    host: process.env.DEV_POSTGRES_HOST,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
  },
  test: {
    username: process.env.DEV_POSTGRES_USERNAME,
    password: process.env.DEV_POSTGRES_PASSWORD,
    database: process.env.TEST_POSTGRES_DB,
    host: process.env.DEV_POSTGRES_HOST,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
  },
  production: {
    username: process.env.PROD_POSTGRES_USERNAME,
    password: process.env.PROD_POSTGRES_PASSWORD,
    database: process.env.PROD_POSTGRES_DB,
    host: process.env.PROD_POSTGRES_HOST,
    /*     native: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }, */
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
  },
}
