import express from 'express';
import { body, param } from 'express-validator'
import handlers from './contact.handlers'
const routes = express.Router()

routes.post(
  '/',
  body('firstname').notEmpty(),
  body('lastname').notEmpty(),
  body('email').isEmail(),
  body('subject').notEmpty(),
  body('message').notEmpty(),
  handlers.postContact
)

export default routes
