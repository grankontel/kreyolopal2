import { Context } from 'hono'

const postSpellCheck = async function (c: Context) {
  const logger = c.get('logger')
  const body = c.req.valid('json')

  console.log(body)
  return c.json({})
}

const postRating = async function (c: Context) {
  const logger = c.get('logger')
  const id = parseInt(c.req.param('id'))
  const body = c.req.valid('json')

  console.log({id, ...body})
  return c.json({})
}

export default { postSpellCheck, postRating /*, getSpellChecks */ }
