import { createAdaptorServer } from '@hono/node-server'
import config from './config'
import hono from './app'
import winston_logger from '#services/logger'
import { setDefaultPermissions } from '#services/def_perm'

const port: number = Number(config.app.port) || 3000

/* winston_logger.info('👮 Ensure default permissions are set...')
Promise.all([
	setDefaultPermissions(),
])
 */

process.on('SIGINT', async () => {
	console.log('Received SIGINT. ')
	// await Promise.all([mongoClient.close(), pgPool.end()])

	process.exit(0)
})

Promise.all([hono]).then(([app]) => {
	winston_logger.info(
		`🚀 Your server is ready on http://localhost:${port}\n\n`
	)

	const server = createAdaptorServer({
		fetch: app.fetch,
		port: port,
	})

	server.listen(port)
})

