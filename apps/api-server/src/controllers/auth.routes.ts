import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema, signupSchema } from '@kreyolopal/domain'
import handlers from './auth.handlers'

const authRoutes = createRouter()

// login
authRoutes.post(
  '/login',
  zValidator('json', loginSchema, sendBadRequest),
  handlers.login
)

// logout
authRoutes.post('/logout', handlers.logout)

// signup
authRoutes.post(
  '/signup',
  zValidator('json', signupSchema, sendBadRequest),
  handlers.signup
)

export default authRoutes
