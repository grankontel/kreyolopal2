import { Context } from 'hono'
import spellchecker from './lib.spellcheck'

const postSpellCheck = async function (c: Context) {
  const logger = c.get('logger')
  const body = c.req.valid('json')

  const lMessage = {
    user: 1, // req.user.id,
    tool: c.req.header('User-Agent'),
    service: 'spellcheck',
    kreyol: body.kreyol,
    request:body.request.replace(/ç/, 's'),
  }
  console.log(lMessage)
  return spellchecker
  .check(lMessage)
  .then(async (msg) => {
	console.log(msg)
	lMessage.response = msg
	return c.json(lMessage, 200)
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
