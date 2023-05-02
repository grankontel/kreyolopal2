import { Hono } from 'hono'
import { MongoClient } from 'mongodb'
import { Logger } from 'winston'

export type HonoVariables = {
  mongodb: MongoClient
  logger: Logger
}

export type AppRouter = Hono<{ Variables: HonoVariables }, {}, ''>

export function createRouter(): AppRouter {
  return new Hono<{ Variables: HonoVariables }>({
    strict: false,
  })
}
