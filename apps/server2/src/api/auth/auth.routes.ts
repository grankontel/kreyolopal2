import { createRouter, sendBadRequest } from '#services/hono'
import handlers from './auth.handlers'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const postLoginSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/),
    password: z.string().trim().min(8).max(200),
  })
  .required()

const postSignupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/, 'invalid username'),
    password: z.string().trim().min(8).max(200),
    firstname: z.string().trim().min(2),
    lastname: z.string().trim().min(2),
    email: z.string().email(),
  })
  .required()

const authRoutes = createRouter()
// login
authRoutes.post(
  '/login',
  zValidator('json', postLoginSchema, sendBadRequest),
  handlers.login
)
// logout
authRoutes.post('/logout', handlers.logout)
// signup
authRoutes.post(
  '/signup',
  zValidator('json', postSignupSchema, sendBadRequest),
  handlers.signup
)

export default authRoutes
