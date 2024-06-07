'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import FeatherIcon from './FeatherIcon'

const NoPermissions = () => {
  const router = useRouter()
  return (
    <div>
      <Alert variant={'destructive'}>
        <div className="flex flex-row gap-2 py-2">
          <FeatherIcon iconName="alert-circle" className="h-4 w-4" />
          <AlertTitle>Forbidden !</AlertTitle>
        </div>
        <AlertDescription>
          <p>Vos permissions sont insuffisantes pour accéder à cette page.</p>
          <Button className="mt-2" onClick={() => router.back()}>
            Retour
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default NoPermissions
