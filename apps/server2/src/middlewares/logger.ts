import type { HonoRequest, MiddlewareHandler } from 'hono'
import { winston_logger } from '../services/winston_logger'

const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.']

  const orderTimes = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delimiter)
  )

  return orderTimes.join(separator)
}

const time = (start: number) => {
  const delta = Date.now() - start
  return humanize([
    delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's',
  ])
}

const parseIp = (req: HonoRequest) =>
  req.headers['x-forwarded-for']?.split(',').shift() || undefined

export const logger = (): MiddlewareHandler => {
  return async (c, next) => {
    const { method } = c.req

    const url = new URL(c.req.url)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const path = url.pathname

    const extra = {
      method: method,
      path: path,
      ip: parseIp(c.req),
      host: c.req.header('Host'),
      'user-agent': c.req.header('User-Agent'),
    }
//    winston_logger.info(`request : ${method} ${path}`, extra)

    const start = Date.now()

    await next()
    const service = time(start)

    const rextra = { ...extra, status: c.res.status, service: service }
    winston_logger.info(
      `response : ${method} ${path} code: ${c.res.status} ${service}`,
      rextra
    )
    // log(fn, LogPrefix.Outgoing, method, path, c.res.status, time(start))
  }
}