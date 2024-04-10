import { apiServer, ResponseError } from '@/lib/types'

export interface LexiconEditPayload {
  name: string
  slug: string
  description: string
  is_private: boolean
}

export const putLexicon = async (
  id: string,
  lexicon: LexiconEditPayload,
  token: string | undefined
): Promise<unknown> => {

  console.log(`putLexicon ${token}`)
  if (token === undefined)
    return Promise.resolve()

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(apiServer + `/api/lexicons/${id}`, {
    method: 'PUT',
    //    credentials: 'same-origin',
    headers: myHeaders,
    body: JSON.stringify(lexicon)
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to update lexicon', result)

    return result.json()
  })
}
