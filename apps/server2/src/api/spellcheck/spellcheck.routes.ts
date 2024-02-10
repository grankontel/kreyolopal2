import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createRouter, sendBadRequest } from '#services/hono'
import myHandlers from './spellcheck.handlers'

const myRoutes = createRouter()

const postSpellCheckSchema = z
  .object({
    kreyol: z.enum(['GP', 'MQ']),
    request: z.string(),
  })
  .required()

const postRatingSchema = z
  .object({
    rating: z.number().int().min(0).max(5),
    user_correction: z.string(),
    user_notes: z.string(),
  })
  .partial({
    user_correction: true,
    user_notes: true,
  })

const postRatingParam = z.object({
  id: z.string().uuid(),
})

myRoutes.post(
  '/',
  zValidator('json', postSpellCheckSchema, sendBadRequest),
  myHandlers.postSpellCheck
)

// get spellChecks
myRoutes.get('/', myHandlers.getSpellChecks)

// rate spellchecking
myRoutes.post(
  '/:id/rating',
  zValidator('param', postRatingParam, sendBadRequest),
  zValidator('json', postRatingSchema, sendBadRequest),
  myHandlers.postRating
)

export default myRoutes
