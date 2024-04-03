import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import handlers from './lexicons.handlers'

const slugCheck = z.string().regex(/^[a-z]+([a-z0-9]|-)*$/)
const paramSlug = z
	.object({
		username: z.string().trim().min(3),
		slug: slugCheck,
	})
	.required()

const postLexiconSchema = z
	.object({
		name: z.string().trim().min(2),
		slug: slugCheck,
		"description": z.string(),
		"is_private": z.boolean()
	})

const routes = createRouter()

routes.post('/', zValidator('json', postLexiconSchema, sendBadRequest), 
handlers.addLexicon)
routes.get('/:username/:slug', zValidator('param', paramSlug, sendBadRequest),
	handlers.getLexicon)
/*
	routes.get('/:username/:slug/entries', zValidator('param', paramSlug, sendBadRequest), 
	handlers.listEntries)
routes.get('/:username/:slug/suggest/:word', handlers.suggestWord)
*/
export default routes
