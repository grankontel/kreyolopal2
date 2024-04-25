import type { Context } from 'hono'
import { MongoClient } from 'mongodb'
import config from '#config'
import { createHttpException } from '#utils/createHttpException'
import { sanitizeSubmitEntry, BaseEntry, MongoCollection, SubmitEntry, ProposalDefinition } from '@kreyolopal/domain'
import { DatabaseUser } from '#lib/db'
import { Ulid } from 'id128'

const submitProposal = async function (c: Context) {
  const logger = c.get('logger')
  const mongo: MongoClient = c.get('mongodb')
  const user: DatabaseUser = c.get('user')

  logger.info(`submitProposal `)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  let body: SubmitEntry = sanitizeSubmitEntry(c.req.valid('json'))
  const definitions: ProposalDefinition[] = body.definitions.map((def) => {
    const id = Ulid.generate()
    return {
      ...def,
      creator: user.id,
      docType: 'definition',
      definition_id: Ulid.toCanonical(id),
      rank: 0,
      upvoters: [{ user: user.id, birthdate: user.birth_date }],
      downvoters: []
    }
  })

  logger.debug(JSON.stringify(body))
  logger.debug(JSON.stringify(definitions))

  const coll = mongo
    .db(config.mongodb.db)
    .collection(MongoCollection.proposals)

  try {
    const filter = { entry: body.entry, docType: "entry" }
    let existingEntry = await coll.findOne<BaseEntry>(filter)

    if (existingEntry === null) {
      logger.info(`need to create entry for ${body.entry}`)
      existingEntry = {
        entry: body.entry,
        docType: "entry",
        variations: body.variations

      }

      await coll.insertOne(existingEntry)
    } else {
      logger.debug(JSON.stringify(existingEntry))

      logger.info(`need to update entry for ${body.entry}`)
      // clean variations array
      existingEntry.variations = [existingEntry.entry, ...existingEntry.variations, ...body.variations].filter((val, index, self) =>
        self.indexOf(val) === index)

      logger.debug(JSON.stringify(existingEntry))
      await coll.updateOne(filter, {
        $set: existingEntry,
      })
    }

    const result = await coll.insertMany(definitions)
    logger.info(`inserted ${result.insertedCount} definitions`)
    return c.json({ message: 'ok' })

  } catch (e: any) {
    console.log(e)
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }

}

export default { submitProposal }