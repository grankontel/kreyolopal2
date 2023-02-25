import logger from '../../services/logger'
import { validationResult } from 'express-validator'
import { authenticateUser, logUserIn } from './auth'
import userService from '../../services/userService'
import emailService from '../../services/emailService'

const postLogin = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const { email, password } = req.body
  return authenticateUser(email, password).then(
    (user) => {
      if (!user) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized' })
      }

      return logUserIn(user, req).then(
        (result) => {
          result.setCookie(res)
          return res.status(200).json({
            status: 'success',
            data: result.payload,
          })
        },
        (err) => res.json(err)
      )
    },
    (reason) => {
      logger.error(reason)
      return res.status(500).json({ status: 'error', error: 'Internal error' })
    }
  )
}

const postLogout = async function (req, res) {
  res.clearCookie('zakari')
  res.status(200).send({
    status: 'success',
    data: {},
  })
}

const postRegister = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const record = {
    email: req.body.email.toLowerCase(),
    password: req.body.password1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }
  const origin = `${req.protocol}://${req.get('host')}`

  return userService
    .register(record)
    .tap((_saveduser) => {
      logger.info('sending mail')

      const templateData = {
        user: {
          id: _saveduser.id,
          firstname: _saveduser.firstname,
          lastname: _saveduser.lastname,
          email: _saveduser.email,
        },
        confirm_url: `${origin}/api/verify/mail/${_saveduser.email_verif_token}`,
      }
      const recipient_mail = _saveduser.email
      logger.debug('created template data')

      return emailService
        .sendEmail(
          '../mails/verifyemail.mjml',
          templateData,
          `'${_saveduser.firstname} ${_saveduser.lastname}' <${recipient_mail}>`,
          'Kontan vwè-w'
        )
        .then(
          (sent) => logger.info(sent),
          (reason) => {
            logger.error('could not send email')
            logger.error(reason)
          }
        )
    })
    .then(
      () => {
        logger.info('register suceeded')
        return res.status(201).send({
          status: 'success',
          data: {
            email: record.email,
            firstname: record.firstname,
            lastname: record.lastname,
          },
        })
      },
      (reason) => {
        logger.error(reason)
        return res.status(500).send({ status: 'error', error: [reason] })
      }
    )
    .catch((_error) => {
      res.status(500).send({ status: 'error', error: [_error] })
    })
}

export default { postLogin, postLogout, postRegister }
