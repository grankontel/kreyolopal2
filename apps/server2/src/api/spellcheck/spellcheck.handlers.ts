import { Context } from 'hono'
import { getAuth } from '@hono/clerk-auth'
import spellchecker from './lib.spellcheck'

const postSpellCheck = async function (c: Context) {
  const logger = c.get('logger')
  const body = c.req.valid('json')
  const auth = getAuth(c)

  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.'
    }, 403)
  }

  const lMessage = {
    user: auth?.userId, // req.user.id,
    tool: c.req.header('User-Agent'),
    service: 'spellcheck',
    kreyol: body.kreyol,
    request:body.request.replace(/ç/, 's'),
  }

  return spellchecker
  .check(lMessage)
  .then(async (msg) => {

	lMessage.response = msg
	console.log(lMessage)
	return c.json(lMessage, 200)
  })
  .catch((_error) => {
	logger.error('postSpellCheck Exception', _error)
	return c.json({ status: 'error', error: [_error] }, 500)
  })
}

const postRating = async function (c: Context) {
  const logger = c.get('logger')
  const id = parseInt(c.req.param('id'))
  const body = c.req.valid('json')

  console.log({id, ...body})
  return c.json({})
}

export default { postSpellCheck, postRating /*, getSpellChecks */ }
