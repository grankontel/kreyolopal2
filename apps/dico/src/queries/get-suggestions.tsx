import { apiServer } from '@/lib/types'
import { DictionaryEntry } from '@kreyolopal/domain'

export const getEntries = (w: string, token: string): Promise<DictionaryEntry[]> => {
  const word = w.trim()
  if (word.length === 0) return Promise.resolve([])

    const fetchHeaders = new Headers()
    fetchHeaders.set('Content-Type', 'application/json')
    fetchHeaders.set('Authorization', `Bearer ${token}`)

    return fetch(apiServer + `/api/dictionary/suggest/${encodeURIComponent(word)}`, {
    method: 'GET',
    headers: fetchHeaders,
    //    credentials: 'same-origin',
  })
    .then(
      async (result) => {
        if (!result.ok) {
          return []
        }

        return result.json<DictionaryEntry[]>()
      },
      (reason) => {
        console.log(reason)
        return []
      }
    )
    .catch((er) => {
      console.log(er)
      return []
    })
}
