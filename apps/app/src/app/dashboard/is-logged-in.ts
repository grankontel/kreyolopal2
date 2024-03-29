import { cookies } from 'next/headers'
import { parseCookie } from '@/lib/utils'

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export const isLoggedIn = () => {
	const cookieValue = cookies().get(cookieName)
  if (cookieValue === undefined) {
    return false
  }
  const auth = parseCookie(cookieValue.value)

  console.log('***** is logged in  *****')
  
  if (auth?.session_id === undefined) {
    cookies().delete(cookieName)
    return false
  }

	return auth?.session_id
}