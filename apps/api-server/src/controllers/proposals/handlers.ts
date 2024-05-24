import config from '#config'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { MongoClient } from 'mongodb'
import type { DatabaseUser } from '#services/db'
import { getUserEnforcer } from '#services/permissions'
import { Ulid } from 'id128'
import { createHttpException } from '#utils/apiHelpers'
import { MongoCollection, sanitizeSubmitEntry } from '@kreyolopal/domain'
import type { BaseEntry,  ProposalDefinition, ProposalEntry } from '@kreyolopal/domain'

const submitProposal = async function (c: Context) {
	const logger = c.get('logger')
	const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	logger.info(`submitProposal `)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}
	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('submit', 'proposals')) {
		logger.debug('user does not have submit proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
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

	const coll = mongo.db(config.mongodb.database).collection(MongoCollection.proposals)

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

		const resultEntry: ProposalEntry = { ...existingEntry, definitions }
		return c.json(resultEntry)
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

	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('read', 'proposals')) {
		logger.debug('user does not have read proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
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
			.db(config.mongodb.database)
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

const validateProposal = async function (c: Context) {
	const logger = c.get('logger')
	const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const { entry: srcEntry } = c.req.param()
	const {
		variations: srcVar,
		definitions,
	}: { variations: string[]; definitions: string[] } = c.req.valid('json')

	const entry = srcEntry.trim()
	let variations = srcVar.map((item) => item.trim().toLowerCase())
	if (!variations.includes(entry))
		variations = [entry, ...variations]

	const aWord = entry.trim()

	logger.info(`validateProposal for ${entry}`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}
	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('validate', 'proposals')) {
		logger.debug('user does not have validate proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

	//	throw new Error('not implemented')

	const proposal = mongo
		.db(config.mongodb.database)
		.collection(MongoCollection.proposals)

	//find entry in proposal
	const filter = { entry: aWord, docType: 'entry' }

	const found = await proposal.countDocuments(filter)
	logger.debug(`found ${found} entries for ${aWord}`)

	if (found === 0) return c.json({ error: 'Not Found.' }, 404)

	const session = mongo.startSession()
	let nbAdded = 0
	let ids: string[] = []

	try {
		logger.info('start transaction')
		await session.withTransaction(async () => {
			const proposal = mongo
				.db(config.mongodb.database)
				.collection(MongoCollection.proposals)
			const validated = mongo
				.db(config.mongodb.database)
				.collection(MongoCollection.validated)

			const newEntry = {
				entry: entry,
				docType: 'entry',
			}

			logger.debug('try to add new entry')
			await validated.updateOne(
				newEntry,
				{ $set: { variations } },
				{ upsert: true, session: session }
			)
			logger.info('added new entry')

			logger.debug('try to add aliases')
			variations.filter((item) => item !== entry).forEach(async (item) => {
				const alias = {
					entry: item,
					docType: 'entry',
				}
				logger.debug(JSON.stringify(alias))
				await validated.updateOne(
					alias,
					{ $set: [{ variations }, { aliasOf: entry }] },
					{ upsert: true, session: session }
				)
			})
			logger.info('added aliases')

			// find documents
			const filter = {
				entry: entry,
				docType: 'definition',
				definition_id: { $in: definitions },
			}
			const defCursor = proposal.find(filter, {
				projection: { _id: 0 },
				session: session,
			})
			const docs = await defCursor.toArray()
			defCursor.close()

			logger.debug(docs.length)
			if (docs.length == 0) {
				throw createHttpException(
					{ error: 'Unprocessable Entity' },
					422,
					'Unprocessable Entity',
					`No valid definitions ids : ${definitions.join(',')}`
				)
			}
			ids = docs.map((doc) => doc.definition_id)

			const result = await validated.insertMany(docs, { session: session })
			nbAdded = result.insertedCount
			logger.info(`${nbAdded} documents added`)

			//delete documents
			await proposal.deleteMany({ entry: entry }, { session: session })
		})
		return c.json({ message: 'Entry validated.', nb: nbAdded, ids }, 200)
	} catch (e: any) {
		logger.error(e.message)
		if (e instanceof HTTPException) {
			throw e
		} else {
			throw createHttpException({
				errorContent: { error: 'Unknown error..' },
				status: 500,
				statusText: 'Unknown error.',
			})
		}
	} finally {
		logger.info('end transaction')
		await session.endSession()
	}
}

const listProposals = async function (c: Context) {
	const logger = c.get('logger')
	const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')
	const { limit = 20, offset = 0 } = c.req.valid('query')
  const pagesize = Math.min(limit, config.app.pageSize)

	logger.info(`listProposals`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}
	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('submit', 'proposals')) {
		logger.debug('user does not have submit proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}


	try {
		const filter = {}
		const projection = {
			_id: 0,
		}
    // const client = getClient()
    const coll = mongo
      .db(config.mongodb.database)
      .collection(MongoCollection.proposals)
    const cursor = coll
      .find(filter, { projection })
      .skip(offset)
      .limit(pagesize)
    const result = await cursor.toArray()
    cursor.close()

    const data: ProposalEntry[] = result?.map((item) => {
/*       const def_object = item.definitions.reduce((obj, v) => {
        obj[v.kreyol] = obj[v.kreyol] || []
        obj[v.kreyol].push(v)
        return obj
      }, Object.create(null)) */

      return {
        id: item._id,
        entry: item.entry,
				docType: item.docType,
        variations: item.variations,
        definitions: item.definitions,
      }
    })

    if (data.length > 0) {
      const nb = await mongo
        .db(config.mongodb.database)
        .collection(MongoCollection.proposals)
        .countDocuments(filter)
      const endRange = Math.min(nb, offset + limit)
      c.res.headers.append('Cache-Control', 'private, maxage=86400')
      c.res.headers.append(
        'Access-Control-Expose-Headers',
        'X-Total-Count, Content-Range'
      )
      c.res.headers.append('Content-Range', `${offset}-${endRange}/${nb}`)
      c.res.headers.append('X-Total-Count', nb)

      c.status(200)
      return c.json<ProposalEntry[]>(data)
    }

    return c.json([], 200)
  } catch (e: any) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }

}

export default {
	submitProposal,
	getProposedWord,
	validateProposal,
	listProposals,
}
