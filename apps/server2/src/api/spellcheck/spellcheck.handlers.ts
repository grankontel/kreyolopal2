import { Context } from 'hono'
import { getAuth } from '@hono/clerk-auth'
import spellchecker from './lib.spellcheck'

const postSpellCheck = async function (c: Context) {
  const logger = c.get('logger')
  const supabase = c.get('supabase')
  const body = c.req.valid('json')
  const auth = getAuth(c)
  logger.info('postSpellCheck')

  if (!auth?.userId) {
    return c.json(
      {
        message: 'You are not logged in.',
      },
      403
    )
  }

  const lMessage = {
    user: auth?.userId, // req.user.id,
    tool: c.req.header('User-Agent'),
    service: 'spellcheck',
    kreyol: body.kreyol,
    request: body.request.replace(/ç/, 's'),
  }
  logger.debug(JSON.stringify(lMessage))

  return spellchecker
    .check(lMessage)
    .tap(async (msg) => {
      const { data, error } = await supabase
        .from('Spellcheckeds')
        .insert([
          {
            user_id: lMessage.user,
            kreyol: lMessage.kreyol,
            request: lMessage.request,
            status: msg.status,
            message: msg.message,
            response: msg,
          },
        ])
        .select()
      if (error === null)
        lMessage.id = data[0].id
    })
    .then(async (msg) => {
      lMessage.response = msg
      logger.debug(lMessage)
      return c.json(lMessage, 200)
    })
    .catch((_error) => {
      logger.error('postSpellCheck Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const postRating = async function (c: Context) {
  const logger = c.get('logger')
  const supabase = c.get('supabase')
  const id = parseInt(c.req.param('id'))
  const auth = getAuth(c)
  const body = c.req.valid('json')
  const { rating, user_correction, user_notes } = body

  logger.info('postRating')

  if (!auth?.userId) {
    return c.json(
      {
        message: 'You are not logged in.',
      },
      403
    )
  }

  logger.debug({ id, ...body })

  let { data: sp_data, error: sp_error } = await supabase
    .from('Spellcheckeds')
    .select('id', {head: true})
    .eq('id', id)

    logger.debug(sp_data)
  if (sp_error !== null || sp_data?.count == 0) {
    logger.error(sp_error)
    return c.json(
      {
        message: 'Bad request',
      },
      400
    )
  }

  let { data: ratings, error: r_errors } = await supabase
    .from('Ratings')
    .select()
    .eq('spellchecked_id', id)

  if (r_errors !== null) {
    logger.error(r_errors)
    return c.json(
      {
        message: 'Internal Error',
      },
      500
    )
  }

  if (ratings.length === 0) {

    let value = { spellchecked_id: id, rating, user_correction, user_notes }
    logger.info(`attempt to create rating ${value}`)

    let { data, error } = await supabase
      .from('Ratings')
      .insert([
        value,
      ])
      .select('id')

    if (error !== null) {
      logger.error(error)
      return c.json(
        {
          message: 'Internal Error',
        },
        500
      )
    }

    return c.json({ id: data[0].id },200)
  }

  let rating_id = ratings[ratings.length -1].id
  let value = {}

  value.rating = rating
  if (user_correction !== undefined)
    value.user_correction = user_correction
  if (user_notes !== undefined) value.user_notes = user_notes


  logger.info(`attempt to update rating ${value}`)
let { data, error } = await supabase
  .from('Ratings')
  .update(value)
  .eq('id', rating_id)
  .select()
          
  if (error !== null) {
    logger.error(error)
    return c.json(
      {
        message: 'Internal Error',
      },
      500
    )
  }
  return c.json({ id: data[0].id },200)

}

export default { postSpellCheck, postRating /*, getSpellChecks */ }
