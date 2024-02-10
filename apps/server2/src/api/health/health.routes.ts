import { createRouter } from '#services/hono'
import handlers from './health.handlers'

const myRoutes = createRouter()

myRoutes.get('/ping', handlers.ping)
myRoutes.get('/healthcheck', handlers.healthcheck)

export default myRoutes
