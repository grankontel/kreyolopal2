import { notFound } from 'next/navigation'
import { Entry } from '@/components/entry'
import { DictionaryEntry } from '@/lib/types'
import { getWord } from '@/queries/get-word'
import { KreyolLanguage } from '@kreyolopal/react-ui'

export const runtime = 'edge'

export default async function Page({ params, }: { params: { kreyol: string; entry: string } }) {
  const data = await getWord(params.kreyol, params.entry)

  if (!data) {
    return notFound()
  }
  return (
    <Entry
      kreyol={params.kreyol as KreyolLanguage}
      value={data}
      dicoUrl={(w) => `/dashboard/dictionary/${params.kreyol}/${encodeURI(w)}`}
    />
  )
}
