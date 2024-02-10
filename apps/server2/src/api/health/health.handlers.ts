import { pgPool } from '#lib/db'
import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import config from '#config'
import { lucia } from '#lib/auth'
const pdata = require('../../../package.json')

const ping = async function (c: Context) {
  const logger = c.get('logger')
  logger.debug('ping')
  return c.text('pong', 200)
}

const healthcheck = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb') as MongoClient
  logger.debug('healthcheck')

  const response = {
    status: 'pass',
    version: '1',
    releaseId: pdata.version,
    notes: [''],
    output: '',
    description: pdata.description,
  }
  const database = {
    status: 'pass',
    componentType: 'datastore',
    // time: '2020-05-19T03:42:55+01:00',
  }

  const mongodb = {
    status: 'pass',
    componentType: 'datastore',
  }

  const postgrest = {
    status: 'pass',
    componentType: 'component',
  }
  logger.info('checking postgrest')

  await fetch(config.db.health, { method: 'HEAD' })
    .then(
      (result) => {
        postgrest.status = result.ok ? 'pass' : 'warn'
      },
      (reason) => {
        logger.error(reason)
        postgrest.status = 'warn'
      }
    )
    .catch((error) => {
      logger.error(error)
      postgrest.status = 'warn'
    })

  response.status = postgrest.status

  logger.info('checking postgresql')
  try {
    // Use the connection pool to acquire a connection
    const client = await pgPool.connect()
    // Release the connection back to the pool
    database.status = client.readyForQuery ? 'pass' : 'warn'
    logger.debug('postgresql is responding')

    client.release()
  } catch (err) {
    database.status = 'fail'
    response.status = 'fail'
  }

  logger.info('checking mongodb')
  client
    .connect()
    .then(
      () => {
        logger.debug('mongodb is ok')
        mongodb.status = 'pass'
      },
      (reason) => {
        logger.error(reason)
        mongodb.status = 'fail'
        response.status = 'fail'
      }
    )
    .catch((error) => {
      logger.error(error)
      mongodb.status = 'fail'
      response.status = 'fail'
    })

  if (database.status === 'pass') {
    logger.info('delete expired sessions')
    try {
      await lucia.deleteExpiredSessions()
    } catch (error) {
      logger.error(error)
    }
  }
  const data = {
    ...response,
    checks: { postgresql: database, mongodb, postgrest },
  }
  c.header('Content-type', 'application/health+json')
  return c.body(JSON.stringify(data), 200)
}

export default { ping, healthcheck }
