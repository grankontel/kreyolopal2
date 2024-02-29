import { createAdaptorServer } from '@hono/node-server'
import { HTTPException } from 'hono/http-exception'
import { MongoClient } from 'mongodb'
import config from './config'
import { logger } from './middlewares/logger'
import { createRouter } from '#services/hono'
import setRoutes from './routes'
import { winston_logger } from '#services/winston_logger'
import { pgPool } from './lib/db'
import { csrfMiddleware } from './middlewares/csrf'
import { sessionMiddleware } from './middlewares/session'
import { adminMiddleware } from './middlewares/admin'

const port: number = Number(config.app.port) || 3000

const app = createRouter()
app.use('*', logger())
// app.use('*', csrfMiddleware())
app.use('*', sessionMiddleware())
app.use('/api/admin/*', adminMiddleware())

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
  winston_logger.error(err.message, err)
  return c.json({ status: 'error', error: 'Unknown error..' }, 500)
})

const mongoClient = new MongoClient(config.mongodb.uri, {
  serverSelectionTimeoutMS: 5000,
})

process.stdout.write('🔌 connecting to mongo database...')

process.on('SIGINT', async () => {
  console.log('Received SIGINT. ')
  await Promise.all([mongoClient.close(), pgPool.end()])

  process.exit(0)
})

Promise.all([mongoClient.connect()])
  .then(
    (values) => {
      //const pgdb = values[0]
      const mongo = values[0]

      process.stdout.write(' connected !\n')
      app.use('*', async (c, next) => {
        c.set('pgPool', pgPool)
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
    }
  )
  .catch((error) => {
    process.stderr.write(error)
    process.exit(1)
  })
