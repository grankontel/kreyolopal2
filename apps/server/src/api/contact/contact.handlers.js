import { validationResult } from 'express-validator'
import config from '../../config'
import logger from '../../services/logger'
import emailService from '../../services/emailService'

const postContact = async function (req, res) {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.array() })
  }

  const { firstname, lastname, email, subject, message } = req.body

  const templateData = {
    user: {
      firstname,
      lastname,
      email,
    },
    subject,
    message,
  }

  return emailService
    .sendFromEmail(
      `'${firstname} ${lastname}' <${email}>`,
      '../mails/contactus.mjml',
      templateData,
      config.mail.webmaster,
      `[Kreyolopal] ${subject}`
    )
    .tap(() =>
      emailService.sendFromEmail(
        config.mail.webmaster,
        '../mails/contact.mjml',
        templateData,
        `'${firstname} ${lastname}' <${email}>`,
        '[Kreyolopal]Mésaj a-w rivé'
      )
    )
    .then(
      () => {
        logger.info('Just sent mail')

        return res.status(200).json({
          status: 'success',
          data: {},
        })
      },
      (reason) => {
        logger.error(reason)
        return res.status(500).send({ status: 'error', error: [reason] })
      }
    )
}

export default { postContact }
