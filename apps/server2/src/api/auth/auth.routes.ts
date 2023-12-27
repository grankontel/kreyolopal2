import { createRouter } from '../../services/hono'
import authHandlers from './auth.handlers'
import validator from 'validator'
import { HTTPException } from 'hono/http-exception'
import {
  ValidateBody,
  paramChecker,
  paramValidate,
  requestHandler,
  schemaValidator,
  setBody,
} from '../../utils/apiHelpers'
import { createHttpException } from '../../utils/createHttpException'
import { Context } from 'hono'

const authRoutes = createRouter()
// login
authRoutes.post('/login', async (c) => {
  return ValidateBody(
    c,
    (r, logger) => {
      const { email, password } = c.get('body')

      if (email === undefined || !validator.isEmail(email)) {
        logger.warn('email is not valid')
        return false
      }
      if (password === undefined || validator.isEmpty(password)) {
        logger.warn('password is empty')
        return false
      }
      return true
    },
    (c) => {
      const { email, password } = c.get('body')
      console.log({ email, password })
      c.status(200)
      return c.json({})
    }
  )

  return setBody(c).then(
    (cx) => {
      return paramValidate(cx, (r, logger) => {
        const { email, password } = cx.get('body')

        if (email === undefined || !validator.isEmail(email)) {
          logger.warn('email is not valid')
          return false
        }
        if (password === undefined || validator.isEmpty(password)) {
          logger.warn('password is empty')
          return false
        }
        return true
      }).then(
        (c) => {
          const { email, password } = c.get('body')
          console.log({ email, password })
          c.status(200)
          return c.json({})
        },
        () => {
          c.status(400)
          return c.json('Bad request')
        }
      )
    },
    (reason) => {
      c.status(400)
      return c.text('Bad request.')
    }
  )

})

// logout
authRoutes.post('/logout', authHandlers.logout)

export default authRoutes
