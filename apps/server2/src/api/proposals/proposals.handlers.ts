import type { Context } from 'hono'
import { MongoClient } from 'mongodb'
import config from '#config'
import { createHttpException } from '#utils/createHttpException'
import {
  sanitizeSubmitEntry,
  BaseEntry,
  MongoCollection,
  ProposalDefinition,
  ProposalEntry,
} from '@kreyolopal/domain'
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

  const body = sanitizeSubmitEntry(c.req.valid('json'))
  const definitions: ProposalDefinition[] = body.definitions.map((def) => {
    const id = Ulid.generate()
    return {
      creator: user.id,
      entry: body.entry,
      docType: 'definition',
      definition_id: Ulid.toCanonical(id),
      rank: 0,
      ...def,
      upvoters: [{ user: user.id, birthdate: user.birth_date }],
      downvoters: [],
      quotes: [],
    }
  })

  logger.debug(JSON.stringify(body))
  logger.debug(JSON.stringify(definitions))

  const coll = mongo.db(config.mongodb.db).collection(MongoCollection.proposals)

  try {
    const filter = { entry: body.entry, docType: 'entry' }
    let existingEntry = await coll.findOne<BaseEntry>(filter)

    if (existingEntry === null) {
      logger.info(`need to create entry for ${body.entry}`)
      existingEntry = {
        entry: body.entry,
        docType: 'entry',
        variations: body.variations,
      }

      await coll.insertOne(existingEntry)
    } else {
      logger.debug(JSON.stringify(existingEntry))

      logger.info(`need to update entry for ${body.entry}`)
      // clean variations array
      existingEntry.variations = [
        existingEntry.entry,
        ...existingEntry.variations,
        ...body.variations,
      ].filter((val, index, self) => self.indexOf(val) === index)

      logger.debug(JSON.stringify(existingEntry))
      await coll.updateOne(filter, {
        $set: existingEntry,
      })
    }

    const result = await coll.insertMany(definitions)
    logger.info(`inserted ${result.insertedCount} definitions`)

    existingEntry.definitions = definitions
    return c.json(existingEntry)
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

const getProposedWord = async function (c: Context) {
  const logger = c.get('logger')
  const client: MongoClient = c.get('mongodb')
  const user: DatabaseUser = c.get('user')

  const { language, word } = c.req.param()
  const lang = language.toLowerCase().trim()
  const aWord = word.trim()

  logger.info(`getProposedWord ${language} ${word}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  if (aWord.length === 0)
    return c.json(
      {
        message: 'Bad request',
      },
      400
    )

  const filter = {
    $and: [
      {
        entry: aWord,
      },
      {
        $or: [
          {
            docType: 'entry',
          },
          {
            docType: 'definition',
            kreyol: lang,
          },
        ],
      },
    ],
  }
  const projection = {
    _id: 0,
  }

  try {
    const coll = client
      .db(config.mongodb.db)
      .collection(MongoCollection.proposals)
    const cursor = coll.find(filter, { projection })
    const result = await cursor.toArray()
    cursor.close()
    if (result.length === 0) return c.json({ error: 'Not Found.' }, 404)

    const entry = result.filter((item) => item.docType == 'entry')
    const defs = result
      .filter((item) => item.docType == 'definition')
      .map((item) => ({ source: MongoCollection.proposals, ...item }))

    const data = { ...entry[0], definitions: defs }

    c.res.headers.append('Cache-Control', 'public, maxage=86400')

    c.status(200)
    return c.json<ProposalEntry>(data)
  } catch (e: any) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}
export default { submitProposal, getProposedWord }
