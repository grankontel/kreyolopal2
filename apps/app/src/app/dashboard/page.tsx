import MainPanel from '@/components/dashboard/main-panel'
import { DicoTable } from '@/components/dicotable/dico-table'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'

export default function Home() {
  return (
    <MainPanel title="Produits">
      <Card>
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
          <CardDescription>
            View and manage all your products from a single place
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
