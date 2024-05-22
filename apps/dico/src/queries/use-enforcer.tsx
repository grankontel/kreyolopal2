'use client'

import { parseCookie } from '@/lib/utils'
import { getEnforcer } from '@kreyolopal/domain'
import Cookies from 'universal-cookie'

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export function useEnforcer() {
	const cookies = new Cookies(null, { path: '/' });
	const auth = parseCookie(cookies.get(cookieName))
	return getEnforcer(auth?.permissions || [])
}