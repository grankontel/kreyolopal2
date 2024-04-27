import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import handlers from './proposals.handlers'
import { SubmitEntrySchema } from '@kreyolopal/domain'

const paramGetWordSchema = z
  .object({
    language: z.enum(['gp', 'mq', 'GP', 'MQ']),
    word: z.string(),
  })
  .required()

const routes = createRouter()

routes.post('/', zValidator('json', SubmitEntrySchema, sendBadRequest), handlers.submitProposal)

// get specific word
routes.get(
    '/entry/:language/:word',
    zValidator('param', paramGetWordSchema, sendBadRequest),
    handlers.getProposedWord
  )
export default routes
