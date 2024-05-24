import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { queryListSchema } from '#utils/apiHelpers'
import handlers from './dictionary.handlers'

const postTextSchema = z
  .object({
    kreyol: z
      .string()
      .min(2)
      .regex(/^[a-z]{2}$/),
    rank: z.number().int().nonnegative(),
    text: z.string().trim().min(3),
  })
  .required()

const routes = createRouter()

//get list of words
// GET http://localhost:5010/api/me/dictionary/?limit=20&offset=100
routes.get(
  '/',
  zValidator('query', queryListSchema, sendBadRequest),
  handlers.listWords
)

// get specific word
routes.get('/:word', handlers.getWord)

routes.put('/:word', handlers.bookmarkWord)

routes.post(
  '/:word/usage',
  zValidator('json', postTextSchema, sendBadRequest),
  (c) => handlers.addSubField(c, 'usage')
)

routes.post(
  '/:word/synonyms',
  zValidator('json', postTextSchema, sendBadRequest),
  (c) => handlers.addSubField(c, 'synonyms')
)

routes.post(
  '/:word/confer',
  zValidator('json', postTextSchema, sendBadRequest),
  handlers.addConfer
)

export default routes
