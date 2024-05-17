import { createAdaptorServer } from '@hono/node-server'
import config from './config'
import app from './app'

const port: number = Number(config.app.port) || 3000

process.stdout.write(
	`\n🚀 Your server is ready on http://localhost:${port}\n\n`
)

const server = createAdaptorServer({
	fetch: app.fetch,
	port: port,
})

server.listen(port)
