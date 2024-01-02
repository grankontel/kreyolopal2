import { Context } from 'hono'
import { getAuth } from '@hono/clerk-auth'
import spellchecker from './lib.spellcheck'

const postSpellCheck = async function (c: Context) {
  const logger = c.get('logger')
  const supabase = c.get('supabase')
  const body = c.req.valid('json')
  const auth = getAuth(c)

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
      /*
          {
    "user": "user_2a81lkpE2baBqFSNEKPfTv8yZyW",
    "tool": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "service": "spellcheck",
    "kreyol": "GP",
    "request": "an lass",
    "response": {
        "status": "success",
        "kreyol": "GP",
        "unknown_words": [],
        "message": "an las"
    }
}
          */
    })
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

  console.log({ id, ...body })
  return c.json({})
}

export default { postSpellCheck, postRating /*, getSpellChecks */ }
