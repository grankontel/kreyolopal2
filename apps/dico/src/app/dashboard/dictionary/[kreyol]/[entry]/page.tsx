import { notFound } from 'next/navigation'
import { Entry } from '@/components/entry'
import { getWord } from '@/queries/get-word'
import { KreyolLanguage } from '@kreyolopal/react-ui'
import { isLoggedIn } from '@/app/dashboard/is-logged-in'

export const runtime = 'edge'

export default async function Page({
  params,
}: {
  params: { kreyol: string; entry: string }
}) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }

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
