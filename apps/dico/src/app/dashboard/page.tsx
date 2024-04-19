import MainPanel from '@/components/dashboard/main-panel'
import { PersonalDicoTable } from '@/components/dicotable/personal-dico-table'
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
            <PersonalDicoTable />
          </div>
        </CardContent>
      </Card>
    </MainPanel>
  )
}
