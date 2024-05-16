'use client'

import { SubmitButton } from '@/components/submit-button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@marsidev/react-turnstile'
import { useFormState } from 'react-dom'
import postContact from './contact-action'
import { Notification } from '@/components/notification'

const initialState = {
  status: 'initial',
  errors: [''],
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || ''

export function ContactForm() {
  const [state, formAction] = useFormState(postContact, initialState)

  return (
    <form action={formAction}>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstname">Prénom</Label>
          <Input
            id="firstname"
            name="firstname"
            autoComplete="given-name"
            placeholder="Max"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastname">Nom</Label>
          <Input
            id="lastname"
            name="lastname"
            autoComplete="family-name"
            placeholder="Robinson"
            required
          />
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          autoComplete="email"
          placeholder="m@example.com"
          required
          type="email"
        />
      </div>
      <div className="mt-4 grid gap-2">
        <Label htmlFor="subject">Objet</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="a propos de..."
          required
          type="text"
        />
      </div>
      <div className="mt-4 grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Votre message..." rows={6} />
      </div>
      <div className="mt-4 grid gap-2">
        <Turnstile id="" siteKey={turnstileSiteKey} />
      </div>
      {state.status === 'initial' ? (
        ' '
      ) : (
        <div className="mt-4 grid gap-2">
          {state.status === 'error' ? (
            <Notification variant="danger" title="Erreur">
              {state.errors?.join(' ')}
            </Notification>
          ) : (
            <Notification variant="success" title="Succès">
              Message envoyé
            </Notification>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-2">
        <SubmitButton variant="logo">Envoyer</SubmitButton>
      </div>
    </form>
  )
}
