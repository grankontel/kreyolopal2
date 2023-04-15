import winston from 'winston'
import { Context, HonoRequest } from 'hono'
import { createHttpException } from './createHttpException'

export type paramChecker = (r: HonoRequest, logger: winston.Logger) => boolean

export const paramValidate = (c: Context, checker: paramChecker) =>
  new Promise<Context>((resolve, reject) => {
    if (!checker(c.req, c.get('logger'))) {
      const errorContent = { status: 'error' }
      const responseOptions = {
        status: 422,
        statusText: 'Unprocessable Entity',
      }

      reject(createHttpException({ errorContent, responseOptions }))
      return
    }

    resolve(c)
  })
