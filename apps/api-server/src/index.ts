import { createAdaptorServer } from '@hono/node-server'
import config from './config'
import app from './app'
import winston_logger from '#services/logger'
import { setDefaultPermissions } from '#services/def_perm'

const port: number = Number(config.app.port) || 3000

/* const mongoClient = new MongoClient(config.mongodb.uri, {
  serverSelectionTimeoutMS: 5000,
})
 */
/* winston_logger.info('👮 Ensure default permissions are set...')
Promise.all([
	setDefaultPermissions(),
])
 */
winston_logger.info('🔌 connecting to mongo database...')

process.on('SIGINT', async () => {
  console.log('Received SIGINT. ')
  // await Promise.all([mongoClient.close(), pgPool.end()])

  process.exit(0)
})

winston_logger.info(
	`\n🚀 Your server is ready on http://localhost:${port}\n\n`
)

const server = createAdaptorServer({
	fetch: app.fetch,
	port: port,
})

server.listen(port)
