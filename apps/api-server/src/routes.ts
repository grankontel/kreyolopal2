import { AppRouter } from "#utils/hono";
import { cors } from 'hono/cors'
import logger from '#services/logger'

import auth from './controllers/auth.routes'
import contact from './controllers/contact.routes'
import dictionary from './controllers/dictionary.routes'
import health from './controllers/health.routes'
import lexicons from './controllers/lexicons/routes'
import me from './controllers/me/routes'
import myDico from './controllers/me/dictionary.routes'
import spellcheck from "./controllers/spellcheck"
import proposals from './controllers/proposals/proposals.routes'
import verify from './controllers/verify'

function setRoutes(app: AppRouter) {
	app.use('/api/*', cors())
	
  logger.info('Adding routes')

	app.route('/api/auth', auth)
  app.route('/api/dictionary', dictionary)
  app.route('/api/contact', contact)
  app.route('/api/health', health)
  app.route('/api/lexicons', lexicons)
  app.route('/api/me', me)
  app.route('/api/me/dictionary', myDico)
  app.route('/api/spellcheck', spellcheck)
  app.route('/api/proposals', proposals)
  app.route('/api/verify', verify)

  logger.info('All routes added')
  return app
}

export default setRoutes

