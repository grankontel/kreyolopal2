import type { MiddlewareHandler } from 'hono'
import { winston_logger as logger } from '#services/winston_logger'

export const adminMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user')
    logger.debug(user)
    if (!user || !user.is_admin) {
        logger.warn('user is not admin')
        return c.body(null, 403)
    }
    return next()
  }
}
