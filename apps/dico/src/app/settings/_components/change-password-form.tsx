'use client'

import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const ChangePasswordForm = () => {
    const dash = useDashboard()
  return (
    <form>
      <h3 className="mb-5 border-b text-lg font-semibold text-gray-700 dark:text-white">
        Changer mon mot de passe
      </h3>
      <div className="mt-2 space-y-4">
        <input id="username" type="text" autoComplete='username' hidden defaultValue={dash?.username} />
        <div>
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input
            className="mt-1 w-2/5"
            id="current-password"
            placeholder="Entrez votre mot de passe actuel"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input
            className="mt-1 w-2/5"
            id="new-password"
            placeholder="Entrez votre nouveau mot de passe"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Vérification</Label>
          <Input
            className="mt-1 w-2/5"
            id="confirm-password"
            placeholder="Confirmer votre nouveau mot de passe"
            type="password"
            autoComplete="new-password"
          />
        </div>
      </div>
      <Button className="mt-4">Enregister</Button>
    </form>
  )
}
