import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'


const NoPermissions = () => {
	const router = useRouter()
  return (
    <div>
      <h2>Forbidden</h2>
      <p>Vos permissions sont insuffisantes pour accéder à cette page</p>
			<Button onClick={() => router.back()}>
          Retour
        </Button>

    </div>
  )
}

export default NoPermissions
