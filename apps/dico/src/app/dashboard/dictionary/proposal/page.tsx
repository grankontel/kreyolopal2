import MainPanel from '@/components/dashboard/main-panel'
import ProposalListTable from '@/components/proposal/proposal-list-table'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'
import { getPermissions, isLoggedIn } from '../../is-logged-in'
import { getEnforcer } from '@kreyolopal/domain'
import NoPermissions from '@/components/noPermissions'

export const runtime = 'edge'

export default function Home() {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }

  const enforcer = getEnforcer(getPermissions())
  if (enforcer.cannot('list', 'lexicon')) {
    return <NoPermissions />
  }

  return (
    <MainPanel title="Mon dictionnaire">
      <Card>
        <CardHeader>
          <CardTitle>Mon dictionnaire</CardTitle>
          <CardDescription>Le vocabulaire que j&apos;ai sélectionné</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            <ProposalListTable />
          </div>
        </CardContent>
      </Card>
    </MainPanel>
  )
}
