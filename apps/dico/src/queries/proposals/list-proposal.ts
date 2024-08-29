import { ResponseError } from '@/lib/types'

export async function listProposals(token: string) {
  console.log('list proposals')

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/proposals/`, {
    method: 'GET',
    headers: myHeaders,
  }).then(async (result) => {
    if (!result.ok)
      throw new ResponseError(
        `Failed to list proposals `,
        result
      )

    return result.json()
  })
}
