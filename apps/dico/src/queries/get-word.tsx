'use server'

import { cookies } from 'next/headers'
import {
  UserDictionaryEntry,
  UserProposalEntry,
  apiServer,
  cookieName,
} from '@/lib/types'
import {
  DictionaryEntry,
  DictionaryFullEntry,
  KreyolLanguage,
  ProposalEntry,
} from '@kreyolopal/domain'
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

        const data2 = await result2.json<DictionaryEntry[]>()

        const bookmarks: DictionaryEntry[] = data2.map((item) => {
          return {
            _id: item.id,
            entry: item.entry,
            variations: item.variations,
            definitions: item.definitions.filter((def) => def.kreyol === lang),
          }
        })
        response.is_bookmarked = bookmarks.length > 0
        response.bookmark = bookmarks[0]
      }
    }

    resolve(response)
  })
}

export async function getProposedWord(
  token: string,
  kreyol: string,
  entry: string
): Promise<UserProposalEntry | null> {
  const allowedKreyol = ['gp']

  return new Promise<UserProposalEntry | null>(async (resolve, reject) => {
    if (kreyol.length == 0 || entry.length == 0 || !allowedKreyol.includes(kreyol)) {
      resolve(null)
    }

    const myHeaders = new Headers()
    myHeaders.set('Content-Type', 'application/json')
    myHeaders.set('Accept', 'application/json')
    myHeaders.set('Authorization', `Bearer ${token}`)

    const lang = kreyol as KreyolLanguage
    // Fetch data from external API
    const result = await fetch(`${apiServer}/api/proposals/entry/${kreyol}/${entry}`, {
      method: 'GET',
      //      credentials: 'same-origin',
      headers: myHeaders,
    }).catch(function (error) {
      console.log("Il y a eu un problème avec l'opération fetch : " + error.message)
      reject(error)
    })

    if ((result as Response).status === 404) {
      resolve(null)
    }

    const data = await (result as Response).json<ProposalEntry>()
    const response: UserProposalEntry = {
      entry: data,
      kreyol,
    }

    resolve(response)
  })
}
