import { AppRouter } from "#utils/hono";
import { cors } from 'hono/cors'
import logger from '#services/logger'

import auth from './controllers/auth.routes'
import contact from './controllers/contact.routes'

function setRoutes(app: AppRouter) {
	app.use('/api/*', cors())
	
  logger.info('Adding routes')

	app.route('/api/auth', auth)
  app.route('/api/contact', contact)

  logger.info('All routes added')
  return app
}

export default setRoutes

