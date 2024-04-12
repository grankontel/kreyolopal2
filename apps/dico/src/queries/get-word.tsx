'use server'

import { cookies } from 'next/headers'
import { UserDictionaryEntry, apiServer, cookieName } from '@/lib/types'
import { DictionaryEntry, DictionaryFullEntry, KreyolLanguage } from '@kreyolopal/domain'
import { parseCookie } from '@/lib/utils'

export async function getWord(
  kreyol: string,
  entry: string
): Promise<UserDictionaryEntry | null> {
  const cookieValue = cookies().get(cookieName)
  const auth = parseCookie(cookieValue?.value || '')
  const allowedKreyol = ['gp']

  const { user_id, session_id } = auth || { user_id: null, session_id: null }
  const cacheMode = !user_id ? 'public' : 'private'

  return new Promise<UserDictionaryEntry | null>(async (resolve, reject) => {
    if (kreyol.length == 0 || entry.length == 0 || !allowedKreyol.includes(kreyol)) {
      resolve(null)
    }

    const lang = kreyol as KreyolLanguage
    // Fetch data from external API
    const result = await fetch(`${apiServer}/api/dictionary/entry/${kreyol}/${entry}`, {
      method: 'GET',
      //      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    }).catch(function (error) {
      console.log("Il y a eu un problème avec l'opération fetch : " + error.message)
      reject(error)
    })

    if ((result as Response).status === 404) {
      resolve(null)
    }

    const data = await (result as Response).json<DictionaryEntry>()
    const response: UserDictionaryEntry = {
      cacheMode: cacheMode,
      is_bookmarked: false,
      entry: data,
      kreyol,
    }
    
    if (user_id) {
      const token = session_id
      const result2 = await fetch(`${apiServer}/api/me/dictionary/${entry}`, {
        method: 'GET',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      }).catch(function (error) {
        console.log("Il y a eu un problème avec l'opération fetch : " + error.message)
      })

      if (result2?.ok) {
        const data2 = await result2.json<DictionaryFullEntry[]>()

        const bookmarks: DictionaryEntry[] = data2.map((item) => {
          return {
            _id: item.id,
            entry: item.entry,
            variations: item.variations,
            definitions: item.definitions[lang],
          }
        })
        response.is_bookmarked = bookmarks.length > 0
        response.bookmark = bookmarks[0]
      }
    }

    resolve(response)
  })
}
