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

const paramVoteSchema = z
  .object({
    entry: z.string().min(1),
    definition_id: z.string().min(1),
  })
  .required()

const routes = createRouter()

routes.post(
  '/',
  zValidator('json', SubmitEntrySchema, sendBadRequest),
  handlers.submitProposal
)

// get specific word
routes.get(
  '/entry/:language/:word',
  zValidator('param', paramGetWordSchema, sendBadRequest),
  handlers.getProposedWord
)

// votes
routes.get(
  '/votes/:entry/:definition_id',
  zValidator('param', paramVoteSchema, sendBadRequest),
  handlers.getVotes
)

// upvote
routes.get(
  '/votes/:entry/:definition_id/up',
  zValidator('param', paramVoteSchema, sendBadRequest),
  handlers.upvote
)

// downvote
routes.get(
  '/votes/:entry/:definition_id/down',
  zValidator('param', paramVoteSchema, sendBadRequest),
  handlers.downvote
)

export default routes
