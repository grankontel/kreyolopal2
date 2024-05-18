import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import * as schema from './schema'
import handlers from './handlers'
import entriesHandlers from './entries.handlers'
import { queryListSchema } from '#utils/apiHelpers'

const routes = createRouter()

routes.post(
  '/',
  zValidator('json', schema.postLexiconSchema, sendBadRequest),
  handlers.addLexicon
)

routes.put(
  '/:id',
  zValidator('param', schema.paramLexiconId, sendBadRequest),
  zValidator('json', schema.postLexiconSchema, sendBadRequest),
  handlers.editLexicon
)

routes.get(
  '/:username/:slug',
  zValidator('param', schema.paramSlug, sendBadRequest),
  handlers.getLexicon
)

routes.delete(
  '/:id',
  zValidator('param', schema.paramLexiconId, sendBadRequest),
  handlers.deleteLexicon
)

routes.get(
  '/:username',
  zValidator('param', schema.paramUsername, sendBadRequest),
  handlers.getAllLexicons
)

routes.get(
  '/:username/:slug/entry/:language/:word',
  zValidator('param', schema.paramLexiconEntry, sendBadRequest),
  entriesHandlers.getLexiconEntry
)

routes.put(
  '/:id/definition',
  zValidator('param', schema.paramLexiconId, sendBadRequest),
  zValidator('json', schema.addDefinitionSchema, sendBadRequest),
  entriesHandlers.addDefinitions
)

routes.get(
  '/:username/:slug/entries',
  zValidator('param', schema.paramSlug, sendBadRequest),
  zValidator('query', queryListSchema, sendBadRequest),
  entriesHandlers.listEntries
)

export default routes