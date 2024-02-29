import Ajv from 'ajv'
import validator from 'validator'
import { HTTPException } from 'hono/http-exception'
import type { Context } from 'hono'
import schema from './schema-entry.json'
import { createRouter } from '#services/hono'
import handlers from './words.handlers'
import { paramValidate, schemaValidator, setBody } from '#utils/apiHelpers'

const ajv = new Ajv({ allErrors: true }) // options can be passed, e.g. {allErrors: true}

const validate = ajv.compile(schema)
const schemaValidate = (c: Context) => schemaValidator(c, validate)

// get suggestion
const routes = createRouter()

routes.get('/', handlers.getWords)
routes.post('/', (c) =>
  setBody(c)
    .then(schemaValidate)
    .then(handlers.postWord, (reason: HTTPException) => {
      throw reason
    })
)
routes.get('/:id', (c) =>
  paramValidate(c, (r, logger) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (validator.isEmpty(r.param('id'))) {
      logger.warn('id is empty')
      return false
    }
    return true
  }).then(handlers.getOneWord, (reason: HTTPException) => {
    throw reason
  })
)
routes.delete('/:id', (c) =>
  paramValidate(c, (r, logger) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (validator.isEmpty(r.param('id'))) {
      logger.warn('id is empty')
      return false
    }
    return true
  })
    .then(setBody)
    .then(schemaValidate, (reason: HTTPException) => {
      throw reason
    })
    .then(handlers.deleteOneWord, (reason: HTTPException) => {
      throw reason
    })
)
routes.put('/:id', (c) =>
  paramValidate(c, (r, logger) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (validator.isEmpty(r.param('id'))) {
      logger.warn('id is empty')
      return false
    }
    return true
  })
    .then(setBody)
    .then(schemaValidate, (reason: HTTPException) => {
      throw reason
    })
    .then(handlers.replaceWord, (reason: HTTPException) => {
      throw reason
    })
)

export default routes
