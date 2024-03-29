import { ResponseError, SpellcheckResponse } from "@/lib/types"

interface PostSpellCheckResponse {
  id?: string
  response: SpellcheckResponse
}

export const postSpellCheck = async (token: string, text: string)
  : Promise<PostSpellCheckResponse | undefined> => {
  const word = text.trim()
  if (word.length === 0) return Promise.resolve(undefined)

  const query = {
    kreyol: 'GP',
    request: word,
  }

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/spellcheck`, {
    method: 'POST',
    //    credentials: 'same-origin',
    headers: myHeaders,
    body: JSON.stringify(query),
  })
    .then(
      async (result) => {
        if (!result.ok) throw new ResponseError('Failed to verify spelling', result)

        return result.json()
      }
    )
}
