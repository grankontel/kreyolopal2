import config from '#config'
import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import type { DatabaseUser } from '#services/db'
import { getUserEnforcer } from '#services/permissions'
import { _decodeURI, createHttpException } from '#utils/apiHelpers'
import { MongoCollection, SuggestItem, DictionaryEntry, DictionaryFullEntry } from '@kreyolopal/domain'
import type { RestrictedDefinitionSource } from '@kreyolopal/domain'

import caches from '#services/caches'

interface SuggestQueryItem extends SuggestItem {
	variations: string[]
}

const getSuggestion = async function (c: Context) {
	const logger = c.get('logger')
	const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const word = _decodeURI(c.req.param('word').trim())

	logger.info(`dictionary.getSuggestion ${word}`)

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
		const list: SuggestQueryItem[] = await (await cursor.toArray()).map((i) => ({ ...i, source: MongoCollection.reference }))
		cursor.close()

		cursor = vali.find<SuggestQueryItem>(filterEnries, { projection }).limit(24)
		list.push(...(await cursor.toArray()).map((i) => ({ ...i, source: MongoCollection.validated })))
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

const getWord = async function (c: Context) {
	const logger = c.get('logger')
	const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const { language, word } = c.req.param()
	const lang = language.toLowerCase().trim()
	const aWord = _decodeURI(word.trim())

	logger.info(`dictionary.getWord ${language} ${aWord}`)
	if (aWord.length === 0)
		return c.json({ message: 'Bad request', }, 400)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}

	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('read', 'dictionary')) {
		logger.debug('user does not have read dictionary permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

	const value = caches.entries.get(word + '_' + lang)
	if (value !== undefined) {
		logger.info(`value for ${word}_${lang} is in cache`)
		c.res.headers.append('Cache-Control', 'public, maxage=86400')
		c.status(200)
		return c.json(value)
	}

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

		const coll = mongo
			.db(config.mongodb.database)
			.collection(MongoCollection.reference)
		const cursor = coll.find(filter, { projection })
		let result = await cursor.toArray()
		cursor.close()
		let source: RestrictedDefinitionSource = MongoCollection.reference

		if (result.length === 0) {
			logger.info(`${aWord} is not in reference collection`)

			const coll = mongo
				.db(config.mongodb.database)
				.collection(MongoCollection.validated)
			const cursor = coll.find(filter, { projection })
			result = await cursor.toArray()
			cursor.close()
			source = MongoCollection.validated

			if (result.length === 0)
				return c.json({ error: 'Not Found.' }, 404)
		}

		logger.info(`${aWord} is in ${source} collection`)
		const entry: DictionaryEntry = result.filter((item) => item.docType == 'entry').pop()

		if (entry.aliasOf) {
			logger.info(`${aWord} is an alias of ${entry.aliasOf}`)
			caches.entries.set(word + '_' + lang, entry)

			c.res.headers.append('Cache-Control', 'public, maxage=86400')
			return c.json(entry, 200)
		}

		const defs = result
			.filter((item) => item.docType == 'definition')
			.map((item) => ({ source: source, ...item }))

		const data: DictionaryFullEntry = { ...entry, definitions: defs }
		caches.entries.set(word + '_' + lang, data)

		c.res.headers.append('Cache-Control', 'public, maxage=86400')

		c.status(200)
		return c.json(data)

	} catch (e: any) {
		logger.error(e.message)
		throw createHttpException({
			errorContent: { error: 'Unknown error..' },
			status: 500,
			statusText: 'Unknown error.',
		})
	}


}

const findWord = async function (c: Context) {
	const logger = c.get('logger')
	const client = c.get('mongodb')
	const user = c.get('user')

	const { word } = c.req.param()
	const aWord = _decodeURI(word.trim())

	logger.info(`dictionary.findWord  ${word}`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}

	if (aWord.length === 0)
		return c.json({ message: 'Bad request', }, 400)

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
					},
				],
			},
		],
	}

	try {
		const coll = client
			.db(config.mongodb.database)
			.collection(MongoCollection.reference)
		const nb_reference = await coll.countDocuments(filter)
		if (nb_reference !== 0) return c.json<boolean>(true, 200)

		const validated = client
			.db(config.mongodb.database)
			.collection(MongoCollection.validated)
		const nb_validated = await validated.countDocuments(filter)

		return c.json<boolean>(nb_validated > 0, nb_validated > 0 ? 200 : 404)
	} catch (e: any) {
		logger.error(e.message)
		throw createHttpException({
			errorContent: { error: 'Unknown error..' },
			status: 500,
			statusText: 'Unknown error.',
		})
	}
}

const getKreyolsFor = async function (c: Context) {
  const logger = c.get('logger')
  const mongo: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')


  const { word } = c.req.param()
	const aWord = _decodeURI(word.trim())


	logger.info(`dictionary.getKreyolsFor  ${aWord}`)
	if (aWord.length === 0)
		return c.json({ message: 'Bad request', }, 400)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}

	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('read', 'dictionary')) {
		logger.debug('user does not have read dictionary permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

  try {
    let result = await mongo.db(config.mongodb.database).command({
      distinct: MongoCollection.reference,
      key: 'kreyol',
      query: { entry: aWord, docType: 'definition' },
    })

    if (result.values.length === 0) {
      result = await mongo.db(config.mongodb.database).command({
        distinct: MongoCollection.validated,
        key: 'kreyol',
        query: { entry: aWord, docType: 'definition' },
      })
    }
    c.status(200)
    return c.json(result.values)
  } catch (e: any) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}


export default { getSuggestion, getWord, findWord, getKreyolsFor }