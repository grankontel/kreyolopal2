import { createAdaptorServer } from '@hono/node-server'
import { HTTPException } from 'hono/http-exception'
import { MongoClient } from 'mongodb'
import { Client } from 'pg'
import { logger } from './middlewares/logger'
import config from './config'
import { createRouter } from './services/hono'
import setRoutes from './routes'
import { winston_logger } from './services/winston_logger'

const port: number = Number(config.app.port) || 3000

const app = createRouter()
app.use('*', logger())

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
  winston_logger.error(err.message, err)
  return c.json({ status: 'error',error: 'Unknown error..' }, 500)
})

const pgClient = new Client({
  user: config.db.username,
  password: config.db.password,
  host:config.db.host,
  port: config.db.port,
  database: config.db.database,
  connectionTimeoutMillis: 5000,
})

const mongoClient = new MongoClient(config.mongodb.uri, {
  serverSelectionTimeoutMS: 5000,
})

process.stdout.write('🔌 connecting to mongo database...')

Promise.all([pgClient.connect(), mongoClient.connect()])
.then((values) => {
  const pgdb = values[0]
  const mongo = values[1]

  process.stdout.write(' connected !\n')
  app.use('*', async (c, next) => {
    c.set('pgdb', pgdb)
    c.set('mongodb', mongo)
    c.set('logger', winston_logger)
    await next()
  })

  setRoutes(app)
  app.showRoutes()

  process.stdout.write(
    `\n🚀 Your server is ready on http://localhost:${port}\n\n`
  )

  const server = createAdaptorServer({
    fetch: app.fetch,
    port: port,
  })

  server.listen(port)
},
(reason) => {
  console.log(config.db)
  console.log(reason)
  process.stdout.write(`\n❌ Cannot connect to mongo : ${reason}\n\n`)
  process.exit(1)
})
.catch((error) => {
  process.stderr.write(error)
  process.exit(1)
})

