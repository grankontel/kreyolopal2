import type { Context } from 'hono'
import type { PoolClient } from 'pg'
import { argon2 } from '#utils/argon'

/*

export interface DatabaseUser {
  id: string
  username: string
  password: string
  firstname: string
  lastname: string
  is_admin: boolean
  birth_date: Date
}

*/

const getUserInfo = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  const user = c.get('user')

  logger.info('getUserInfo')

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const result = await pgPool.query(
    'SELECT username, is_admin, firstname, lastname, birth_date FROM auth_user WHERE id = $1',
    [user.id]
  )
  const response = result.rows[0]
  return c.json(response, 200)
}

const updatePassword = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  const user = c.get('user')

  logger.info('updatePassword')

  if (!user) {
    logger.debug('user not logged in')
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const { old_password, new_password } = c.req.valid('json')
  const client: PoolClient = await pgPool.connect()
  try {
    const result = await client.query(
      'SELECT username, password FROM auth_user WHERE id = $1',
      [user.id]
    )

    const isValid = await argon2.verify(old_password, result.rows[0].password)
    if (!isValid) {
      logger.warn('old password is not valid')
      return c.json(
        {
          status: 'error',
          error: 'Old password is not valid',
        },
        400
      )
    }
    const hashedPassword = await argon2.hash(new_password)

    await client
    .query('UPDATE auth_user SET password= $2 WHERE id = $1 ', [
      user.id, hashedPassword
    ])

    return c.json({ status: 'success' }, 200)

  } catch (_error) {
    logger.error('updatePassword Exception', _error)
    return c.json({ status: 'error', error: [_error] }, 500)
  } finally {
    client.release()
  }
}

export default { getUserInfo, updatePassword }
