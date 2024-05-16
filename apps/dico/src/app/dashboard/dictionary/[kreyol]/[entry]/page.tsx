import { notFound } from 'next/navigation'
import { Entry } from '@/components/entry/entry'
import { getWord } from '@/queries/get-word'
import { KreyolLanguage } from '@kreyolopal/domain'
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
  return <Entry kreyol={params.kreyol as KreyolLanguage} value={data} />
}
