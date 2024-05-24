import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'

import * as schema from './schema'
import handlers from './vote.handlers'

const routes = createRouter()

// votes
routes.get(
  '/:entry/:definition_id',
  zValidator('param', schema.paramVoteSchema, sendBadRequest),
  handlers.getVotes
)

// upvote
routes.put(
  '/:entry/:definition_id/up',
  zValidator('param', schema.paramVoteSchema, sendBadRequest),
  handlers.upvote
)

// downvote
routes.put(
  '/:entry/:definition_id/down',
  zValidator('param', schema.paramVoteSchema, sendBadRequest),
  handlers.downvote
)

export default routes
