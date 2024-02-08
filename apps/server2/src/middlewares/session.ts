import { lucia, createCookie, parseCookie } from "#lib/auth";
import { getCookie, setCookie } from "hono/cookie";
import type { MiddlewareHandler } from 'hono'
import { winston_logger } from '#services/winston_logger'


export const sessionMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const cookie = getCookie(c, lucia.sessionCookieName) ?? null

    const sessionId = parseCookie(cookie)?.session_id
    winston_logger.debug(`sessionId = ${sessionId}`)

    if (!sessionId) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }
    const { session, user } = await lucia.validateSession(sessionId)
    winston_logger.debug(JSON.stringify({ session, user }))
    if (session && session.fresh) {
      const theCookie = createCookie(session.id, user.id)
      setCookie(c, theCookie.name, theCookie.value, theCookie.attributes)

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
