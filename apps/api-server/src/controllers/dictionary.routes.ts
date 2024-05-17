import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'

import handlers from './dictionary.handlers'

const dicoRoutes = createRouter()
// get suggestion
dicoRoutes.get('/suggest/:word', handlers.getSuggestion)

export default dicoRoutes