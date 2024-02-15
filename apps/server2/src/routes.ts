import { cors } from 'hono/cors'
import authRoutes from './api/auth'
import dicoRoutes from './api/dictionary'
import wordsRoutes from './api/words'
import spellRoutes from './api/spellcheck'
import myDicoRoutes from './api/me/dictionary'
import contactRoutes from './api/contact/contact.routes'
import healthRoutes from './api/health/health.routes'

import { AppRouter } from '#services/hono'
import { winston_logger as logger } from '#services/winston_logger'

function setRoutes(app: AppRouter) {
  // wire up to the routes
  app.use('/api/*', cors())

  logger.info('Adding routes')
  app.route('/api/health', healthRoutes)
  app.route('/api/auth', authRoutes)
  app.route('/api/dictionary', dicoRoutes)
  app.route('/api/admin/words', wordsRoutes)
  app.route('/api/spellcheck', spellRoutes)

  app.route('/api/me/dictionary', myDicoRoutes)
  app.route('/api/contact', contactRoutes)

  logger.info('All routes added')

  return app
}

export default setRoutes
