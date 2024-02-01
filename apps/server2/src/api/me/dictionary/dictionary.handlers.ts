import { Context } from 'hono'
import { getAuth } from '@hono/clerk-auth'
import config from '#config'
import { createHttpException } from '#utils/createHttpException'

const getWord = async function (c: Context) {
	const logger = c.get('logger')
	const client = c.get('mongodb')
  const auth = getAuth(c)
/*
  if (!auth?.userId) {
    return c.json(
      {
        message: 'You are not logged in.',
      },
      403
    )
  }
*/
	const user_id = "user_2a81lkpE2baBqFSNEKPfTv8yZyW" // auth?.userId
	const { language, word } = c.req.param()

	logger.info(`getWord ${language} ${word}`)

	try {
		const filter = {
			"user_id": user_id,
			"words.entry": word,
		}
		const projection = {
			"user_id": 1,
			"words.entry": 1,
			"words.variations": 1,
			"words.definitions": 1,
		}

		// const client = getClient()
		const coll = client.db(config.mongodb.db).collection('personal')
		const cursor = coll.find(filter, { projection })
		const result = await cursor.toArray()
		console.log(result?.[0])
		//client.close()

		const data = result?.[0].words.map((item) => {
			return {
				id: item._id,
				entry: item.entry,
				variations: item.variations,
				definitions: item.definitions[language],
			}
		})

		if (data.length > 0) {
			c.res.headers.append('Cache-Control', 's-maxage=86400')

			c.status(200)
			return c.json(data)
		}

		return c.json({ error: 'Not Found.' }, 404)

	} catch (e) {
		logger.error(e.message)
		throw createHttpException({
			errorContent: { error: 'Unknown error..' },
			status: 500,
			statusText: 'Unknown error.',
		})
	}
}

export default { getWord }
