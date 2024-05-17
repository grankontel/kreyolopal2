import type { Context } from "hono"
import type { PoolClient } from "pg"

import config from '#config'
import { sendFromEmail } from '#services/mail'
import { getContact, getContactus } from '@kreyolopal/mails'

const contact = async function (c: Context) {
	const logger = c.get('logger')
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const body = c.req.valid('json')

	const { firstname, lastname, email, subject, message } = body

	const templateData = {
		user: {
			firstname,
			lastname,
			email,
		},
		subject,
		message,
	}

	return sendFromEmail(
		getContactus,
		templateData,
		`[Kreyolopal] ${subject}`,
		`'${firstname} ${lastname}' <${email}>`,
		config.mail.webmaster
	)
		.tap(async () => {
			await sendFromEmail(
				getContact,
				templateData,
				'[Kreyolopal]Mésaj a-w rivé',
				config.mail.webmaster,
				`'${firstname} ${lastname}' <${email}>`
			)
		})
		.then(
			() => {
				logger.info('Just sent mail')
				c.status(200)
				return c.json({
					status: 'success',
					data: {},
				})
			},
			(reason: any) => {
				logger.error(reason)
				c.status(500)

				return c.json({ status: 'error', error: [reason] })
			}
		)
}

export default { contact }
