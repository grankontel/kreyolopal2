import { lucia, createCookie, parseCookie } from '#lib/auth'
import { getCookie, setCookie } from 'hono/cookie'
import type { MiddlewareHandler } from 'hono'
import { winston_logger } from '#services/winston_logger'
import type { User } from 'lucia'

export const sessionMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const cookie = getCookie(c, lucia.sessionCookieName) ?? null

    let sessionId = parseCookie(cookie)?.session_id
    const authorizationHeader = c.req.header('Authorization')
    sessionId = sessionId ?? lucia.readBearerToken(authorizationHeader ?? '')
    winston_logger.debug(`sessionId = ${sessionId}`)

    if (!sessionId) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }
    const { session, user } = await lucia.validateSession(sessionId)
    winston_logger.debug(JSON.stringify({ session, user }))
    if (session && session.fresh) {
      const theCookie = createCookie(session.id, user)
      setCookie(c, theCookie.name, theCookie.value, {
        ...theCookie.attributes,
        httpOnly: false,
      })
    }
    if (!session) {
      c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
        append: true,
      })
    }
    c.set('user', user)
    c.set('session', session)
    const childLogger = winston_logger.child(user as User);
    c.set('logger', childLogger)
    return next()
  }
}
