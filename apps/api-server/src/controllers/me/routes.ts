import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { changePasswordSchema } from '@kreyolopal/domain'
import handlers from './handlers'

const routes = createRouter()

// get specific word
routes.get('/', handlers.getUserInfo)

routes.post(
  '/updatepwd',
  zValidator('json', changePasswordSchema, sendBadRequest),
  handlers.updatePassword
)
export default routes
