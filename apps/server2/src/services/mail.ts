import type { mailTemplateFunction } from '@kreyolopal/mails'
import { mailer, SendMailResult } from '#lib/mailer';
import config from '#config';
import { winston_logger as logger } from '#services/winston_logger'

function sendMail(message: any, sourceName: string) {
	return new Promise(async (resolve, reject) => {
		await mailer.sendMail(message)
			.then((result: SendMailResult) => {
				if (result.error) {
					logger.warn(`email ${sourceName} NOT sent`);
					reject(new Error(result.error));
					return;
				}

				logger.info(`email ${sourceName} sent`);
				resolve(new Error(result.data));
			});

	});
}

export const sendFromEmail = (
	templateFunction: mailTemplateFunction,
	templateData: any,
	subject: string,
	replyTo: string,
	recipient: string,
) => {
	const email = templateFunction(templateData)

	const message = {
		'h:Reply-To': replyTo,
		from: config.mail.from,
		to: recipient, // _saveduser.email,
		subject,
		text: email.text,
		html: email.html,
	}

	return sendMail(message, templateFunction.sourceName)

}

export const sendEmail = (templateFunction: mailTemplateFunction,
	templateData: any, recipient: string, subject: string) => {
	const email = templateFunction(templateData)

	const message = {
		from: config.mail.from,
		to: recipient, // _saveduser.email,
		subject,
		text: email.text,
		html: email.html,
	}

	return sendMail(message, templateFunction.sourceName)
}

