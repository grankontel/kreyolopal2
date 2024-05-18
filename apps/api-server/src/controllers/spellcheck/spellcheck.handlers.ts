import type { Context } from 'hono'
import spellchecker from './lib.spellcheck'
// import { pgPool } from '#lib/db'
import { DicoRequest, KreyolLang, MessageResponse } from './spellcheck.types'
import { getUserEnforcer } from '#services/permissions'

const postSpellCheck = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const body = c.req.valid('json') as Record<string, string>
  const user = c.get('user')
  logger.info('postSpellCheck')

  if (!user) {
    return c.json({ error: 'You are not logged in.' }, 403)
  }

  const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('request', 'spellcheck')) {
		logger.debug('user does not have request spellcheck permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

  const dico = body.kreyol.toUpperCase() as KreyolLang

  let lMessage: DicoRequest & { [k: string]: any } = {
    user: user.id, // req.user.id,
    tool: c.req.header('User-Agent'),
    service: 'spellcheck',
    kreyol: dico,
    request: body.request.replace(/ç/, 's'),
  }
  logger.debug(JSON.stringify(lMessage))

  return spellchecker
    .check(lMessage)
    .tap(async (msg) => {
      logger.debug('attempt to save message')
      logger.debug([
        lMessage.user,
        lMessage.kreyol,
        lMessage.request,
        msg.status,
        msg.message,
      ])
      await pgPool
        .query(
          `INSERT INTO spellcheckeds
      (user_id, kreyol, request, status, message, response) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [
            lMessage.user,
            lMessage.kreyol,
            lMessage.request,
            msg.status,
            msg.message,
            msg,
          ]
        )
        .then(
          (res) => {
            logger.info('msg save success')
            lMessage.id = res.rows[0].id
          },
          (reason) => {
            logger.error('msg save failed')
            logger.error(reason)
          }
        )
        .catch((error) => {
          logger.error(error)
        })
    })
    .then(async (msg) => {
      lMessage.response = msg
      logger.debug(JSON.stringify(lMessage))
      return c.json(lMessage, 200)
    })
    .catch((_error) => {
      logger.error('postSpellCheck Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const postRating = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  const id = c.req.param('id')
  const user = c.get('user')

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const body = c.req.valid('json') as Record<string, string>
  const { rating, user_correction, user_notes } = body

  logger.info('postRating')

  if (!user) {
    return c.json({ error: 'You are not logged in.' }, 403)
  }
	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('rate', 'spellcheck')) {
		logger.debug('user does not have rate spellcheck permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

  logger.debug(JSON.stringify({ id, ...body }))
  return pgPool
    .connect()
    .then(async (client) => {
      let res = await client.query(
        'SELECT 1 from spellcheckeds WHERE user_id = $1 AND id=$2',
        [user.id, id]
      )

      if (res.rows.length === 0) {
        return c.json(
          {
            error: 'Forbidden',
          },
          403
        )
      }

      logger.debug('Spellechecked exists')

      const extra_fields: { name: string; value: string }[] = []
      if (user_correction)
        extra_fields.push({
          name: 'user_correction',
          value: user_correction,
        })
      if (user_notes)
        extra_fields.push({ name: 'user_notes', value: user_notes })

      const columns = ['spellchecked_id', 'rating'].concat(
        extra_fields.map((item) => item.name)
      )
      const values = [id, rating].concat(extra_fields.map((item) => item.value))

      let text = `INSERT INTO ratings (${columns.join(', ')})
      VALUES(${columns.map((item, index) => `$${index + 1}`).join(', ')})
      ON CONFLICT(spellchecked_id) 
      DO UPDATE SET
      rating = EXCLUDED.rating`
      text =
        text +
        (user_correction ? ',user_correction = EXCLUDED.user_correction' : '')
      text = text + (user_notes ? ', user_notes = EXCLUDED.user_notes' : '')

      text = text + ` RETURNING spellchecked_id;`
      logger.debug(text)
      res = await client.query(text, values)
      const retour_id = res.rows[0].spellchecked_id
      client.release()

      logger.debug(retour_id)
      return c.json({ id: retour_id }, 200)
    })
    .catch((_error) => {
      logger.error('postRating Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

export default { postSpellCheck, postRating /*, getSpellChecks */ }
