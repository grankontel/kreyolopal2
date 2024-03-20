// 'use server'
export function parseCookie(cookie) {
  if (cookie === undefined) return null
  const [data, digest] = cookie.split('.')

  try {
    const info = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
    return info

  } catch (error) {
    return null
  }
}
