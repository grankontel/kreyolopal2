import MainPanel from '@/components/dashboard/main-panel'
import { getPermissions, isLoggedIn } from '../is-logged-in'
import { LexiconTable } from '@/components/lexicons/lexicon-table'
import { getEnforcer } from '@kreyolopal/domain'
import NoPermissions from '@/components/noPermissions'

export const runtime = 'edge'

export default function Page() {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }


  const enforcer = getEnforcer(getPermissions())
  if (enforcer.cannot('list', 'lexicon')) {
    return (
      <NoPermissions />
    )
  }
  return (
    <MainPanel title="Mes lexiques">
      <LexiconTable />
    </MainPanel>
  )
}
