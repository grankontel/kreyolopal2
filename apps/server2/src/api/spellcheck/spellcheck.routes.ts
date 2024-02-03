import { Context } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createRouter } from '#services/hono'
import myHandlers from './spellcheck.handlers'

const myRoutes = createRouter()

const sendBadRequest = (result: any, c: Context) => {
  if (!result.success) {
    const logger = c.get('logger')
    logger.error(result.error)
    return c.text('Bad request', 400)
  }
}

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
  id: z
    .string()
    .transform((v) => parseInt(v))
    .refine((v) => !isNaN(v), { message: 'not a number' }),
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
