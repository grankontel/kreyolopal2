import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import handlers from './dictionary.handlers'

const dicoRoutes = createRouter()

// get suggestion
dicoRoutes.get('/suggest/:word', handlers.getSuggestion)

const paramGetWordSchema = z
  .object({
    language: z.enum(['gp', 'mq', 'GP', 'MQ']),
    word: z.string(),
  })
  .required()

// get specific word
dicoRoutes.get(
  '/entry/:language/:word',
  zValidator('param', paramGetWordSchema, sendBadRequest),
  handlers.getWord
)
export default dicoRoutes