import { createRouter, sendBadRequest } from '#services/hono'
import handlers from './verify.handlers'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const postVerifyMailParam = z.object({
  token: z
    .string()
    .min(1)
    .regex(/[A-Za-z0-9]{64}/),
})

const postResetPwdTokenSchema = z
  .object({
    password: z.string().min(5),
    verification: z.string(),
    token: z
      .string()
      .min(1)
      .regex(/[A-Za-z0-9]{64}/),
  })
  .refine((data) => data.password === data.verification, {
    message: 'Password confirmation does not match password',
    path: ['verification'], // path of error
  })

const postResetPwdSchema = z.object({
  email: z.string().min(1).email(),
})

const getByTokenParam = z.object({
  token: z
    .string()
    .min(1)
    .regex(/[A-Za-z0-9]{64}/),
})

const verifyRoutes = createRouter()

verifyRoutes.get(
  '/mail/:token',
  zValidator('param', postVerifyMailParam, sendBadRequest),
  handlers.verifyMail
)

verifyRoutes.post(
  '/resetpwdtoken',
  zValidator('json', postResetPwdTokenSchema, sendBadRequest),
  handlers.postResetPwdToken
)

verifyRoutes.post(
  '/resetpwd',
  zValidator('json', postResetPwdSchema, sendBadRequest),
  handlers.postResetPwd
)

verifyRoutes.get(
  '/bytoken/:token',
  zValidator('param', getByTokenParam, sendBadRequest),
  handlers.getByToken
)

export default verifyRoutes
