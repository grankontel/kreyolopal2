import { getTurnstileHandler } from '@kreyolopal/web-ui'

const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const secret = process.env.TURNSTILE_SECRETKEY

const handler = getTurnstileHandler(secret, verifyEndpoint)

export default handler
