import MainPanel from '@/components/dashboard/main-panel'
import { SpellcheckForm } from '@/components/forms/spellcheck-form'
import { Card, CardContent } from '@/components/ui/card'
import { isLoggedIn } from '../is-logged-in'

export const runtime = 'edge'

export default function Page() {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }
  
  return (
    <MainPanel title="Orthographe">
      <div className="flex flex-row justify-center">
        <Card className="basis-1/2">
          <CardContent className="p4 my-4">
            <SpellcheckForm />
          </CardContent>
        </Card>
      </div>
    </MainPanel>
  )
}
