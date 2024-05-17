import config from '#config'
import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import type { DatabaseUser } from '#services/db'
import { getUserEnforcer } from '#services/permissions'
import { createHttpException } from '#utils/apiHelpers'
import { MongoCollection, SuggestItem } from '@kreyolopal/domain'

import caches from '#services/caches'

interface SuggestQueryItem extends SuggestItem {
	variations: string[]
}

const getSuggestion = async function (c: Context) {
	const logger = c.get('logger')
	const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const word = c.req.param('word')

	logger.info(`getSuggestion ${word}`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}

	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('read', 'dictionary')) {
		logger.debug('user does not have read dictionary permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

	const value = caches.suggestions.get(word)
  if (value !== undefined) {
    logger.info(`value for ${word} is in cache`)
    c.res.headers.append('Cache-Control', 'public, maxage=86400')
    c.status(200)
    return c.json(value)
  }

	const regex = new RegExp(`^${word}`, 'i')

	// find entries
	const filterEnries = {
		entry: regex,
		docType: 'entry',
	}

	const projection = {
		entry: 1,
		variations: 1,
		aliasOf: 1,
		_id: 0,
	}
	const coll = mongo
		.db(config.mongodb.database)
		.collection(MongoCollection.reference)

	const vali = mongo
		.db(config.mongodb.database)
		.collection(MongoCollection.validated)


	try {
		let cursor = coll.find<SuggestQueryItem>(filterEnries, { projection }).limit(24)
		const list: SuggestQueryItem[] = await (await cursor.toArray()).map((i) => ({...i, source: MongoCollection.reference}))
		cursor.close()

		cursor = vali.find<SuggestQueryItem>(filterEnries, { projection }).limit(24)
		list.push(...(await cursor.toArray()).map((i) => ({...i, source: MongoCollection.validated})))
		cursor.close()

		const result: SuggestItem[] = list
			.sort((a, b) => {
				if (a.entry === word) return -1
				if (b.entry === word) return 1

				if (regex.test(a.entry) && regex.test(b.entry)) {
					return b.entry.length - a.entry.length
				}

				if (regex.test(a.entry)) return -1
				if (regex.test(b.entry)) return 1

				return (
					b.variations.findIndex((i) => regex.test(i)) -
					a.variations.findIndex((i) => regex.test(i))
				)
			})
			.slice(0, 8).map((i) => ({
				entry: i.entry,
				source: i.source,
				aliasOf: i.aliasOf
			}))

		caches.suggestions.set(word, result)
		c.res.headers.append('Cache-Control', 'public, maxage=86400')

		return c.json(result, 200)

	} catch (e: any) {
		logger.error(e.message)
		throw createHttpException({
			errorContent: { error: 'Unknown error..' },
			status: 500,
			statusText: 'Unknown error.',
		})
	}

}

export default { getSuggestion }