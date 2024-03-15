import type { Context } from 'hono'
import config from '#config'
import { createHttpException } from '#utils/createHttpException'
import { WordsRepository } from '#lib/words.repository'

function formatDate(date) {
  if (date === null) return null

  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

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
    return c.json(
      {
        message: 'You are not logged in.',
      },
      403
    )
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

  if (!user) {
    return c.json(
      {
        message: 'You are not logged in.',
      },
      403
    )
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
        const update = {
          $set: {
            user_id: user_id,
            user_birthdate: bdate,
            ...(data[0] as object),
          },
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
export default { getWord, bookmarkWord }
