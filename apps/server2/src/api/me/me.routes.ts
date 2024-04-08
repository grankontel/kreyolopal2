import { createRouter, sendBadRequest } from '#services/hono'
import handlers from './me.handlers'

const routes = createRouter()

// get specific word
routes.get('/', handlers.getUserInfo)

export default routes
