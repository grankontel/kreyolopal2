import type { Context } from "hono"
import type { PoolClient } from "pg"

import { generateId } from "lucia"
import { DatabaseUser } from "#services/db"
import { createCookie, lucia } from "#services/auth"
import { setCookie } from "hono/cookie"
import { createHttpException, logUserIn } from "#utils/apiHelpers"
import { argon2 } from "#utils/argon2"

const login = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const body = c.req.valid('json')
  const { username, password } = body

  const text =
    'SELECT id, username, password, is_admin, firstname, lastname FROM auth_user WHERE username = $1'
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

	const client: PoolClient = await pgPool.connect()

	let createdUser: DatabaseUser
	try {
		await client.query('BEGIN')

		const text = `INSERT INTO auth_user (id, username, password, firstname, lastname, email) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
		const values = [userId, username, hashedPassword, firstname, lastname, email]
		const dbresult = await client.query<DatabaseUser>(text, values)
		createdUser = dbresult.rows[0]

		const add_role = `INSERT INTO users_roles (user_id, role_id) VALUES ($1, $2)`
		await client.query(add_role, [createdUser.id, 2])

		await client.query('COMMIT')
	} catch (e) {
		await client.query('ROLLBACK')
		logger.error(e)
		throw createHttpException({
			errorContent: { error: 'Unknown error..' },
			status: 500,
			statusText: 'Unknown error.',
		})
	} finally {
		client.release()
	}
	return lucia.createSession(createdUser.id, {}).then(async (session) => {
		const theCookie = await createCookie(session.id, createdUser)
		setCookie(c, theCookie.name, theCookie.value, {
			...theCookie.attributes,
			httpOnly: false,
		})
		// setCookie(c, 'delicious_cookie', 'macha')
		c.status(200)
		return c.json({})
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

export default { signup, login, logout }
