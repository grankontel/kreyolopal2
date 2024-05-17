import { createRouter } from '#utils/hono'
import { HTTPException } from 'hono/http-exception'
import { pgPool } from '#services/db'
import { MongoClient } from 'mongodb'

import winston_logger from '#services/logger'
import { logger } from './middlewares/logger'
import { sessionMiddleware } from './middlewares/session'
import setRoutes from './routes'
import config from '#config'

const mongoClient = new MongoClient(config.mongodb.uri, {
  serverSelectionTimeoutMS: 5000,
})

winston_logger.info('🔌 connecting to mongo database...')

const app = Promise.all([mongoClient.connect()])
  .then(
    (values) => {
      //const pgdb = values[0]
      const mongo = values[0]

      winston_logger.info(' connected !\n')
      const app = createRouter()

      app.use('*', logger())
      app.use('*', async (c, next) => {
        c.set('pgPool', pgPool)
        c.set('mongodb', mongo)
        await next()
      })
      app.use('*', sessionMiddleware())

      setRoutes(app)
      // app.showRoutes()

      app.onError((err, c) => {
        if (err instanceof HTTPException) {
          // Get the custom response
          return err.getResponse()
        }
        //...
        // sentry.captureException(err)
        winston_logger.error(err.message, err)
        return c.json({ status: 'error', error: 'Unknown error..' }, 500)
      })

      return app
    },
    (reason) => {
      console.log(config.mongodb.uri)
      console.log(reason)
      process.stdout.write(`\n❌ Cannot connect to mongo : ${reason}\n\n`)
      process.exit(1)
    }
  )
  .catch((error) => {
    process.stderr.write(error)
    process.exit(1)
  })


export default app