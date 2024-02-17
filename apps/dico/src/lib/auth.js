// 'use server'
export function parseCookie(cookie) {
  if (cookie === undefined) return null
  const [data, digest] = cookie.split('.')

  const info = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
  return info
}
