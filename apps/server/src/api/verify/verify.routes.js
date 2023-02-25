import express from 'express';
import { body, param } from 'express-validator'
import handlers from './verify.handlers'
const routes = express.Router()

routes.get(
  '/mail/:token',

  param('token')
    .notEmpty()
    .custom((value) => {
      const isToken = /[A-Za-z0-9]{64}/
      return value.length > 0 && isToken.test(value)
    }),

  handlers.verifyMail
)

routes.post(
  '/resetpwdtoken',

  body('password').isLength({ min: 5 }),
  body('verification').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
  body('token')
    .notEmpty()
    .custom((value) => {
      const isToken = /[A-Za-z0-9]{64}/
      return value.length > 0 && isToken.test(value)
    }),
  handlers.postResetPwdToken
)

routes.post('/resetpwd', body('email').isEmail(), handlers.postResetPassword)

routes.get(
  '/bytoken/:token',

  param('token')
    .notEmpty()
    .custom((value) => {
      const isToken = /[A-Za-z0-9]{64}/
      return value.length > 0 && isToken.test(value)
    }),

  handlers.getByToken
)
export default routes
