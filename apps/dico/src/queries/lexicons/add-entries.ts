import { apiServer, ResponseError } from '@/lib/types'

export interface AddEntriesPayload {
  entry: string
  definitions: {
    source: string
    id: string
  }[]
}

export const addEntries = async (
  id: string,
  definitions: AddEntriesPayload,
  token: string | undefined
): Promise<unknown> => {
  console.log(`addEntries to ${id}`)
  if (token === undefined) return Promise.resolve()

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(apiServer + `/api/lexicons/${id}/definition`, {
    method: 'PUT',
    //    credentials: 'same-origin',
    headers: myHeaders,
    body: JSON.stringify(definitions),
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to add definitions', result)

    return result.json()
  })
}
