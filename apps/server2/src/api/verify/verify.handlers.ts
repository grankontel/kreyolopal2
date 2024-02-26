import type { Context } from 'hono'
import type { PoolClient } from 'pg'
import { DatabaseUser } from '#lib/db'
import { logUserIn } from '#utils/apiHelpers'
import { createHttpException } from '#utils/createHttpException'
import { argon2 } from '#utils/argon'
import { authService } from '#services/authService'
import { getResetpwd } from '@kreyolopal/mails'
import { sendEmail } from '#services/mail'

const verifyMail = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const token = c.req.param('token')

  return pgPool
    .query(
      `UPDATE auth_user 
	SET email_verif_token = null,
	lastlogin= NOW() 
	WHERE email_verif_token = $1 
	RETURNING id, username, password, is_admin`,
      [token]
    )
    .then((result) => {
      if (!result?.rowCount) return c.json({ error: 'Not Found.' }, 404)
      const existingUser = result?.rows[0] as DatabaseUser
      return logUserIn(c, existingUser)
    })
    .catch((_error) => {
      logger.error('verifyMail Exception', _error)
      return c.json({ status: 'error', error: [_error] }, 500)
    })
}

const postResetPwdToken = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { password, token } = c.req.valid('json') as Record<string, string>
  return pgPool
    .connect()
    .then(
      async (client: PoolClient) => {
        const result = await client.query(
          'SELECT id FROM auth_user WHERE email_verif_token = $1',
          [token]
        )

        if (!result?.rowCount) return c.json({ error: 'Not Found.' }, 404)

        const user_id = result?.rows[0].id
        const hashedPassword = await argon2.hash(password)

        return client
          .query(
            'UPDATE auth_user SET email_verif_token=null, password=$1 WHERE id= $2',
            [hashedPassword, user_id]
          )
          .then(
            () => {
              c.status(200)
              return c.json({})
            },
            (reason) => {
              console.log('reason')
              logger.error(reason?.message)
              throw createHttpException({
                errorContent: { error: 'Unknown error..' },
                status: 500,
                statusText: 'Unknown error.',
              })
            }
          )
      },
      (reason) => {
        console.log('reason')
        logger.error(reason?.message)
        throw createHttpException({
          errorContent: { error: 'Unknown error..' },
          status: 500,
          statusText: 'Unknown error.',
        })
      }
    )
    .catch((e) => {
      logger.error(e.message)
      throw createHttpException({
        errorContent: { error: 'Unknown error..' },
        status: 500,
        statusText: 'Unknown error.',
      })
    })
}

const postResetPwd = async function (c: Context) {
  const logger = c.get('logger')
  const pgPool = c.get('pgPool')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { email } = c.req.valid('json') as Record<string, string>
  const url = new URL(c.req.url)
  const origin = `${url.protocol}://${url.host}`

  const newToken = authService.generateVerifToken(email)
  return pgPool
    .query(
      `UPDATE auth_user 
		SET email_verif_token = $1 
		WHERE email = $2 
		RETURNING id, firstname, lastname, email`,
      [newToken, email]
    )
    .then((result) => {
      if (!result?.rowCount)
        return c.json(
          {
            status: 'success',
            data: {},
          },
          200
        )

      logger.info('sending reset pwd mail')
      const retrievedUser = result.rows[0]

      const templateData = {
        user: {
          id: retrievedUser.id,
          firstname: retrievedUser.firstname,
          lastname: retrievedUser.lastname,
          email: retrievedUser.email,
        },
        confirm_url: `${origin}/resetpwd/${newToken}`,
      }

      return sendEmail(
        getResetpwd,
        templateData,
        'Chanjé modpas',
        `'${retrievedUser.firstname} ${retrievedUser.lastname}' <${retrievedUser.email}>`
      ).then(() => {
        logger.info('Just sent mail')

        return c.json(
          {
            status: 'success',
            data: {},
          },
          200
        )
      })
    })
}

export default { verifyMail, postResetPwdToken, postResetPwd }
