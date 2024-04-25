import { createRouter, sendBadRequest } from '#services/hono'
import { zValidator } from '@hono/zod-validator'
import handlers from './proposals.handlers'
import { SubmitEntrySchema } from '@kreyolopal/domain'

const routes = createRouter()

routes.post('/', zValidator('json', SubmitEntrySchema, sendBadRequest), handlers.submitProposal)

export default routes
