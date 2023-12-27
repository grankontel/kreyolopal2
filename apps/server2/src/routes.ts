import { cors } from 'hono/cors'
import dicoRoutes from './api/dictionary'
import wordsRoutes from "./api/words";
import authRoutes from './api/auth/auth.routes';
import { AppRouter } from './services/hono'
import { winston_logger as logger } from './services/winston_logger'


function setRoutes( app:AppRouter ) {

  // wire up to the routes 
  app.use('/api/*', cors())

  logger.info("Adding routes")
  app.route('/api/dictionary', dicoRoutes)
  app.route('/api/words', wordsRoutes)
  app.route('/api/auth', authRoutes)

  return app
}

export default setRoutes
