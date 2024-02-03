import { createAdaptorServer } from '@hono/node-server'
import { clerkMiddleware } from '@hono/clerk-auth'
import { HTTPException } from 'hono/http-exception'
import { MongoClient } from 'mongodb'
import { createClient } from '@supabase/supabase-js'
import { Client } from 'pg'
import { logger } from './middlewares/logger'
import config from './config'
import { createRouter } from './services/hono'
import setRoutes from './routes'
import { winston_logger } from './services/winston_logger'

const port: number = Number(config.app.port) || 3000

const app = createRouter()
app.use('*', logger())
app.use('*', clerkMiddleware())

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
  winston_logger.error(err.message, err)
  return c.json({ status: 'error', error: 'Unknown error..' }, 500)
})

// Create a single supabase client for interacting with your database
const supabase = createClient(config.supabase.url, config.supabase.key)

const mongoClient = new MongoClient(config.mongodb.uri, {
  serverSelectionTimeoutMS: 5000,
})

process.stdout.write('🔌 connecting to mongo database...')

process.on('SIGINT', async () => {
  console.log('Received SIGINT. ')
  await mongoClient.close()

  process.exit(0)
})

Promise.all([/* pgClient.connect(), */ mongoClient.connect()])
  .then(
    (values) => {
      // const pgdb = values[0]
      const mongo = values[0]

      process.stdout.write(' connected !\n')
      app.use('*', async (c, next) => {
        c.set('supabase', supabase)
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
