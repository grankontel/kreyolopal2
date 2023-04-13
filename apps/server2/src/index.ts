import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { MongoClient } from "mongodb";
import { logger } from './middlewares/logger'
import config from './config';

const port:number = Number(config.app.port) || 3000

const app = new Hono()
app.use('*', logger())

app.get('/', (c) => c.json({ message: 'Hello!' }))

console.log(config.mongodb.uri)
const mongoClient = new MongoClient(config.mongodb.uri, {
    serverSelectionTimeoutMS: 5000,
  });

  process.stdout.write('🔌 connecting to mongo database...')

  mongoClient.connect()
  .then(() => {
    process.stdout.write(' connected !\n')

    process.stdout.write(
        `\n🚀 Your server is ready on http://localhost:${port}\n\n`
      )

    serve({
        fetch: app.fetch,
        port: port,
    })

  },
  reason => {
    process.stdout.write(`\n❌ Cannot connect to mongo : ${reason}\n\n`)
    process.exit(1)

  }).catch((error) => {
    console.log(error)
    process.exit(1)
  }) 