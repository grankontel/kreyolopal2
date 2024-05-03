import { createRouter, sendBadRequest } from '#services/hono'
import { zValidator } from '@hono/zod-validator'
import handlers from './me.handlers'
import { changePasswordSchema } from '@kreyolopal/domain'

const routes = createRouter()

// get specific word
routes.get('/', handlers.getUserInfo)

routes.post('/updatepwd',
zValidator('json', changePasswordSchema, sendBadRequest),
handlers.updatePassword)
export default routes
