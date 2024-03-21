import type { Context } from 'hono'
import config from '../../config'
import { createHttpException } from '../../utils/createHttpException'
import { ObjectId } from 'mongodb'

function toClient(obj) {
  obj.definitions.gp.forEach((def) => {
    //Rename fields
    def.id = def._id
    delete def._id
  })

  //Rename fields
  obj.id = obj._id
  delete obj._id

  return obj
}

//
const sanitizeEntry = (src) => {
  src.entry = src.entry.trim()
  src.variations = src.variations.map((item) => item.trim().toLowerCase())
  if (!src.variations.includes(src.entry))
    src.variations = src.variations.unshift(src.entry)

  Object.entries(src.definitions).forEach((item) => {
    const [, value] = item as [
      string,
      { nature: string[]; synonyms: string[] }[],
    ]
    value.forEach((el) => {
      el.nature = el.nature.map((item) => item.trim().toLowerCase())
      el.synonyms = el.synonyms.map((item) => item.trim().toLowerCase())
    })
  })
  return src
}

const getWords = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const { filter, range, sort } = c.req.query()

  let filterObj = {}
  let nbDocs = 0
  let [offset, limit] = [0, 10]
  const coll = client.db(config.mongodb.db).collection('words')

  if (filter) {
    try {
      logger.info(`filter = ${filter}`)
      filterObj = JSON.parse(filter)
      logger.info(`filtering on ${JSON.stringify(filterObj)}`)
      nbDocs = await coll.countDocuments(filterObj)
    } catch (e) {
      logger.error(`Error on parsing filter query elements : ${e}`)
    }
  } else {
    nbDocs = await coll.estimatedDocumentCount()
  }

  let findPromise = coll.find(filterObj)
  if (range) {
    try {
      logger.info(`range  = ${range}`)
        ;[offset, limit] = JSON.parse(range)
    } catch (e) {
      logger.error(`Error on parsing range query elements : ${e}`)
    }
  }

  const endRange = Math.min(nbDocs, offset + limit)
  logger.info(`range is from ${offset} to ${limit}`)
  findPromise = offset > 0 ? findPromise.skip(offset) : findPromise
  findPromise = findPromise.limit(limit)

  if (sort) {
    try {
      logger.info(`sort  = ${sort}`)
      const [field, order] = JSON.parse(sort)
      const sortObj = {}
      sortObj[field] = order == 'ASC' ? 1 : -1
      findPromise = findPromise.sort(sortObj)
      logger.info(`sorting by ${JSON.stringify(sortObj)}`)
    } catch (e) {
      logger.error(`Error on parsing sort query elements : ${e}`)
    }
  }
  return findPromise
    .toArray()
    .then(
      (results) => {
        if (results === null || results.length === 0)
          return c.json({ error: 'Not Found.' }, 404)

        c.res.headers.append('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');
        c.res.headers.append('Content-Range', `${offset}-${endRange}/${nbDocs}`)
        c.res.headers.append('X-Total-Count', nbDocs.toString())

        c.status(200)
        const data = results.map((x) => toClient(x))

        return c.json(data)
      },
      (reason) => {
        logger.error(reason)
        throw createHttpException({
          errorContent: { status: 'error', error: [reason] },
          status: 500,
          statusText: 'Unknown error.',
        })
      }
    )
    .catch((_error) => {
      logger.error(_error)
      throw createHttpException({
        errorContent: { status: 'error', error: [_error] },
        status: 500,
        statusText: 'Unknown error.',
      })
    })
}

const getOneWord = async function (c: Context) {
  const id = c.req.param('id')
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const coll = client.db(config.mongodb.db).collection('words')

  return coll
    .findOne({ _id: new ObjectId(id) })
    .then(
      (results) => {
        if (results === null) return c.json({ error: 'Not Found.' }, 404)

        return c.json(toClient(results))
      },
      (reason) => {
        logger.error(reason)
        throw createHttpException({
          errorContent: { status: 'error', error: [reason] },
          status: 500,
          statusText: 'Unknown error.',
        })
      }
    )
    .catch((_error) => {
      logger.error(_error)
      throw createHttpException({
        errorContent: { status: 'error', error: [_error] },
        status: 500,
        statusText: 'Unknown error.',
      })
    })
}

const deleteOneWord = async function (c: Context) {
  const id = c.req.param('id')
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const coll = client.db(config.mongodb.db).collection('words')

  return coll
    .findOneAndDelete({ _id: new ObjectId(id) })
    .then(
      (results) => {
        if (results === null) return c.json({ error: 'Not Found.' }, 404)

        return c.json({
          status: 'success',
          data: {},
        })
      },
      (reason) => {
        logger.error(reason)
        throw createHttpException({
          errorContent: { status: 'error', error: [reason] },
          status: 500,
          statusText: 'Unknown error.',
        })
      }
    )
    .catch((_error) => {
      logger.error(_error)
      throw createHttpException({
        errorContent: { status: 'error', error: [_error] },
        status: 500,
        statusText: 'Unknown error.',
      })
    })
}

const postWord = async function (c: Context) {
  const src = sanitizeEntry(c.get('body'))
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const coll = client.db(config.mongodb.db).collection('words')

  return coll
    .insertOne(src)
    .then(
      (aWord) => {
        return c.json(
          {
            status: 'success',
            data: { id: aWord._id },
          },
          201
        )
      },
      (err) => {
        if (err.code === 11000) {
          return c.json(
            {
              status: 'error',
              error: `Entry '${src.entry}' already exists`,
            },
            409
          )
        }
        logger.error('postWord failed', err)
        return c.json({ status: 'error', error: 'Internal error' }, 500)
      }
    )
    .catch((_error) => {
      logger.error('postWord Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const replaceWord = async function (c: Context) {
  const id = c.req.param('id')
  const src = sanitizeEntry(c.get('body'))
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const coll = client.db(config.mongodb.db).collection('words')

  logger.debug(JSON.stringify(src))

  return coll
    .findOneAndReplace({ _id: new ObjectId(id) }, src)
    .then(
      (results) => {
        if (results === null) return c.json({ error: 'Not Found.' }, 404)
        logger.debug('results', results)

        return c.json(
          {
            status: 'success',
            data: { id: results._id },
          },
          200
        )
      },
      (reason) => {
        if (reason.code === 11000) {
          return c.json(
            {
              status: 'error',
              error: `Entry '${src.entry}' already exists`,
            },
            409
          )
        }
        logger.error('failed', reason)
        return c.json({ status: 'error', error: [reason] }, 500)
      }
    )
    .catch((_error) => {
      logger.error(_error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

export default {
  getWords,
  getOneWord,
  deleteOneWord,
  postWord,
  replaceWord,
}
