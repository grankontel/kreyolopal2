const { default: axios } = require('axios')
const FormData = require('form-data')
// const Mailgun = require('mailgun.js')

import config from '../config'

const url = `https://api:${config.mail.apiKey}@${config.mail.host}/v3/${config.mail.domain}/messages`

// const url = 'https://kreyol.herokuapp.com/api/pipo'
/* const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
  username: 'api',
  key: config.mail.apiKey,
  url: 'https://api.eu.mailgun.net',
})
 */

export const mailer = {
  // sendMail: (payload) => mg.messages.create(config.mail.domain, payload),
  sendMail: (payload) => {
    const bodyFormData = new FormData()
    Object.keys(payload).forEach((key) => {
      bodyFormData.append(key, payload[key])
    })

    return axios.post(url, bodyFormData, {
      // You need to use `getHeaders()` in Node.js because Axios doesn't
      // automatically set the multipart form boundary in Node.
      headers: bodyFormData.getHeaders(),
    })
  },
}

export default mailer
