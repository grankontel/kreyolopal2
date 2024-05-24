import { createRouter, sendBadRequest } from '#utils/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { SubmitEntrySchema } from '@kreyolopal/domain'
import * as schema from './schema'
import handlers from './handlers'

const routes = createRouter()

routes.post(
  '/',
  zValidator('json', SubmitEntrySchema, sendBadRequest),
  handlers.submitProposal
)

// get specific word
routes.get(
  '/entry/:language/:word',
  zValidator('param', schema.paramGetWordSchema, sendBadRequest),
  handlers.getProposedWord
)

routes.post(
  '/validate/:entry',
  zValidator('param', z.object({ entry: z.string().min(1) }), sendBadRequest),
  zValidator('json', schema.postValiddateSchema, sendBadRequest),
  handlers.validateProposal
)

export default routes
