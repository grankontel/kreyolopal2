import MainPanel from '@/components/dashboard/main-panel'
import { DicoTable } from '@/components/dicotable/dico-table'
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
          <CardDescription>
           Le vocabulaire que j&apos;ai sélectionné
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto w-full">
            <DicoTable />
          </div>
        </CardContent>
      </Card>
    </MainPanel>
  )
}
