import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Entry } from '@/components/entry/entry'
import { getWord } from '@/queries/get-word'
import { KreyolLanguage, getEnforcer } from '@kreyolopal/domain'
import { getPermissions, isLoggedIn } from '@/app/dashboard/is-logged-in'
import NoPermissions from '@/components/noPermissions'

export const runtime = 'edge'

type PageProps = {
  params: { kreyol: string; entry: string }
}
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {

  return {
    title:  params.entry + ' — dictionnaire '
  }
}

export default async function Page({
  params,
}: {
  params: { kreyol: string; entry: string }
}) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }

  const permissions = getPermissions()
  const enforcer = getEnforcer(permissions)
  if (enforcer.cannot('read', 'dictionary')) {
    return (
      <NoPermissions />
    )
  }

  const data = await getWord(params.kreyol, params.entry)
  if (!data) {
    return notFound()
  }
  return <Entry kreyol={params.kreyol as KreyolLanguage} value={data} />
}
