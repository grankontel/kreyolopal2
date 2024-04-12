'use client'

import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './ui/button'

export function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" {...props} loading={pending} aria-disabled={pending}>
      {props.children}
    </Button>
  )
}
