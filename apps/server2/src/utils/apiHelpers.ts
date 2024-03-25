import { ValidateFunction } from 'ajv'
import winston from 'winston'
import { sign as jwt_sign } from 'jsonwebtoken'
import { createHttpException } from './createHttpException'
import config from '#config'
import { winston_logger as logger } from '#services/winston_logger'

import { setCookie } from 'hono/cookie'
import { lucia, createCookie } from '#lib/auth'
import type { Context, HonoRequest, TypedResponse } from 'hono'
import type { DatabaseUser } from '#lib/db'

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

export function logUserIn(
  c: Context,
  existingUser: DatabaseUser
): Promise<Response & TypedResponse<{}>> {
  return lucia.createSession(existingUser.id, {}).then((session) => {
    const theCookie = createCookie(session.id, existingUser)
    setCookie(c, theCookie.name, theCookie.value, {
      ...theCookie.attributes,
      httpOnly: false,
    })
    c.status(200)
    let response = {
      cookie: theCookie.value,
      firstname: existingUser.firstname,
      lastname: existingUser.lastname
    }
    if (existingUser.is_admin) {
      response.token = jwt_sign(
        { role: 'postgrest', username: existingUser.username },
        config.security.adminSecret
      )
    }
    return c.json(response)
  })
}
