import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import handlers from './dictionary.handlers'

const queryListSchema = z
	.object({
		offset: z.coerce.number().int().nonnegative().optional(),
		limit: z.coerce.number().int().nonnegative().optional(),
	})

const postTextSchema = z
	.object({
		kreyol: z
			.string()
			.min(2)
			.regex(/^[a-z]{2}$/),
		rank: z.number().int().nonnegative(),
		text: z.string().trim().min(3)
	})
	.required()

const myDicoRoutes = createRouter()

//get list of words
// GET http://localhost:5010/api/me/dictionary/?limit=20&offset=100
myDicoRoutes.get('/', zValidator('query', queryListSchema, sendBadRequest), handlers.listWords)

// get specific word
myDicoRoutes.get('/:word', handlers.getWord)

myDicoRoutes.put('/:word', handlers.bookmarkWord)

myDicoRoutes.post('/:word/usage', zValidator('json', postTextSchema, sendBadRequest), c => handlers.addSubField(c, 'usage'))

myDicoRoutes.post('/:word/synonyms', zValidator('json', postTextSchema, sendBadRequest), c => handlers.addSubField(c, 'synonyms'))

myDicoRoutes.post('/:word/confer', zValidator('json', postTextSchema, sendBadRequest), handlers.addConfer)

export default myDicoRoutes

