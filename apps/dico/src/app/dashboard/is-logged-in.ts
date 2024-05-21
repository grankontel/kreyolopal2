import { cookies } from 'next/headers'
import { parseCookie } from '@/lib/utils'
import { Permission } from '@kreyolopal/domain'

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

let _permissions: Permission[] | undefined = undefined

export const getPermissions = (): Permission[] => {
  if (_permissions !== undefined) {
    return _permissions
  }

  const cookieValue = cookies().get(cookieName)
  if (cookieValue === undefined) {
    throw new Error('Not logged in')
  }
  const auth = parseCookie(cookieValue.value)

  console.log('***** is logged in  *****')

  if (auth?.session_id === undefined) {
    cookies().delete(cookieName)
    throw new Error('Not logged in')
  }

  _permissions = auth?.permissions || []
  return _permissions
}

export const getUsername = () => {
  const cookieValue = cookies().get(cookieName)
  if (cookieValue === undefined) {
    return false
  }
  const auth = parseCookie(cookieValue.value)

  if (auth?.session_id === undefined) {
    cookies().delete(cookieName)
    return false
  }

  return auth?.username
}
