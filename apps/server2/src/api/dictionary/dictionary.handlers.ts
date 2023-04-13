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

    throw createHttpException({
      errorContent: { error: 'Not found.' },
      status: 404,
      statusText: 'Not found.',
    })
  } catch (e) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}

export default { getWord /* getSuggestion */ }
