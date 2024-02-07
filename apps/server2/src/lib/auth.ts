import { Lucia } from 'lucia'
import { adapter } from './db'
import type { DatabaseUser } from './db'

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "wabap",
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
  }
}


