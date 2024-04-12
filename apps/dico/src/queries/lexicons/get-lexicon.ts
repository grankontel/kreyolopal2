'use server'

import { cookies } from 'next/headers'
import { apiServer, cookieName, ResponseError } from '@/lib/types'
import { parseCookie } from '@/lib/utils'
import { Lexicon } from '@/lib/lexicons/types'

export async function getLexicon(username: string, slug: string) : Promise<Lexicon> {
	const cookieValue = cookies().get(cookieName)
	const auth = parseCookie(cookieValue?.value || '')

	const { user_id, session_id } = auth || { user_id: null, session_id: null }
	if (session_id === null)
		return Promise.reject(new Error('not logged in'))
	const myHeaders = new Headers()
	myHeaders.set('Content-Type', 'application/json')
	myHeaders.set('Authorization', `Bearer ${session_id}`)

	return fetch(apiServer + `/api/lexicons/${username}/${slug}`, {
		method: 'GET',
		//    credentials: 'same-origin',
		headers: myHeaders,
	}).then(async (result) => {
		if (!result.ok) throw new ResponseError('Failed to list lexicons', result)

		return result.json()
	})

}