import { parseCookie } from '@/lib/utils'
import { Permission, getEnforcer } from '@kreyolopal/domain'
import { useCookies } from 'react-cookie'

let _permissions: Permission[] | undefined = undefined
const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export function useEnforcer() {
	if (_permissions !== undefined) {
		return getEnforcer(_permissions)
	}

	const [cookies, setCookies, removeCookie] = useCookies()
	const auth = parseCookie(cookies[cookieName])
	_permissions = auth?.permissions
	return getEnforcer(_permissions || [])

}