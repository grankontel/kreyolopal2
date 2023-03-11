// const { MongoClient } = require('mongodb')
import config from '../../config'
import logger from '../../services/logger'
import { getClient } from '../../services/mongo'

const getWord = async function (req, res) {
  const language = req.params.language
  const word = req.params.word

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

    const client = getClient()
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
      res.set('Cache-Control', 's-maxage=86400')
      res.set('Content-Type', 'application/json')
      return res.status(200).send(data)
    }

    return res.status(404).send({ error: 'Not found.' })
  } catch (e) {
    logger.error(e.message)
    res.status(500).send({ error: 'Unknown error.' })
  }
}

const getSuggestion = async function (req, res) {
  const word = req.params.word
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

    const client = getClient()
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

    res.set('Content-Type', 'application/json')
    res.status(200).send(result)
  } catch (e) {
    logger.error(e.message)
    res.status(500).send({ error: 'Problem fetching books.' })
  }
}

export default { getWord, getSuggestion }
