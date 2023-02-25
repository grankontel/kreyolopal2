const Promise = require('bluebird')
const mustache = require('mustache')
const mjml = require('mjml')
const { htmlToText } = require('html-to-text')
const NodeCache = require('node-cache')

const path = require('path')
const fs = require('fs/promises')

import config from '../config'
import logger from './logger'
import mailer from './lib.mailer'

const myCache = new NodeCache()

/**
 * Get the content of the template
 * @param {string} templateFilename The template file name
 * @returns contents of the template
 */
const getTemplate = (templateFilename) => {
  const name = templateFilename.toLowerCase()
  const lFile = path.join(__dirname, templateFilename)

  return new Promise((resolve, reject) => {
    const value = myCache.get(name)
    if (value !== undefined) resolve(value)

    fs.readFile(lFile, 'utf-8').then(
      (content) => {
        myCache.set(name, content)
        resolve(content)
      },
      (reason) => reject(reason)
    )
  })
}

/**
 * Create an email
 * @param {string} templateFilename - The mjml template file
 * @param {object} templateData - The mjml template data
 * @returns {Promise} a Promise to create the email
 */
const makeEmail = (templateFilename, templateData) =>
  new Promise((resolve, reject) => {
    getTemplate(templateFilename).then(
      (mjmlTemplate) => {
        if (!mjmlTemplate) {
          reject(new Error(`No such template ${templateFilename}`))
          return
        }

        const renderedMjml = mustache.render(mjmlTemplate, templateData)

        const { html } = mjml(renderedMjml)
        const text = htmlToText(html, { wordwrap: 130 })

        resolve({ html, text })
      },
      (reason) => reject(reason)
    )
  })

/**
 *
 * @param {string} replyTo Sender of the Email
 * @param {string} templateFilename The MJML templatefile
 * @param {object} templateData The MJML template data
 * @param {string} recipient Recipient of the email
 * @param {string} subject The subject of the email
 * @returns {Promise} a Promise to send the email
 */
const sendFromEmail = (
  replyTo,
  templateFilename,
  templateData,
  recipient,
  subject
) =>
  new Promise((resolve, reject) => {
    makeEmail(templateFilename, templateData).then(
      (email) => {
        const message = {
          'h:Reply-To': replyTo,
          from: config.mail.from,
          to: recipient, // _saveduser.email,
          subject,
          text: email.text,
          html: email.html,
        }

        mailer.sendMail(message).then(
          (info) => {
            logger.info(`email ${templateFilename} sent`)
            resolve(info.data)
          },
          (err) => {
            logger.warn(`email ${templateFilename} NOT sent`)
            reject(err.response.data)
          }
        )
      },
      (reason) => {
        logger.error('could not make email')
        reject(reason)
      }
    )
  })

/**
 *
 * @param {string} templateFilename The MJML templatefile
 * @param {object} templateData The MJML template data
 * @param {string} recipient Recipient of the email
 * @param {string} subject The subject of the email
 * @returns {Promise} a Promise to send the email
 */
const sendEmail = (templateFilename, templateData, recipient, subject) =>
  new Promise((resolve, reject) => {
    makeEmail(templateFilename, templateData).then(
      (email) => {
        const message = {
          from: config.mail.from,
          to: recipient, // _saveduser.email,
          subject,
          text: email.text,
          html: email.html,
        }

        mailer.sendMail(message).then(
          (info) => {
            logger.info(`email ${templateFilename} sent`)
            resolve(info.data)
          },
          (err) => {
            logger.warn(`email ${templateFilename} NOT sent`)
            reject(err.response.data)
          }
        )
      },
      (reason) => {
        logger.error('could not make email')
        reject(reason)
      }
    )
  })

export const emailService = { getTemplate, sendEmail, sendFromEmail }
export default emailService
