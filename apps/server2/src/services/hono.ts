import { Hono } from 'hono'
import { MongoClient } from 'mongodb'
import { Client } from 'pg'
import { Logger } from 'winston'
import type { Context, TypedResponse } from 'hono'

export type HonoVariables = {
  mongodb: MongoClient
  pgdb: Client
  logger: Logger
}

export type AppRouter = Hono<{ Variables: HonoVariables }, {}, ''>

export function createRouter(): AppRouter {
  return new Hono<{ Variables: HonoVariables }>({
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
