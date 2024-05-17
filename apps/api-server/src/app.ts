import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import winston_logger from '#services/logger'
import { logger } from './middlewares/logger'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

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

app.get('/', (c) => c.text('Hono!'))

export default app