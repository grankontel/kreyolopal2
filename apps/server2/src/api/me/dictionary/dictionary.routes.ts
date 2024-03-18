import { createRouter, sendBadRequest } from '#services/hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import handlers from './dictionary.handlers'


const postTextSchema = z
	.object({
		kreyol: z
			.string()
			.min(3)
			.max(31)
			.regex(/^[a-z]{2}$/),
		rank: z.number().int().nonnegative(),
		text: z.string().trim().min(3)
	})
	.required()

const myDicoRoutes = createRouter()

// get specific word
myDicoRoutes.get('/:word', handlers.getWord)

myDicoRoutes.put('/:word', handlers.bookmarkWord)

myDicoRoutes.post('/:word/usage', zValidator('json', postTextSchema, sendBadRequest),handlers.addUsage)

export default myDicoRoutes

