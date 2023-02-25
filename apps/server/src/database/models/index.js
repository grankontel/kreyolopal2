require('dotenv').config()

const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const dbconfig = require('../config/config')
const config = dbconfig[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

const _model00 = require('./rating')(sequelize, Sequelize.DataTypes)
const _model01 = require('./spellchecked')(sequelize, Sequelize.DataTypes)
const _model02 = require('./user')(sequelize, Sequelize.DataTypes)

;[_model00, _model01, _model02].forEach((model) => {
  db[model.name] = model
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
