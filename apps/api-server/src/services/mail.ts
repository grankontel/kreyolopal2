import bluebird from 'bluebird'
import { mailer, SendMailResult } from './mailer'
import config from '#config'
import logger from '#services/logger'

import type { mailTemplateFunction } from '@kreyolopal/mails'

function send(message: any, sourceName: string | undefined) {
  return new bluebird.Promise(async (resolve, reject) => {
    await mailer.sendMail(message).then((result: SendMailResult) => {
      if (result.error) {
        logger.warn(`email ${sourceName} NOT sent`)
        reject(new Error(result.error))
        return
      }

      logger.info(`email ${sourceName} sent`)
      resolve(result.data)
    })
  })
}

export const sendFromEmail = (
  templateFunction: mailTemplateFunction,
  templateData: any,
  subject: string,
  replyTo: string,
  recipient: string
) => {
  const email = templateFunction(templateData)

  const message = {
    'h:Reply-To': replyTo,
    from: config.mail.from,
    to: recipient, // _saveduser.email,
    subject,
    text: email.text,
    html: email.html,
  }

  return send(message, templateFunction.sourceName)
}

export const sendEmail = (
  templateFunction: mailTemplateFunction,
  templateData: any,
  subject: string,
  recipient: string
) => {
  const email = templateFunction(templateData)

  const message = {
    from: config.mail.from,
    to: recipient, // _saveduser.email,
    subject,
    text: email.text,
    html: email.html,
  }

  return send(message, templateFunction.sourceName)
}
