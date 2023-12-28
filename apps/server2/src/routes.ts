import { cors } from 'hono/cors'
import dicoRoutes from './api/dictionary'
import wordsRoutes from "./api/words";
import { AppRouter } from './services/hono'
import { winston_logger as logger } from './services/winston_logger'


function setRoutes( app:AppRouter ) {

  // wire up to the routes 
  app.use('/api/*', cors())

  logger.info("Adding routes")
  app.route('/api/dictionary', dicoRoutes)
  app.route('/api/words', wordsRoutes)
 
  return app
}

export default setRoutes
