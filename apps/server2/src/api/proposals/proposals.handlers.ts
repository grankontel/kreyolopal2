import type { Context } from 'hono'
import { MongoClient } from 'mongodb'
import config from '#config'
import { SubmitEntry } from '@kreyolopal/domain'

const submitProposal = async function (c: Context) {
  const logger = c.get('logger')
  const mongo: MongoClient = c.get('mongodb')
  const user = c.get('user')

  logger.info(`submitProposal `)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const entry:SubmitEntry = c.req.valid('json')
	logger.debug(entry)

	return c.json({ message: 'ok' })
}

export default { submitProposal }