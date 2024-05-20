import config from '#config'
import { lucia } from '#services/auth'
import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import type { DatabaseUser, pgPool } from '#services/db'
import { getUserEnforcer } from '#services/permissions'
import type { PoolClient } from 'pg'
import { Lexicon, MongoCollection } from '@kreyolopal/domain'

const addLexicon = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user: DatabaseUser = c.get('user')
  const { name, description, slug, is_private } = c.req.valid('json')

  logger.info(`addLexicon  ${slug}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('add', 'lexicon')) {
		logger.debug('user does not have add lexicon permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
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

const editLexicon = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user: DatabaseUser = c.get('user')

  const { id } = c.req.param()
  const { name, description, slug, is_private } = c.req.valid('json')

  logger.info(`editLexicon  ${id}`)
  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('edit', 'lexicon')) {
		logger.debug('user does not have edit lexicon permission')
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

    const up_text = `UPDATE lexicons SET name = $1, description = $2, slug= $3, is_private = $4
    WHERE id = $5 RETURNING id`
    const res2 = await client.query(up_text, [
      name,
      description,
      slug,
      is_private,
      id,
    ])

    return c.json({ id: res2.rows[0].id }, 200)
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}

const getLexicon = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user = c.get('user')
  const { username, slug } = c.req.param()

  logger.info(`getLexicon  ${slug}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('read', 'lexicon')) {
		logger.debug('user does not have read lexicon permission')
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
      'SELECT id, owner, name, slug, description, is_private FROM lexicons WHERE owner = $1 AND slug = $2'
    const values = [owner_id, slug]
    const res = await client.query(text, values)
    if (res.rows.length === 0) {
      return c.json({ error: 'Not Found' }, 404)
    }

    const lexicon: Lexicon = res.rows[0]
    if (lexicon.owner != user.id && lexicon.is_private) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    return c.json<Lexicon>(lexicon, 200)
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}

const deleteLexicon = async (c: Context) => {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  const mongo: MongoClient = c.get('mongodb')
  const user: DatabaseUser = c.get('user')

  const { id } = c.req.param()

  logger.info(`deleteLexicon ${id}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('delete', 'lexicon')) {
		logger.debug('user does not have delete lexicon permission')
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

    const lexColl = mongo
      .db(config.mongodb.database)
      .collection(MongoCollection.lexicons)
    await lexColl.updateMany({}, { $pull: { lexicons: lexicon.id } })

    // delete from DATABASE
    await client.query('DELETE FROM lexicons WHERE id = $1', [lexicon.id])

    return c.json({}, 200)
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}

const getAllLexicons = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool: pgPool = c.get('pgPool')
  //const client = c.get('mongodb')
  const user = c.get('user')
  const { username } = c.req.param()

  logger.info(`getAllLexicons  ${username}`)

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

	const enforcer = await getUserEnforcer(user)
	if (!enforcer.can('list', 'lexicon')) {
		logger.debug('user does not have list lexicon permission')
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

    const text =
      'SELECT id, owner, name, slug, description, is_private FROM lexicons WHERE owner = $1'
    const values = [owner_id]
    const res = await client.query(text, values)
    if (res.rows.length === 0) {
      return c.json([], 200)
    }

    const lexicons: Lexicon[] = (
      isMine ? res.rows : res.rows.filter((item) => item.is_private == false)
    ).map((item) => ({ ...item, path: `/lexicons/${username}/${item.slug}` }))
    return c.json<Lexicon[]>(lexicons, 200)
  } catch (_error) {
    logger.error('getLexicon Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}


export default { addLexicon, editLexicon, getLexicon, deleteLexicon, getAllLexicons }