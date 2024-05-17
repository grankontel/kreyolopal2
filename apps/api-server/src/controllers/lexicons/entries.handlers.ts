import config from '#config'
import { lucia } from '#services/auth'
import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import type { DatabaseUser, pgPool } from '#services/db'
import { getUserEnforcer } from '#services/permissions'
import type { PoolClient } from 'pg'
import { DictionaryFullEntry, MongoCollection, RestrictedDefinitionSource } from '@kreyolopal/domain'
import { LexiconEntry, buildListAggregate, getEntry } from './helpers'

interface AddDefinitionPayload {
  entry: string
  definitions: {
    source: RestrictedDefinitionSource
    id: string
  }[]
}

const getLexiconEntry = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  const mongo: MongoClient = c.get('mongodb')
  const user: DatabaseUser = c.get('user')

  const { username, slug, language, word } = c.req.param()
  const lang = language.toLowerCase().trim()
  const aWord = word.trim()

  logger.info(`getLexiconEntry  ${slug} ${word}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('read_entry', 'lexicon')) {
		logger.debug('user does not have read_entry lexicon permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

  const client: PoolClient = await pgPool.connect()

  try {
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
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}

const addDefinitions = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  const mongo: MongoClient = c.get('mongodb')
  const user: DatabaseUser = c.get('user')

  const { id } = c.req.param()

  const { entry, definitions }: AddDefinitionPayload = c.req.valid('json')
  logger.info(`addDefinitions for ${entry} to ${id}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('add_entry', 'lexicon')) {
		logger.debug('user does not have add_entry lexicon permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

  const client: PoolClient = await pgPool.connect()

  try {
    const text = 'SELECT id, owner FROM lexicons WHERE id = $1'
    const values = [id]
    const res = await client.query(text, values)
    if (res.rows.length === 0) {
      return c.json({ error: 'Not Found' }, 404)
    }

    if (res.rows[0].owner != user.id) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const lexicon = res.rows[0]
    logger.info('found lexicon')

    // check each def_id against associated source

    const projection = {
      entry: 1,
      definition_id: 1,
      _id: 0,
    }

    const reference_defs = definitions
      .filter((item) => item.source === 'reference')
      .map((item) => item.id)
    const validated_defs = definitions
      .filter((item) => item.source === 'validated')
      .map((item) => item.id)

    const refFilter = {
      definition_id: {
        $in: reference_defs,
      },
    }

    const refColl = mongo
      .db(config.mongodb.database)
      .collection(MongoCollection.reference)
    const refCursor = refColl.find(refFilter, { projection })
    const refResult = (await refCursor.toArray())
      .filter((item) => item.entry === entry)
      .map((item) => item.definition_id)

    refCursor.close()
    const valFilter = {
      definition_id: {
        $in: validated_defs,
      },
    }

    const valColl = mongo
      .db(config.mongodb.database)
      .collection(MongoCollection.validated)
    const valCursor = valColl.find(valFilter, { projection })
    const valResult = (await valCursor.toArray())
      .filter((item) => item.entry === entry)
      .map((item) => item.definition_id)
    valCursor.close()

    logger.debug(JSON.stringify({ refResult, valResult }))
    const ids = refResult.concat(valResult)
    if (ids.length === 0) return c.json({ error: 'Invalid definitions' }, 400)

    // check if entry is in lexicons
    const lexColl = mongo
      .db(config.mongodb.database)
      .collection(MongoCollection.lexicons)
    const findOptions = { projection: { _id: 0 } }
    const lexEntry: LexiconEntry | null = await lexColl
      .findOne({ entry: entry }, findOptions)
      .then((value) => {
        return (
          value ??
          refColl.findOne({ entry: entry }, findOptions).then((x) => {
            return x ?? valColl.findOne({ entry: entry }, findOptions)
          })
        )
      })

    logger.debug(JSON.stringify(lexEntry))
    if (lexEntry === null) return c.json({ error: 'Invalid entry' }, 400)

    // upsert lexicons field and def_ids field
    return lexColl
      .updateOne(
        lexEntry,
        { $addToSet: { lexicons: lexicon.id, def_ids: ids } },
        { upsert: true }
      )
      .then((result) => {
        logger.debug(JSON.stringify(result))

        const response = {
          ...lexEntry,
          added: {
            lexicon: lexicon.id,
            def_ids: ids,
          },
        }
        return c.json(response, 201)
      })
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}

const listEntries = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  const mongo = c.get('mongodb')
  const user = c.get('user')
  const { username, slug } = c.req.param()
  const { limit = 20, offset = 0 } = c.req.valid('query')
  const pagesize = Math.min(limit, 25)

  logger.info(`listEntries  ${username}/${slug}`)
  logger.debug(JSON.stringify({ limit, offset }))

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('list_entry', 'lexicon')) {
		logger.debug('user does not have add_entry lexicon permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

  const client: PoolClient = await pgPool.connect()

  try {
    const getOwner = 'SELECT id from auth_user where username = $1'
    const resUser = await client.query(getOwner, [username])
    if (resUser.rows.length === 0) {
      return c.json({ error: 'Not Found' }, 404)
    }

    const owner_id = resUser.rows[0].id

    const text =
      'SELECT id,  is_private FROM lexicons WHERE owner = $1 AND slug = $2'
    const values = [owner_id, slug]
    const res = await client.query(text, values)
    if (res.rows.length === 0) {
      return c.json({ error: 'Not Found' }, 404)
    }

    const lexicon = res.rows[0]
    if (lexicon.owner != user.id && lexicon.is_private) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const agg = buildListAggregate(lexicon.id, offset, pagesize)

    const coll = mongo
      .db(config.mongodb.database)
      .collection(MongoCollection.lexicons)
    const cursor = coll.aggregate(agg)
    const result = await cursor.toArray()
    await cursor.close()

    const data: DictionaryFullEntry[] = result?.map((item) => {
      const def_object = item.definitions.reduce((obj, v) => {
        obj[v.kreyol] = obj[v.kreyol] || []
        obj[v.kreyol].push(v)
        return obj
      }, Object.create(null))

      return {
        id: item._id,
        entry: item.entry,
        variations: item.variations,
        definitions: def_object,
      }
    })

    if (data.length > 0) {
      const nb = await mongo
        .db(config.mongodb.database)
        .collection(MongoCollection.lexicons)
        .countDocuments({ lexicons: lexicon.id })
      const endRange = Math.min(nb, offset + limit)
      c.res.headers.append('Cache-Control', 'private, maxage=86400')
      c.res.headers.append(
        'Access-Control-Expose-Headers',
        'X-Total-Count, Content-Range'
      )
      c.res.headers.append('Content-Range', `${offset}-${endRange}/${nb}`)
      c.res.headers.append('X-Total-Count', nb)

      c.status(200)
      return c.json<DictionaryFullEntry[]>(data)
    }

    return c.json({ error: 'Not Found.' }, 404)
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}
export default { getLexiconEntry, addDefinitions, listEntries }