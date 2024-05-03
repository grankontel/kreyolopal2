import MainPanel from '@/components/dashboard/main-panel'
import { isLoggedIn } from '@/app/dashboard/is-logged-in'
import { ChangePasswordForm } from './_components/change-password-form'

export default function SettingsPage() {
    const token = isLoggedIn()
    if (!token) {
      return undefined
    }
    return (
    <MainPanel title="Mes parametres">
      <div className="mt-4">
        <ChangePasswordForm />
      </div>
    </MainPanel>
  )
}
