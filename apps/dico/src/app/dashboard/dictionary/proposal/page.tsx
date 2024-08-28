import MainPanel from '@/components/dashboard/main-panel'
import ProposalListTable from '@/components/proposal/proposal-list-table'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'

export const runtime = 'edge'

export default function Home() {

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
