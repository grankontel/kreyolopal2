import config from '#config'
import { createHttpException } from '#utils/createHttpException'
import type { Context } from 'hono'
import { LRUCache } from 'lru-cache'

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
    definition_id: 0,
  }

  try {
    const coll = client.db(config.mongodb.db).collection('reference')
    const cursor = coll.find(filter, { projection })
    const result = await cursor.toArray()
    if (result.length === 0) return c.json({ error: 'Not Found.' }, 404)

    const entry = result.filter((item) => item.docType == 'entry')
    const defs = result.filter((item) => item.docType == 'definition')

    const data = { ...entry[0], definitions: defs }

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

interface WordSuggestion {
  entry: string
  docType: 'entry'
  variations: string[]
}

const suggestionCache = new LRUCache<string, WordSuggestion[]>({
  max: 50,
})

const getSuggestion = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')

  const word = c.req.param('word')

  logger.info(`getSuggestion ${word}`)
  const value = suggestionCache.get(word)
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

    const coll = client.db(config.mongodb.db).collection('reference')
    const cursorE = coll.find(filterEnries, { projection })
    const exact = await cursorE.toArray()
    cursorE.close()

    // find variations
    const filterVariations = {
      variations: regex,
      docType: 'entry',
      // publishedAt: { $not: { $eq: null } },
    }

    const cursor = coll.find(filterVariations, { projection }).limit(24)
    const list = await cursor.toArray()
    cursor.close()
    const unsorted =
      exact.length === 0
        ? list
        : [exact[0], ...list.filter((x) => x.entry != exact[0].entry)]

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

    suggestionCache.set(word, result)
    c.res.headers.append('Cache-Control', 'public, maxage=86400')
    c.status(200)
    return c.json(result)
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
    const result = await client.db(config.mongodb.db).command({
      distinct: 'reference',
      key: 'kreyol',
      query: { entry: aWord, docType: 'definition' },
    })
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

export default { getWord, getSuggestion, getKreyolsFor }
