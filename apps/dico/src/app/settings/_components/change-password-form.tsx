'use client'

import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { changePassword, ChangePasswordPayload } from '../_actions/change-password'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { changePasswordSchema } from '@kreyolopal/domain'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export const ChangePasswordForm = () => {
  const form = useForm<ChangePasswordPayload>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      new_password: '',
      old_password: '',
      verification: '',
    },
  })
  // 2. Define a submit handler.
  function onSubmit(values: ChangePasswordPayload) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    updatePassword.mutate(values)
  }

  const dash = useDashboard()
  const router = useRouter()

  const token: string = dash?.session_id || ''
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

  const updatePassword = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(token, payload),
    onSuccess: () => {
      toast({
        variant: 'default',
        description: 'Mot de passe modifié',
      })
      router.push('/login')
    },
    onError: (err: any) => {
      notifyer(err)
    },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="mb-5 border-b text-lg font-semibold text-gray-700 dark:text-white">
          Changer mon mot de passe
        </h3>
        <div className="mt-2 space-y-4">
          <input
            id="username"
            type="text"
            autoComplete="username"
            hidden
            defaultValue={dash?.username}
          />
          <div>
            <FormField
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="old_password">Mot de passe actuel</Label>
                  <Input
                    className="mt-1 w-2/5"
                    id="old_password"
                    placeholder="Entrez votre mot de passe actuel"
                    type="password"
                    autoComplete="current-password"
                    required
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="new_password">Nouveau mot de passe</Label>
                  <Input
                    className="mt-1 w-2/5"
                    id="new_password"
                    placeholder="Entrez votre nouveau mot de passe"
                    type="password"
                    autoComplete="new-password"
                    required
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="verification"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="verification">Vérification</Label>
                  <Input
                    className="mt-1 w-2/5"
                    id="verification"
                    placeholder="Confirmer votre nouveau mot de passe"
                    type="password"
                    autoComplete="new-password"
                    required
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button className="mt-4" type="submit" loading={updatePassword.isPending}>
          Enregister
        </Button>
      </form>
    </Form>
  )
}
