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

dicoRoutes.get('/check/:word', handlers.findWord)

// get available kreyol for a word
dicoRoutes.get('/kreyolsfor/:word', handlers.getKreyolsFor)

export default dicoRoutes