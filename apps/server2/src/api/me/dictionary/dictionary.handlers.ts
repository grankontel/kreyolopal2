import type { Context } from 'hono'
import type { MongoClient, ObjectId } from 'mongodb'
import type winston from 'winston'
import config from '#config'
import { createHttpException } from '#utils/createHttpException'
import { WordsRepository } from '#lib/words.repository'
import { HTTPException } from 'hono/http-exception'

function formatDate(date: string | number | Date): string | null {
  if (date === null) return null

  const d = new Date(date)
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

const getWord = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const user = c.get('user')
  const { word } = c.req.param()

  logger.info(`me getWord  ${word}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const user_id = user.id

  try {
    const filter = {
      user_id: user_id,
      entry: word,
    }
    const projection = {
      user_id: 1,
      entry: 1,
      variations: 1,
      definitions: 1,
    }

    // const client = getClient()
    const coll = client.db(config.mongodb.db).collection('personal')
    const cursor = coll.find(filter, { projection })
    const result = await cursor.toArray()
    cursor.close()
    logger.debug(JSON.stringify(result?.[0]))
    //client.close()

    const data = result?.map((item) => {
      return {
        id: item._id,
        entry: item.entry,
        variations: item.variations,
        definitions: item.definitions,
      }
    })

    if (data.length > 0) {
      c.res.headers.append('Cache-Control', 'private, maxage=86400')

      c.status(200)
      return c.json(data)
    }

    return c.json({ error: 'Not Found.' }, 404)
  } catch (e: any) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}

const bookmarkWord = async function (c: Context) {
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const { word } = c.req.param()
  const user = c.get('user')
  logger.info(`me bookmarkWord ${word}`)

  if (!user) {
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const user_id = user.id

  const query = { user_id: user_id, entry: word }
  const bdate = formatDate(user.birth_date)
  return WordsRepository.getInstance(c)
    .GetOne(word, (item) => {
      return {
        entry: item.entry,
        variations: item.variations,
        definitions: item.definitions,
      }
    })
    .then(
      (data) => {
        if (data.length === 0) return c.json({ error: 'Not Found.' }, 404)

        const coll = client.db(config.mongodb.db).collection('personal')
        const options = { upsert: true }
        const updateObj = {
          user_id: user_id,
          user_birthdate: bdate,
          ...(data[0] as object),
        }

        if (user.birth_date === undefined || user.birth_date === null) {
          delete updateObj.user_birthdate
        }

        const update = {
          $set: updateObj,
        }

        return coll
          .updateOne(query, update, options)
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
                    error: `Entry '${word}' already exists`,
                  },
                  409
                )
              }
              logger.error('postWord failed', err)
              return c.json({ status: 'error', error: 'Internal error' }, 500)
            }
          )
          .catch((_error) => {
            logger.error('bookmarkWord Exception', _error)
            return c.json({ status: 'error', error: [_error] }, 500)
          })
      },
      (reason) => {
        console.log('reason')
        logger.error(reason?.message)
        throw createHttpException({
          errorContent: { error: 'Unknown error..' },
          status: 500,
          statusText: 'Unknown error.',
        })
      }
    )
}

const getWordId = (c: Context, client: MongoClient, logger: winston.Logger) =>
  new Promise<ObjectId>(async (resolve, reject) => {
    const user = c.get('user')
    const { word } = c.req.param()

    if (!user) {
      reject(
        createHttpException(
          {
            errorContent: { error: 'You are not logged in.' },
            status: 403,
            statusText: 'You are not logged in.',
          },
          403,
          'You are not logged in.'
        )
      )
      return
    }

    if (word.trim().length === 0) {
      reject(
        createHttpException(
          {
            errorContent: { error: 'Bad  request.' },
            status: 400,
            statusText: 'Bad  request.',
          },
          400,
          'Bad  request.'
        )
      )
      return
    }

    const user_id = user.id
    const coll = client.db(config.mongodb.db).collection('personal')
    const filter = {
      entry: word,
      user_id: user_id,
    }
    const projection = {
      entry: 1,
    }

    try {
      // const client = getClient()
      const cursor = coll.find(filter, { projection })
      const result = await cursor.toArray()
      cursor.close()

      if (result?.length === 0) {
        reject(
          createHttpException(
            {
              errorContent: { error: 'Not Found.' },
              status: 404,
              statusText: 'Not Found.',
            },
            404,
            'Not Found.'
          )
        )
        return
      }

      resolve(result[0]._id)
    } catch (e: any) {
      logger.error(e.message)
      throw createHttpException({
        errorContent: { error: 'Unknown error..' },
        status: 500,
        statusText: 'Unknown error.',
      })
    }
  })

const addSubField = async function (c: Context, subField: string) {
  const logger = c.get('logger')
  const client: MongoClient = c.get('mongodb')

  const { word } = c.req.param()
  const { kreyol, rank, text } = c.req.valid('json')
  logger.info(`me add ${subField} for ${word}`)

  return getWordId(c, client, logger)
    .then(
      (wordId) => {
        const coll = client.db(config.mongodb.db).collection('personal')

        const fieldObj = {}
        fieldObj[`definitions.${kreyol}.${rank}.${subField}`] = text
        logger.info(JSON.stringify(fieldObj))

        return coll.updateOne({ _id: wordId }, { $push: fieldObj }).then(
          (aWord) => {
            return c.json(
              {
                status: 'success',
                data: { nb: aWord.modifiedCount },
              },
              201
            )
          },
          (err) => {
            if (err.code === 11000) {
              return c.json(
                {
                  status: 'error',
                  error: `Could not add ${subField} for '${word}'`,
                },
                409
              )
            }
            logger.error(`addSubField ${subField} failed`, err)
            return c.json({ status: 'error', error: 'Internal error' }, 500)
          }
        )
      },
      (err) => {
        if (err instanceof HTTPException) {
          // Get the custom response
          return err.getResponse()
        }
        //...
        logger.error(err.message, err)
        return c.json({ status: 'error', error: 'Unknown error..' }, 500)
      }
    )
    .catch((_error) => {
      logger.error(`addSubField ${subField} Exception`, _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const addConfer = async function (c: Context) {
  const logger = c.get('logger')
  const client: MongoClient = c.get('mongodb')

  let { word } = c.req.param()
  let { kreyol, rank, text } = c.req.valid('json')

  word = word.trim()
  text = text.trim()

  logger.info(`me addConfer for ${word}`)

  if (word === text) {
    logger.error('attempt to add confer to same word')
    return c.json(
      {
        status: 'error',
        error: `'Unprocessable Entity'`,
      },
      422
    )
  }

  return WordsRepository.getInstance(c)
    .Exists(text)
    .then((exists) => {
      if (!exists) {
        logger.error(`${text} is not in dictionnary`)
        return c.json(
          {
            status: 'error',
            error: `'Unprocessable Entity'`,
          },
          422
        )
      }

      return getWordId(c, client, logger)
        .then((wordId) => {
          const coll = client.db(config.mongodb.db).collection('personal')

          const fieldObj = {}
          fieldObj[`definitions.${kreyol}.${rank}.confer`] = text
          logger.info(JSON.stringify(fieldObj))

          return coll.updateOne({ _id: wordId }, { $addToSet: fieldObj }).then(
            (aWord) => {
              return c.json(
                {
                  status: 'success',
                  data: { nb: aWord.modifiedCount },
                },
                201
              )
            },
            (err) => {
              if (err.code === 11000) {
                return c.json(
                  {
                    status: 'error',
                    error: `Could not addConfer for '${word}'`,
                  },
                  409
                )
              }
              logger.error(`addConfer failed`, err)
              return c.json({ status: 'error', error: 'Internal error' }, 500)
            }
          )
        })
        .catch((_error) => {
          logger.error(`addConfer ${word} Exception`, _error)
          return c.json({ status: 'error', error: [_error] }, 500)
        })
    })
}

const listWords = async function (c: Context) {
  const { limit = 20, offset = 0 } = c.req.valid('query')
  const pagesize = Math.min(limit, 25)
  const logger = c.get('logger')
  const client = c.get('mongodb')
  const user = c.get('user')

  logger.info(`me listWords`)
  logger.debug(JSON.stringify({ limit, offset }))

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const user_id = user.id
  const filter = {
    user_id: user_id,
  }
  const projection = {
    user_id: 1,
    entry: 1,
    variations: 1,
    definitions: 1,
  }

  try {
    // const client = getClient()
    const coll = client.db(config.mongodb.db).collection('personal')
    const cursor = coll
      .find(filter, { projection })
      .skip(offset)
      .limit(pagesize)
    const result = await cursor.toArray()
    cursor.close()

    const data = result?.map((item) => {
      return {
        id: item._id,
        entry: item.entry,
        variations: item.variations,
        definitions: item.definitions,
      }
    })

    if (data.length > 0) {
      const nb = await client
        .db(config.mongodb.db)
        .collection('personal')
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
      return c.json(data)
    }

    return c.json({ error: 'Not Found.' }, 404)
  } catch (e: any) {
    logger.error(e.message)
    throw createHttpException({
      errorContent: { error: 'Unknown error..' },
      status: 500,
      statusText: 'Unknown error.',
    })
  }
}

export default { getWord, bookmarkWord, addSubField, addConfer, listWords }
