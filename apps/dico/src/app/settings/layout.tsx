/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/TAkw9ZCtCWp
 */
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toogle'
import Sidebar from '@/components/dashboard/sidebar'
import DashboardPath from '@/components/dashboard/dashboard-path'
import { redirect } from 'next/navigation'
import { parseCookie } from '@/lib/utils'
import { UserDropdown } from '@/components/dashboard/user-dropdown'
import { LayoutFooter } from '@/components/layout-footer'
import { LogoutDialog } from '@/components/dashboard/logout-dialog'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'
import FeatherIcon from '@/components/FeatherIcon'

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const getAuthValue = () => {
    const cookieValue = cookies().get(cookieName)
    if (cookieValue === undefined) {
      return false
    }
    const auth = parseCookie(cookieValue.value)

    if (auth?.session_id === undefined) {
      cookies().delete(cookieName)
      return false
    }
    console.log('***** is logged in  *****')
    return auth
  }

  const auth = getAuthValue()
  if (!auth) {
    redirect('/login')
  }
  return (
    <div className="grid h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar>

      <nav className="menu grid items-start px-4 text-sm font-medium">
      <ul>
      <li>
      <Link className='flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50' href={'#'}>
         <FeatherIcon iconName='shield' className="h-4 w-4" />
        Changer mon mot de passe
      </Link>
</li>
      </ul>
    </nav>

      </Sidebar>
      <DashboardProvider init={{ ...auth }}>
        <div className="flex flex-col">
          <header className="flex h-14 items-center justify-between bg-gray-100/40 px-6 dark:bg-gray-800/40">
            <div className="flex items-center gap-4">
              <Link className="lg:hidden" href="#">
                <Package2Icon className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Link>

            </div>
            <div className="flex items-center gap-4">
              <UserDropdown token={auth.session_id} />
              <ModeToggle />
              <LogoutDialog trigger={<Button variant="logo">Logout</Button>} />
            </div>
          </header>
          {children}
          <LayoutFooter />
        </div>
      </DashboardProvider>
    </div>
  )
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}
