import { notFound } from 'next/navigation'
import { getPermissions, isLoggedIn } from '@/app/dashboard/is-logged-in'
import { getLexicon } from '@/queries/lexicons/get-lexicon'
import MainPanel from '@/components/dashboard/main-panel'
import { LexiconDicoTable } from '@/components/dicotable/lexicon-dico-table'
import { getEnforcer } from '@kreyolopal/domain'
import NoPermissions from '@/components/noPermissions'

export const runtime = 'edge'

export default async function Page({
  params,
}: {
  params: { username: string; slug: string }
}) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }

  const enforcer = getEnforcer(getPermissions())
  if (enforcer.cannot('read', 'lexicon')) {
    return (
      <NoPermissions />
    )
  }

 
  const data = await getLexicon(params.username, params.slug)

  if (!data) {
    return notFound()
  }
  return (
    <div>
      <MainPanel title={data.name} description={data.description}>
        <LexiconDicoTable username={params.username} slug={params.slug} />
      </MainPanel>
    </div>
  )
}
