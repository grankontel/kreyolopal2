import express from 'express';
import { body, param } from 'express-validator'
import handlers from './auth.handlers'
const routes = express.Router()

// get suggestion
routes.post(
  '/login',

  // username must be an email
  body('email').isEmail(),
  // password must be at least 6 chars long
  body('password').isString(),

  handlers.postLogin
)

routes.post('/logout', handlers.postLogout)

routes.post(
  '/register',

  body('email').isEmail(),
  // password must be at least 6 chars long
  body('password1').isLength({ min: 5 }),
  body('password2').custom((value, { req }) => {
    if (value !== req.body.password1) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
  body('firstname').notEmpty(),
  body('lastname').notEmpty(),
  body('gender').optional().isIn(['Homme', 'Femme']),

  handlers.postRegister
)

export default routes
