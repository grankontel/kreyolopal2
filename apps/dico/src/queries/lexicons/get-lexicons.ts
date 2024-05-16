import { Lexicon } from '@kreyolopal/domain'
import { apiServer, ResponseError } from '@/lib/types'

export const getLexicons = async (
  username: string,
  token: string
): Promise<Lexicon[] | undefined> => {
  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(apiServer + `/api/lexicons/${username}`, {
    method: 'GET',
    //    credentials: 'same-origin',
    headers: myHeaders,
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to list lexicons', result)

    return result.json()
  })
}
