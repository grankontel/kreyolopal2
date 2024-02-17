import { createRouter, sendBadRequest } from '#services/hono'
import handlers from './contact.handlers'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const postContactSchema = z
  .object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(1),
  })
  .required()

const contactRoutes = createRouter()
// contact
contactRoutes.post(
  '/',
  zValidator('json', postContactSchema, sendBadRequest),
  handlers.contact
)

export default contactRoutes
