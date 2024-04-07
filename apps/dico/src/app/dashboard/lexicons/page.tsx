import MainPanel from '@/components/dashboard/main-panel'
import { isLoggedIn } from '../is-logged-in'
import { LexiconTable } from '@/components/lexicons/lexicon-table'

export const runtime = 'edge'

export default function Page() {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }

  return (
    <MainPanel title="Mes lexiques">
        <LexiconTable />
    </MainPanel>
  )
}

