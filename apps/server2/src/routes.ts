import { cors } from 'hono/cors'
import dicoRoutes from './api/dictionary'
import { AppRouter } from './services/hono'
import { winston_logger as logger } from './services/winston_logger'


function setRoutes( app:AppRouter ) {

  // wire up to the routes 
  app.use('/api/*', cors())

  logger.info("Adding routes")
  app.route('/api/dictionary', dicoRoutes)

  return app
}

export default setRoutes
