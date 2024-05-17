import { setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'
import { sign as jwt_sign } from 'jsonwebtoken'
import { createCookie, lucia } from '#services/auth'

import type { Context, TypedResponse } from 'hono'
import type { DatabaseUser } from '#services/db'
import config from '#config'
import { getUserPermissions } from '#services/permissions'
import { LoginResponse } from '@kreyolopal/domain'

export function createHttpException(
  errorContent: object,
  status = 500,
  statusText = 'Internal server error',
  message?: string
): HTTPException {
  const errorResponse = new Response(JSON.stringify(errorContent), {
    status,
    statusText,
  })

  return new HTTPException(status as StatusCode, {
    res: errorResponse,
    message: message ?? statusText,
  })
}

export async function logUserIn(
  c: Context,
  existingUser: DatabaseUser
): Promise<Response & TypedResponse<{}>> {
  const session = await lucia.createSession(existingUser.id, {})
	const permissions = await getUserPermissions(existingUser)
	const theCookie = await createCookie(session.id, existingUser, permissions)
	setCookie(c, theCookie.name, theCookie.value, {
		...theCookie.attributes,
		httpOnly: false,
	})
	c.status(200)
	let response: LoginResponse = {
		cookie: theCookie.value,
		firstname: existingUser.firstname,
		lastname: existingUser.lastname,
		permissions: permissions,
	}
	if (existingUser.is_admin) {
		response.token = jwt_sign(
			{ role: 'postgrest', username: existingUser.username },
			config.security.adminSecret
		)
	}
	return await c.json(response)
}


// Optimized
export const _decodeURI = (value: string) => {
  if (!/[%+]/.test(value)) {
    return value
  }
  if (value.includes('+')) {
    value = value.replace(/\+/g, ' ')
  }
  return value.includes('%') ? decodeURIComponent(value) : value
}