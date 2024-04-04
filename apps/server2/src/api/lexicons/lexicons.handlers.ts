import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import config from '#config'
import { createHttpException } from '#utils/createHttpException'

interface LexiconEntry {
  _id?: string
  entry: string
  docType: string
  variations: string[]
  def_ids: string[]
  lexicons: string[]
}

function getEntry(
  client: MongoClient,
  lexicon_id: string,
  kreyol: string,
  aWord: string
): Promise<LexiconEntry> {
  const agg = [
    {
      $match: {
        entry: aWord,
        lexicons: lexicon_id,
      },
    },
    {
      $lookup: {
        from: 'reference',
        let: {
          defi: '$def_ids',
        },
        pipeline: [
          {
            $match: {
              docType: 'definition',
              kreyol: kreyol,
              $expr: {
                $in: ['$definition_id', '$$defi'],
              },
            },
          },
        ],
        as: 'ref_definitions',
      },
    },
    {
      $lookup: {
        from: 'validated',
        let: {
          defi: '$def_ids',
        },
        pipeline: [
          {
            $match: {
              docType: 'definition',
              kreyol: kreyol,
              $expr: {
                $in: ['$definition_id', '$$defi'],
              },
            },
          },
        ],
        as: 'val_definitions',
      },
    },
    {
      $project: {
        id: '$_id',
        _id: 0,
        entry: 1,
        variations: 1,
        definitions: {
          $concatArrays: ['$ref_definitions', '$val_definitions'],
        },
      },
    },
  ]
  return new Promise<LexiconEntry>(async (resolve, reject) => {
    const coll = client.db(config.mongodb.db).collection('lexicons')
    const cursor = coll.aggregate<LexiconEntry>(agg)
    cursor.toArray().then((result) => {
      if (result.length === 0)
        reject(createHttpException({ error: 'Not Found' }, 404, 'Not Found'))

      resolve(result[0])
    })
  })
}

const getLexicon = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user = c.get('user')
  const { username, slug } = c.req.param()

  logger.info(`getLexicon  ${slug}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  return pgPool
    .connect()
    .then(async (client) => {
      const getOwner = 'SELECT id from auth_user where username = $1'
      const resUser = await client.query(getOwner, [username])
      if (resUser.rows.length === 0) {
        return c.json({ error: 'Not Found' }, 404)
      }

      const owner_id = resUser.rows[0].id

      const text =
        'SELECT id, owner, name, slug, description, is_private FROM lexicons WHERE owner = $1 AND slug = $2'
      const values = [owner_id, slug]
      const res = await client.query(text, values)
      if (res.rows.length === 0) {
        return c.json({ error: 'Not Found' }, 404)
      }

      const lexicon = res.rows[0]
      if (lexicon.owner != user.username && lexicon.is_private) {
        return c.json({ error: 'Forbidden' }, 403)
      }

      return c.json(lexicon, 200)
    })
    .catch((_error) => {
      logger.error('getLexicon Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const getAllLexicons = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user = c.get('user')
  const { username } = c.req.param()

  logger.info(`getAllLexicons  ${username}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  return pgPool
    .connect()
    .then(async (client) => {
      const getOwner = 'SELECT id from auth_user where username = $1'
      const resUser = await client.query(getOwner, [username])
      if (resUser.rows.length === 0) {
        return c.json({ error: 'Not Found' }, 404)
      }

      const owner_id = resUser.rows[0].id
      const isMine = owner_id === user.id

      const text =
        'SELECT id, owner, name, slug, description, is_private FROM lexicons WHERE owner = $1'
      const values = [owner_id]
      const res = await client.query(text, values)
      if (res.rows.length === 0) {
        return c.json({ error: 'Not Found' }, 404)
      }

      const lexicons = isMine
        ? res.rows
        : res.rows.filter((item) => item.is_private == false)
      return c.json(lexicons, 200)
    })
    .catch((_error) => {
      logger.error('getLexicon Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const addLexicon = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user = c.get('user')
  const { name, description, slug, is_private } = c.req.valid('json')

  logger.info(`addLexicon  ${slug}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const data = [user.id, name, description, slug, is_private]
  return await pgPool
    .query(
      `INSERT INTO lexicons
      (owner, name, description, slug, is_private) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      data
    )
    .then(
      (res) => {
        logger.info('lexicon created with success')
        return c.json({ id: res.rows[0].id }, 201)
      },
      (reason) => {
        logger.error('lexion save failed')
        logger.error(reason)
        if (reason?.severity == 'ERROR' && reason?.code == '23505') {
          return c.json({ error: 'Unprocessable Entity' }, 422)
        }

        return c.json({ status: 'error', error: [reason] }, 500)
      }
    )
    .catch((_error) => {
      logger.error(_error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const getLexiconEntry = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  const mongo = c.get('mongodb')
  const user = c.get('user')

  const { username, slug, language, word } = c.req.param()
  const lang = language.toLowerCase().trim()
  const aWord = word.trim()

  logger.info(`getLexiconEntry  ${slug} ${word}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  return pgPool
    .connect()
    .then(async (client) => {
      const getOwner = 'SELECT id from auth_user where username = $1'
      const resUser = await client.query(getOwner, [username])
      if (resUser.rows.length === 0) {
        return c.json({ error: 'Not Found' }, 404)
      }

      const owner_id = resUser.rows[0].id
      const isMine = owner_id === user.id

      const text = 'SELECT id, is_private FROM lexicons WHERE slug = $1'
      const values = [slug]
      const resLexicon = await client.query(text, values)
      if (resLexicon.rows.length === 0) {
        return c.json({ error: 'Not Found' }, 404)
      }

      const lexicon = resLexicon.rows[0]

      if (lexicon.is_private && !isMine) {
        return c.json({ error: 'Forbidden' }, 403)
      }

      return getEntry(mongo, lexicon.id, lang, aWord).then((entry) => {
        return c.json(entry, 200)
      })
    })
    .catch((_error) => {
      logger.error('getLexicon Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

export default { getLexicon, addLexicon, getAllLexicons, getLexiconEntry }
