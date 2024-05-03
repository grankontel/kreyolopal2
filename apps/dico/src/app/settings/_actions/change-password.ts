import { ResponseError } from '@/lib/types'
import { changePasswordSchema } from '@kreyolopal/domain'

export interface ChangePasswordPayload {
	old_password: string
	new_password: string
	verification: string
}

export async function changePassword(token: string, payload: ChangePasswordPayload) {
  console.log('changePassword')
  const value = changePasswordSchema.parse(payload)

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/me/updatepwd`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(value),
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to change password', result)

    return result.json()
  })
}
