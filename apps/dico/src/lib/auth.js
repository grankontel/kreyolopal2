export function parseCookie(cookie) {
	'use server';

	if (cookie === undefined)
		return null
	const [data, digest] = cookie.split('.')

	const info = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
	return info
}

export function getUser(useCookies) {
	'use client';

	const data = document.cookie
	return parseCookie(cookies)?.user_id
}