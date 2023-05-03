import { Context } from 'hono'
import config from '../../config'
import { createHttpException } from '../../utils/createHttpException'

const getWord = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')

  const { language, word } = c.req.param()

  logger.info(`getWord ${language} ${word}`)

  try {
    const filter = {
      entry: word,
    }
    const projection = {
      entry: 1,
      variations: 1,
      definitions: 1,
    }

    // const client = getClient()
    const coll = client.db(config.mongodb.db).collection('words')
    const cursor = coll.find(filter, { projection })
    const result = await cursor.toArray()
    //client.close()

    const data = result.map((item) => {
      return {
        id: item._id,
        entry: item.entry,
        variations: item.variations,
        definitions: item.definitions[language],
      }
    })

    if (data.length > 0) {
      c.res.headers.append('Cache-Control', 's-maxage=86400')

      c.status(200)
      return c.json(data)
    }

    return c.json( { error: 'Not Found.' }, 404)

  } catch (e) {
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
  try {
    const regex = new RegExp(`^${word}`, 'i')

    const filter = {
      variations: regex,
      // publishedAt: { $not: { $eq: null } },
    }
    const projection = {
      entry: 1,
      variations: 1,
    }

    const sort = {
      variations: 1,
    }

    const coll = client.db(config.mongodb.db).collection('words')
    const cursor = coll.find(filter, { projection }).sort(sort).limit(8)
    const unsorted = await cursor.toArray()

    const result = unsorted.sort((a, b) => {
      if (regex.test(a.entry) && regex.test(b.entry)) {
        return a.length - b.length
      }

      if (regex.test(a.entry)) return -1
      if (regex.test(b.entry)) return 1

      return (
        a.variations.findIndex((i) => regex.test(i)) -
        b.variations.findIndex((i) => regex.test(i))
      )
    })

    c.status(200)
    return c.json(result)
  } catch (e) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}

export default { getWord, getSuggestion }