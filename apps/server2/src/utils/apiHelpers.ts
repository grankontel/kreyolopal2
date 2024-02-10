import { ValidateFunction } from 'ajv'
import winston from 'winston'
import { Context, HonoRequest } from 'hono'
import { createHttpException } from './createHttpException'
import { Response } from 'node-fetch'
import { winston_logger as logger } from '#services/winston_logger'

export type paramChecker = (r: HonoRequest, logger: winston.Logger) => boolean
export type requestHandler = (c: Context) => Response

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

export const setBody = (c: Context) =>
  new Promise<Context>((resolve, reject) => {
    c.req
      .json()
      .then((data) => {
        c.set('body', data)
        resolve(c), (reason) => reject(reason)
      })
      .catch((e) => {
        reject(`SetBody: ${e.message}`)
      })
  })

export const ValidateBody = (
  c: Context,
  checker: paramChecker,
  handler: requestHandler
) => {
  return setBody(c).then(
    (cx) => {
      return paramValidate(cx, checker).then(handler, () => {
        c.status(400)
        return c.json('Bad request')
      })
    },
    (reason) => {
      logger.warn(reason)
      c.status(400)
      return c.text('Bad request.')
    }
  )
}

export const schemaValidator = (
  c: Context,
  validateFn: ValidateFunction<unknown>
) =>
  new Promise<Context>((resolve, reject) => {
    const logger = c.get('logger')
    const data = c.get('body')

    const valid = validateFn(data)
    if (!valid) {
      logger.error(
        validateFn.errors
          ?.map((e) => `${e.instancePath} ${e.message}`)
          .join(';')
      )

      const errorContent = { status: 'error', error: validateFn.errors }
      const responseOptions = {
        status: 422,
        statusText: 'Unprocessable Entity',
      }

      reject(createHttpException({ errorContent, responseOptions }))
      return
      // c.status(422)
      // c.json({ status: 'error', error: validate.errors })
    }

    resolve(c)
  })
