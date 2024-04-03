import type { Context } from 'hono'

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

export default { getLexicon, addLexicon }
