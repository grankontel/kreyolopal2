
import type { Context } from 'hono'

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
		return c.json(
			{
				message: 'You are not logged in.',
			},
			403
		)
	}

	const result = await pgPool.query('SELECT username, is_admin, firstname, lastname, birth_date FROM auth_user WHERE id = $1', [user.id])
	return c.json(result.rows[0], 200)
}

export default { getUserInfo }