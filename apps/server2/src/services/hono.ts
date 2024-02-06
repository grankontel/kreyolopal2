import { Hono } from 'hono'
import { MongoClient } from 'mongodb'
import { Client } from 'pg'
import { Logger } from 'winston'
import type {Context} from 'hono'

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

export const sendBadRequest = (result: never, c: Context) => {
  if (!result.success) {
    const logger = c.get('logger')
    logger.error(result.error)
    return c.text('Bad request', 400)
  }
}