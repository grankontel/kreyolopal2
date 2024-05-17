import { z } from 'zod'

export const queryListSchema = z.object({
	offset: z.coerce.number().int().nonnegative().optional(),
	limit: z.coerce.number().int().nonnegative().optional(),
})

const slugCheck = z.string().regex(/^[a-z]+([a-z0-9]|-)*$/)

export const paramUsername = z.object({
	username: z.string().trim().min(3),
})

export const paramLexiconId = z
	.object({
		id: z.string().uuid(),
	})
	.required()

export const paramSlug = z
	.object({
		username: z.string().trim().min(3),
		slug: slugCheck,
	})
	.required()

export const postLexiconSchema = z.object({
	name: z.string().trim().min(2),
	slug: slugCheck,
	description: z.string(),
	is_private: z.boolean(),
})

export const paramLexiconEntry = z
	.object({
		username: z.string().trim().min(3),
		slug: slugCheck,
		language: z.enum(['gp', 'mq', 'GP', 'MQ']),
		word: z.string(),
	})
	.required()

export const addDefinitionSchema = z.object({
	entry: z.string().trim().min(1),
	definitions: z
		.array(
			z.object({
				source: z.enum(['reference', 'validated']),
				id: z.string().trim().min(1),
			})
		)
		.nonempty(),
})
