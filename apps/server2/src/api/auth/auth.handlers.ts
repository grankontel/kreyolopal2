import { generateId } from 'lucia'
import { setCookie } from 'hono/cookie'
// import { pgPool } from '#lib/db'
import { lucia, createCookie } from '#lib/auth'
import { createHttpException } from '#utils/createHttpException'

import type { Context } from 'hono'
import type { DatabaseUser } from '#lib/db'
import type { PoolClient } from 'pg'
import { logUserIn } from '#utils/apiHelpers'
import { argon2 } from '#utils/argon'

const login = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const body = c.req.valid('json')
  const { username, password } = body

  const text =
    'SELECT id, username, password, is_admin FROM auth_user WHERE username = $1'
  const values = [username]

  return pgPool
    .connect()
    .then(async (client) => {
      const res = await client.query(text, values)
      const existingUser = res?.rows[0] as DatabaseUser | undefined
      if (!existingUser) {
        c.status(400)
        return c.json({
          error: 'Incorrect username or password',
        })
      }

      const validPassword = await argon2.verify(existingUser.password, password)
      if (!validPassword) {
        c.status(400)
        return c.json({
          error: 'Incorrect username or password',
        })
      }

      return client
        .query('UPDATE auth_user SET lastlogin= NOW() WHERE id = $1 ', [
          existingUser.id,
        ])
        .then(() => {
          return logUserIn(c, existingUser)
        })
    })
    .catch((_error) => {
      logger.error('login Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const signup = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  logger.info('signup')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const body = c.req.valid('json')
  const { username, password, firstname, lastname, email } = body

  const hashedPassword = await argon2.hash(password)
  const userId = generateId(15)

  const text =
    `INSERT INTO auth_user (id, username, password, firstname, lastname, email) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
  const values = [userId, username, hashedPassword, firstname, lastname, email]

  return pgPool.connect().then(async (client: PoolClient) => {
    return client
      .query(text, values)
      .then(
        (dbresult) => {
          const createdUser = dbresult.rows[0] as DatabaseUser

          return lucia.createSession(createdUser.id, {}).then((session) => {
            const theCookie = createCookie(session.id, createdUser)
            setCookie(c, theCookie.name, theCookie.value, {
              ...theCookie.attributes,
              httpOnly: false,
            })
            // setCookie(c, 'delicious_cookie', 'macha')
            c.status(200)
            return c.json({})
          })
        },
        (reason) => {
          console.log('reason')
          logger.error(reason?.message)
          if (reason?.severity == 'ERROR' && reason?.code == '23505') {
            return c.json(
              {
                message: 'Unprocessable Entity',
              },
              422
            )
          }
          throw createHttpException({
            errorContent: { error: 'Unknown error..' },
            status: 500,
            statusText: 'Unknown error.',
          })
        }
      )
      .catch((e) => {
        logger.error(e.message)
        throw createHttpException({
          errorContent: { error: 'Unknown error..' },
          status: 500,
          statusText: 'Unknown error.',
        })
      })
  })
}

const logout = async function (c: Context) {
  const session = c.get('session')
  if (!session) {
    c.status(401)
    return c.json({})
  }
  await lucia.invalidateSession(session.id)
  const theCookie = lucia.createBlankSessionCookie()
  setCookie(c, theCookie.name, theCookie.value, {
    ...theCookie.attributes,
    httpOnly: false,
  })
  c.status(200)
  return c.json({})
}
export default { login, signup, logout }
