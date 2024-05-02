import config from '#config'
import { createHttpException } from '#utils/createHttpException'
import type { Context } from 'hono'
import caches from './caches'
import { MongoCollection, DictionaryEntry } from '@kreyolopal/domain'

const findWord = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const user = c.get('user')

  const { word } = c.req.param()
  const aWord = word.trim()

  logger.info(`findWord  ${word}`)

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
          },
        ],
      },
    ],
  }

  try {
    const coll = client
      .db(config.mongodb.db)
      .collection(MongoCollection.reference)
    const nb_reference = await coll.countDocuments(filter)
    if (nb_reference !== 0) return c.json<boolean>(true, 200)

    const validated = client
      .db(config.mongodb.db)
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

const getWord = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')

  const { language, word } = c.req.param()
  const lang = language.toLowerCase().trim()
  const aWord = word.trim()

  logger.info(`getWord ${language} ${word}`)
  if (aWord.length === 0)
    return c.json(
      {
        message: 'Bad request',
      },
      400
    )

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
    const coll = client
      .db(config.mongodb.db)
      .collection(MongoCollection.reference)
    const cursor = coll.find(filter, { projection })
    let result = await cursor.toArray()
    cursor.close()
    let source = MongoCollection.reference

    if (result.length === 0) {
      logger.info(`${aWord} is not in reference collection`)

      const coll = client
        .db(config.mongodb.db)
        .collection(MongoCollection.validated)
      const cursor = coll.find(filter, { projection })
      result = await cursor.toArray()
      cursor.close()
      source = MongoCollection.validated

      if (result.length === 0) 
        return c.json({ error: 'Not Found.' }, 404)
    }

    const entry = result.filter((item) => item.docType == 'entry')
    const defs = result
      .filter((item) => item.docType == 'definition')
      .map((item) => ({ source: source, ...item }))

    const data = { ...entry[0], definitions: defs }
    caches.entries.set(word + '_' + lang, data)

    c.res.headers.append('Cache-Control', 'public, maxage=86400')

    c.status(200)
    return c.json<DictionaryEntry>(data)
  } catch (e: any) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}

const getSuggestion = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')

  const word = c.req.param('word')

  logger.info(`getSuggestion ${word}`)
  const value = caches.suggestions.get(word)
  if (value !== undefined) {
    logger.info(`value for ${word} is in cache`)
    c.res.headers.append('Cache-Control', 'public, maxage=86400')
    c.status(200)
    return c.json(value)
  }

  try {
    const regex = new RegExp(`^${word}`, 'i')
    logger.info(`calculating value for ${word}...`)

    // find entries
    const filterEnries = {
      entry: word,
      docType: 'entry',
    }

    const projection = {
      entry: 1,
      variations: 1,
    }

    const coll = client
      .db(config.mongodb.db)
      .collection(MongoCollection.reference)

    const vali = client
      .db(config.mongodb.db)
      .collection(MongoCollection.validated)

    // exact entry in reference
    let exact = await coll.findOne(filterEnries, { projection })
    if (exact === null) {
      logger.info('not in reference')
      exact = await vali.findOne(filterEnries, { projection })
    }

    // find variations
    const filterVariations = {
      variations: regex,
      docType: 'entry',
      // publishedAt: { $not: { $eq: null } },
    }

    let cursor = coll.find(filterVariations, { projection }).limit(24)
    const list = await cursor.toArray()
    cursor.close()

    cursor = vali.find(filterVariations, { projection }).limit(24)
    list.push(...(await cursor.toArray()))
    cursor.close()

    const unsorted =
      exact === null
        ? list
        : [exact, ...list.filter((x) => x.entry != exact.entry)]

    const result = unsorted
      .sort((a, b) => {
        if (a.entry === word) return -1
        if (b.entry === word) return 1

        if (regex.test(a.entry) && regex.test(b.entry)) {
          return b.length - a.length
        }

        if (regex.test(a.entry)) return -1
        if (regex.test(b.entry)) return 1

        return (
          b.variations.findIndex((i) => regex.test(i)) -
          a.variations.findIndex((i) => regex.test(i))
        )
      })
      .slice(0, 8)

    caches.suggestions.set(word, result)
    c.res.headers.append('Cache-Control', 'public, maxage=86400')
    c.status(200)
    return c.json<DictionaryEntry[]>(result)
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
  const client = c.get('mongodb')

  const { word } = c.req.param()
  const aWord = word.trim()

  logger.info(`getKreyolsFor  ${word}`)
  if (aWord.length === 0)
    return c.json(
      {
        message: 'Bad request',
      },
      400
    )

  try {
    let result = await client.db(config.mongodb.db).command({
      distinct: MongoCollection.reference,
      key: 'kreyol',
      query: { entry: aWord, docType: 'definition' },
    })

    if (result.values.length === 0) {
      result = await client.db(config.mongodb.db).command({
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

export default { findWord, getWord, getSuggestion, getKreyolsFor }
