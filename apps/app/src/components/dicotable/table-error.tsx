import { CrossCircledIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export  const TableError = ({ message }: { message: string }) => {
  return (<Alert variant="danger" className="my-2 mx-4 w-1/2">
    <CrossCircledIcon className="h-4 w-4" />
    <AlertTitle>Erreur</AlertTitle>
    <AlertDescription>
      {message}
    </AlertDescription>
  </Alert>)
}
