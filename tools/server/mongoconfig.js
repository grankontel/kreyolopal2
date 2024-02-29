require('dotenv').config({ path: `${__dirname}/.env` })

const config = {
  mongodb: {
    // uri: process.env.MONGODB_URI,
    host: process.env.MONGODB_HOST,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    db: process.env.MONGODB_DB,
    port: Number(process.env.MONGODB_PORT || 27017),
  },
}

config.mongodb.uri = `mongodb://${config.mongodb.user}:${encodeURIComponent(
  config.mongodb.password
)}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`

module.exports = config
