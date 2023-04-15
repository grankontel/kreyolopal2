import { createAdaptorServer, serve } from '@hono/node-server'
import { HTTPException } from 'hono/http-exception'
import { MongoClient } from 'mongodb'
import { logger } from './middlewares/logger'
import config from './config'
import { createRouter } from './services/hono'
import setRoutes from './routes'
import { winston_logger } from './services/winston_logger'
import { createHttpException } from './utils/createHttpException'

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
  throw createHttpException({
    errorContent: { error: 'Unknown error..' },
    status: 500,
    statusText: 'Unknown error.',
  })
})

const mongoClient = new MongoClient(config.mongodb.uri, {
  serverSelectionTimeoutMS: 5000,
})

process.stdout.write('🔌 connecting to mongo database...')

mongoClient
  .connect()
  .then(
    (mongo) => {
      process.stdout.write(' connected !\n')

      app.use('*', async (c, next) => {
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
      process.stdout.write(`\n❌ Cannot connect to mongo : ${reason}\n\n`)
      process.exit(1)
    }
  )
  .catch((error) => {
    process.stderr.write(error)
    process.exit(1)
  })
