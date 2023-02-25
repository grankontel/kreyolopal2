const fs = require('fs')
import dbconfig from '../src/database/config/config.js'
const env = process.env.NODE_ENV || 'development'
const config = dbconfig[env]

fs.writeFileSync(
  './src/database/config/config.json',
  JSON.stringify(config, null, 4)
)
