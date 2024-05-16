import { cors } from 'hono/cors'
import authRoutes from './api/auth'
import dicoRoutes from './api/dictionary'
import wordsRoutes from './api/words'
import spellRoutes from './api/spellcheck'
import myDicoRoutes from './api/me/dictionary'
import meRoutes from './api/me'
import contactRoutes from './api/contact'
import healthRoutes from './api/health'
import verifyRoutes from './api/verify'
import lexiconsRoutes from './api/lexicons'
import proposalsRoutes from './api/proposals'

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
  app.route('/api/lexicons', lexiconsRoutes)

  app.route('/api/me', meRoutes)
  app.route('/api/me/dictionary', myDicoRoutes)
  app.route('/api/contact', contactRoutes)
  app.route('/api/verify', verifyRoutes)
  app.route('/api/proposals', proposalsRoutes)

  logger.info('All routes added')

  return app
}

export default setRoutes
