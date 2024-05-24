import { Hono } from 'hono'
import { Client } from 'pg'
import { Logger } from 'winston'
import { MongoClient } from 'mongodb'
import type { Context, TypedResponse } from 'hono'

export type HonoBindings = {
	mongodb: MongoClient
	pgdb: Client
	logger: Logger
}
export type AppRouter = Hono<{ Bindings: HonoBindings }, {}, ''>

export function createRouter(): AppRouter {
	return new Hono<{ Bindings: HonoBindings }>({
		strict: false,
	})
}

interface RequestResult {
  success?: any
  error?: any
}

export const sendBadRequest = (
	result: RequestResult,
	c: Context
):
	| (Response &
		TypedResponse<{
			message: string
		}>)
	| undefined => {
	if (!result.success) {
		const logger = c.get('logger')
		logger.error(result.error)
		return c.json(
			{
				message: 'Bad request',
			},
			400
		)
	}
}