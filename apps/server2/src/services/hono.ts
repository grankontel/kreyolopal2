import { Hono } from 'hono'
import { MongoClient } from 'mongodb'
import { Client } from 'pg'
import { Logger } from 'winston'

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
