import express from 'express';
import { body, param } from 'express-validator'
import handlers from './profile.handlers'
const routes = express.Router()

// get suggestion
routes.get('/', handlers.getProfile)

routes.post(
  '/',
  body('firstname').notEmpty(),
  body('lastname').notEmpty(),
  body('gender').optional().isIn(['Homme', 'Femme']),
  handlers.postProfile
)

routes.post(
  '/updatepwd',
  // password must be at least 6 chars long
  body('currentPassword'),
  body('newPassword').isLength({ min: 5 }),
  body('verification').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
  handlers.postUpdatePwd
)

routes.post(
  '/resetpwd',
  // password must be at least 6 chars long
  body('token')
    .notEmpty()
    .custom((value) => {
      const isToken = /[A-Za-z0-9]{64}/
      return value.length > 0 && isToken.test(value)
    }),
  body('newPassword').isLength({ min: 5 }),
  body('verification').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
  handlers.postResetPwd
)

export default routes
