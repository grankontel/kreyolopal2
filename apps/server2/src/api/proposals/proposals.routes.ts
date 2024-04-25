import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import handlers from './proposals.handlers'
import { SubmitDefinitionSchema } from '@kreyolopal/domain'

const routes = createRouter()

routes.post('/', zValidator('json', SubmitDefinitionSchema, sendBadRequest), handlers.submitProposal)

export default routes
