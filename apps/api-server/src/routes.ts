import { AppRouter } from "#utils/hono";
import { cors } from 'hono/cors'
import logger from '#services/logger'

import auth from './controllers/auth.routes'
import contact from './controllers/contact.routes'
import dictionary from './controllers/dictionary.routes'
import health from './controllers/health.routes'
import lexicons from './controllers/lexicons/routes'

function setRoutes(app: AppRouter) {
	app.use('/api/*', cors())
	
  logger.info('Adding routes')

	app.route('/api/auth', auth)
  app.route('/api/dictionary', dictionary)
  app.route('/api/contact', contact)
  app.route('/api/health', health)
  app.route('/api/lexicons', lexicons)

  logger.info('All routes added')
  return app
}

export default setRoutes

