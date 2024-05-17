import { createRouter } from '#utils/hono'
import { HTTPException } from 'hono/http-exception'
import { pgPool } from '#services/db'
import { MongoClient } from 'mongodb'

import winston_logger from '#services/logger'
import { logger } from './middlewares/logger'
import { sessionMiddleware } from './middlewares/session'
import setRoutes from './routes'

const app = createRouter()

app.use('*', logger())
app.use('*', async (c, next) => {
	console.log('here')
	c.set('pgPool', pgPool)
	// c.set('mongodb', mongo)
	await next()
})


app.use('*', sessionMiddleware())

setRoutes(app)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
  // sentry.captureException(err)
  winston_logger.error(err.message, err)
  return c.json({ status: 'error', error: 'Unknown error..' }, 500)
})

export default app