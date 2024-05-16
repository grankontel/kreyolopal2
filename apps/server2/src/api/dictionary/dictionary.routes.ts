import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import dicoHandlers from './dictionary.handlers'

const dicoRoutes = createRouter()
// get suggestion
dicoRoutes.get('/suggest/:word', dicoHandlers.getSuggestion)

dicoRoutes.get('/check/:word', dicoHandlers.findWord)

// get available kreyol for a word
dicoRoutes.get('/kreyolsfor/:word', dicoHandlers.getKreyolsFor)

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
  dicoHandlers.getWord
)

export default dicoRoutes
