import fetch from 'node-fetch';
import FormData from 'form-data';
import config from '#config';
import { winston_logger as logger } from '#services/winston_logger'

export interface SendMailResult {
	status: number;
	data?: any;
	error?: any;
}

// Mailgun api endpoint
const url = `https://${config.mail.host}/v3/${config.mail.domain}/messages`;
// Mailgun credentials must be base64 encoded for Basic authentication
const credentials = Buffer.from(`api:${config.mail.apiKey}`).toString('base64');

export const mailer = {
	// sendMail: (payload) => mg.messages.create(config.mail.domain, payload),
	sendMail: (payload: Record<string, any>): Promise<SendMailResult> => {
		const bodyFormData = new FormData()
		Object.keys(payload).forEach((key) => {
			bodyFormData.append(key, payload[key])
		})

		return fetch(url, {
			method: 'POST',
			headers: {
				"Authorization": `Basic ${credentials}`
			},
			body: bodyFormData
		}).then(async (resp) => {
			// handle response errors or OK data
			if (resp.status <= 201) {
				// Success
				const output = await resp.json();
				logger.info("mailer:uccess", output);
				return { status: 201, data: output }
			} else {
				logger.error(resp.status, resp.statusText);
				// pass the Mailgun error to the REST API client
				return { status: resp.status, error: resp.statusText }
			}
		})
	},
}

export default mailer
