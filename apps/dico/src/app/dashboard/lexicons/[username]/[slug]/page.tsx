import { notFound } from 'next/navigation'
import { isLoggedIn } from '@/app/dashboard/is-logged-in'
import { getLexicon } from '@/queries/lexicons/get-lexicon';
import MainPanel from '@/components/dashboard/main-panel';

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

  const data = await getLexicon(params.username, params.slug)

  if (!data) {
    return notFound()
  }
  return (
    <div>
      <MainPanel title={data.name} description={data.description}>
      {params.username} / {params.slug}

      </MainPanel>
    </div>
  )
}
