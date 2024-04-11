import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { MouseEventHandler } from 'react'

interface ConfirmDialogProps {
  onAction: MouseEventHandler<HTMLButtonElement> | undefined
}

export const ConfirmDialogContent = (props: ConfirmDialogProps) => (
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account and remove
        your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={props.onAction}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
)

export function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <ConfirmDialogContent onAction={props.onAction} />
    </AlertDialog>
  )
}
