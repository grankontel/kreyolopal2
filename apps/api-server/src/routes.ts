import { AppRouter } from "#utils/hono";
import { cors } from 'hono/cors'
import auth from './controllers/auth.routes'
import logger from '#services/logger'
function setRoutes(app: AppRouter) {
	app.use('/api/*', cors())
	
  logger.info('Adding routes')

	app.route('/api/auth', auth)

  logger.info('All routes added')
  return app
}

export default setRoutes

