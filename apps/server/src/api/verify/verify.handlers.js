import { validationResult } from 'express-validator'
import logger from '../../services/logger'
import userService from '../../services/userService'
import emailService from '../../services/emailService'
import authService from '../../services/authService'

const verifyMail = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const { token } = req.params

  return User.findOne({ where: { email_verif_token: token } }).then((_user) => {
    if (_user === null) {
      return res.status(404).json({ status: 'error', error: 'Not Found' })
    }

    _user.email_verif_token = null
    return logUserIn(_user, req).then(
      (result) => {
        result.setCookie(res)
        return res.redirect('/verified')
      },
      (err) => res.json(err)
    )
  })
}

const postResetPwdToken = async function (req, res) {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const { password, token } = req.body
  return User.findOne({ where: { reset_pwd_token: token } })
    .then(
      async (profile) => {
        if (profile === null) {
          return res.status(404).json({ status: 'error', error: 'Not Found' })
        }

        profile.password = await authService.hashPassword(password)
        profile.reset_pwd_token = null
        profile.save()

        const lUser = {
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
        }

        return res.json({
          status: 'success',
          data: { profile: lUser },
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

const postResetPassword = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const { email } = req.body
  const origin = `${req.protocol}://${req.get('host')}`

  return userService.resetPwdToken(email).then((retrievedUser) => {
    if (retrievedUser === null) {
      // silently stop
      return res.status(200).json({
        status: 'success',
        data: {},
      })
    }

    logger.info('sending reset pwd mail')

    const templateData = {
      user: {
        id: retrievedUser.id,
        firstname: retrievedUser.firstname,
        lastname: retrievedUser.lastname,
        email: retrievedUser.email,
      },
      confirm_url: `${origin}/resetpwd/${retrievedUser.reset_pwd_token}`,
    }
    const recipient_mail = retrievedUser.email

    return emailService
      .sendEmail(
        '../mails/resetpwd.mjml',
        templateData,
        `'${retrievedUser.firstname} ${retrievedUser.lastname}' <${recipient_mail}>`,
        'Chanjé modpas'
      )
      .then(() => {
        logger.info('Just sent mail')

        return res.status(200).json({
          status: 'success',
          data: {},
        })
      })
  })
}

export default { verifyMail, postResetPwdToken, postResetPassword }
