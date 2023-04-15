import Ajv from 'ajv'
import validator from 'validator'
import { HTTPException } from 'hono/http-exception'
import { Context } from 'hono'
import schema from './schema-entry.json'
import { createRouter } from '../../services/hono'
import { createHttpException } from '../../utils/createHttpException'
import handlers from './words.handlers'
import { paramValidate } from '../../utils/apiHelpers'

const ajv = new Ajv({ allErrors: true }) // options can be passed, e.g. {allErrors: true}

const validate = ajv.compile(schema)

const schemaValidate = (c: Context) =>
  new Promise<Context>((resolve, reject) => {
    const logger = c.get('logger')
    const data = c.req.json()
    const valid = validate(data)
    if (!valid) {
      logger.error(
        validate.errors?.map((e) => `${e.instancePath} ${e.message}`).join(';')
      )

      const errorContent = { status: 'error', error: validate.errors }
      const responseOptions = {
        status: 422,
        statusText: 'Unprocessable Entity',
      }

      reject(createHttpException({ errorContent, responseOptions }))
      return
      // c.status(422)
      // c.json({ status: 'error', error: validate.errors })
    }

    resolve(c)
  })

// get suggestion
const routes = createRouter()

routes.get('/', handlers.getWords)
routes.post('/', (c) =>
  schemaValidate(c).then(handlers.postWord, (reason: HTTPException) => {
    throw reason
  })
)
routes.get('/:id', (c) =>
  paramValidate(c, (r, logger) => {
    if (validator.isEmpty(r.param('id'))) {
      logger.warn('id is empty')
      return false
    }
    return true
  })
    .then(handlers.getOneWord, (reason: HTTPException) => {
      throw reason
    })
)
routes.delete('/:id', (c) =>
  paramValidate(c, (r, logger) => {
    if (validator.isEmpty(r.param('id'))) {
      logger.warn('id is empty')
      return false
    }
    return true
  })
    .then(schemaValidate, (reason: HTTPException) => {
      throw reason
    })
    .then(handlers.deleteOneWord, (reason: HTTPException) => {
      throw reason
    })
)
routes.put('/:id', (c) =>
  paramValidate(c, (r, logger) => {
    if (validator.isEmpty(r.param('id'))) {
      logger.warn('id is empty')
      return false
    }
    return true
  })
    .then(schemaValidate, (reason: HTTPException) => {
      throw reason
    })
    .then(handlers.replaceWord, (reason: HTTPException) => {
      throw reason
    })
)

export default routes
