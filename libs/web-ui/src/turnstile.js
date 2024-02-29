/**
 *
 * @param {string} secret Turnstile secrel key
 * @param {string} verifyEndpoint Cloudflare endpoint for verification
 * @returns a handler for nexts api
 */

export function getTurnstileHandler(
  secret,
  verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
) {
  const handler = async (req, res) => {
    const { token } = req.body
    const result = await fetch(verifyEndpoint, {
      method: 'POST',
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    })

    const data = await result.json()
    res.status(data.success ? 200 : 400).json(data)
  }
  return handler
}
