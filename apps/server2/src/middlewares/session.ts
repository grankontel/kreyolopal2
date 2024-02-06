import { lucia } from "#lib/auth";
import { getCookie } from "hono/cookie";
import type { MiddlewareHandler } from 'hono'
import { winston_logger } from '#services/winston_logger'


export const sessionMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
    winston_logger.debug(`sessionId = ${sessionId}`)

    if (!sessionId) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }
    const { session, user } = await lucia.validateSession(sessionId)
    winston_logger.debug(JSON.stringify({ session, user }) )
    if (session && session.fresh) {
      // use `header()` instead of `setCookie()` to avoid TS errors
      c.header(
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
        {
          append: true,
        }
      )
    }
    if (!session) {
      c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
        append: true,
      })
    }
    c.set('user', user)
    c.set('session', session)
    return next()
  }
}
