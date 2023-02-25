import express from 'express'
import { check, param } from 'express-validator'
import handlers from './words.handlers'

const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true }) // options can be passed, e.g. {allErrors: true}
import schema from './schema-entry.json'
import logger from '../../services/logger'

const validate = ajv.compile(schema)
const schemaMiddleware = (req, res, next) => {
  const data = req.body
  const valid = validate(data)
  if (!valid) {
    logger.error(
      validate.errors.map((e) => `${e.instancePath} ${e.message}`).join(';')
    )
    return res.status(422).json({ status: 'error', error: validate.errors })
  }
  next()
}
const routes = express.Router()

// get suggestion
routes.get('/', handlers.getWords)
routes.post('/', schemaMiddleware, handlers.postWord)
routes.get('/:id', param('id').notEmpty(), handlers.getOneWord)
routes.delete('/:id', param('id').notEmpty(), handlers.deleteOneWord)
routes.put(
  '/:id',
  schemaMiddleware,
  param('id').notEmpty(),
  handlers.replaceWord
)

export default routes
