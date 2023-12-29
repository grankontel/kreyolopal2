import { cors } from 'hono/cors'
import dicoRoutes from './api/dictionary'
import wordsRoutes from "./api/words";
import spellRoutes from './api/spellcheck';
import { AppRouter } from './services/hono'
import { winston_logger as logger } from './services/winston_logger'


function setRoutes( app:AppRouter ) {

  // wire up to the routes 
  app.use('/api/*', cors())

  logger.info("Adding routes")
  app.route('/api/dictionary', dicoRoutes)
  app.route('/api/words', wordsRoutes)
  app.route('/api/spellcheck', spellRoutes)

  logger.info("All routes added")

  return app
}

export default setRoutes
