import { DictionaryEntry } from '@/lib/types'

const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'

export const getEntries = (w: string): Promise<DictionaryEntry[]> => {
  const word = w.trim()
  if (word.length === 0) return Promise.resolve([])

  return fetch(apiServer + `/api/dictionary/suggest/${encodeURIComponent(word)}`, {
    method: 'GET',
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
