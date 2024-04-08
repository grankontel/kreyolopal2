const url = new URL(c.req.url)
const origin = `${url.protocol}://${url.host}`
const mailToken = authService.generateVerifToken(email)

logger.info('sending mail')

const templateData = {
  user: {
    id: createdUser.id,
    firstname: firstname,
    lastname: lastname,
    email: email,
  },
  confirm_url: `${origin}/api/verify/mail/${mailToken}`,
}
const recipient_mail = email
logger.debug('created template data')

sendEmail(
  getVerifyemail,
  templateData,
  'Kontan vwè-w',
  `'${firstname} ${lastname}' <${recipient_mail}>`
).then(
  (sent) => logger.info(sent),
  (reason) => {
    logger.error('could not send email')
    logger.error(reason)
  }
)
