import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import handlers from './dictionary.handlers'


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
myDicoRoutes.get('/', handlers.listWords)

// get specific word
myDicoRoutes.get('/:word', handlers.getWord)

myDicoRoutes.put('/:word', handlers.bookmarkWord)

myDicoRoutes.post('/:word/usage', zValidator('json', postTextSchema, sendBadRequest), c => handlers.addSubField(c, 'usage'))

myDicoRoutes.post('/:word/synonyms', zValidator('json', postTextSchema, sendBadRequest), c => handlers.addSubField(c, 'synonyms'))

export default myDicoRoutes

