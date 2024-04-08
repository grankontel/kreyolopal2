import { CrossCircledIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const notifVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        success: 'bg-success text-success-foreground',
        info: 'bg-info text-info-foreground',
        warning: 'bg-warning text-warning-foreground',
        danger: 'bg-destructive text-danger-foreground [&>svg]:text-danger-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
)

type NotificationProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof notifVariants>

export function Notification({
  className,
  title = 'Erreur',
  variant,
  children,
  ...props
}: NotificationProps) {
  return (
    <Alert variant={variant} className={cn(notifVariants({ variant }), className)}>
      <CrossCircledIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

Notification.displayName = 'Notification'
