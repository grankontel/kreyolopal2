import { Lucia, TimeSpan } from 'lucia'
const { createHmac } = require('node:crypto')
import { adapter } from './db'
import type { DatabaseUser } from './db'
import config from '#config'
import { getUserPermissions } from './permissions'

function getDigest(source: string): string {
  const hmac = createHmac('sha512', config.security.token)
  //passing the data to be hashed
  const data = hmac.update(source)
  //Creating the hmac in the required format
  const digest = data.digest('base64')
  return digest
}

export async function createCookie(session_id: string, user: DatabaseUser) {
  const now = new Date()
  // Add 30 days to now, and zero out hours, minutes, seconds, milliseconds
  now.setDate(now.getDate() + 30)
  const perms = await getUserPermissions(user)

  const info = {
    session_id: session_id,
    user_id: user.id,
    username: user.username,
    permissions: perms, // user.is_admin ? ['validate_proposal'] : [],
    expiresAt: now,
  }

  const infob64 = Buffer.from(JSON.stringify(info)).toString('base64')

  const digest = getDigest(infob64)

  const cookieValue = `${infob64}.${digest}`
  const theCookie = lucia.createSessionCookie(cookieValue)
  return theCookie
}

export function parseCookie(cookie: string | null) {
  if (cookie === null) return null
  const [data, digest] = cookie.split('.')
  if (data === null || digest === null) return null

  const mydigest = getDigest(data)

  if (mydigest != digest) return null

  const info = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
  return info
}

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'h'), // 2 weeks
  sessionCookie: {
    name: 'wabap',
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      is_admin: attributes.is_admin,
      birth_date: attributes.birth_date,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
  }
}
