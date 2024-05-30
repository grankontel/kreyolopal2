/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/TAkw9ZCtCWp
 */
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toogle'
import DashboardPath from '@/components/dashboard/dashboard-path'
import { parseCookie } from '@/lib/utils'
import Sidebar from '@/components/dashboard/sidebar'
import SideMenu from '@/components/dashboard/side-menu'
import { UserDropdown } from '@/components/dashboard/user-dropdown'
import { LayoutFooter } from '@/components/layout-footer'
import { LogoutDialog } from '@/components/dashboard/logout-dialog'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export default function DashboardLayout({
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
      <DashboardProvider init={{ ...auth }}>
        <Sidebar>
          <SideMenu />
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 items-center justify-between bg-gray-100/40 px-6 dark:bg-gray-800/40">
            <div className="flex items-center gap-4">
              <Link className="lg:hidden" href="#">
                <Logo className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Link>
              <DashboardPath className="hidden lg:block" />
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

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 520 520"
    {...props}
  >
    <path d="M42 25.4c-14.5 4.1-25.7 15.4-29.6 30-2 7.5-2.1 398.6 0 406.1 4 15 15.1 26.1 30 30.1 4.1 1.1 20.4 1.4 84.4 1.4H206V24l-79.7.1c-60.6.1-80.9.4-84.3 1.3zM295 152.6c0 70.7.4 128.4.9 128.2.4-.2 23.9-27.5 52.2-60.6l51.4-60.4 52.8.1 52.7.1v-49.7c0-54-.1-55.3-5.6-65.3-3.2-5.8-10.7-13.1-16.8-16.2-9.4-4.8-8.8-4.8-100.8-4.8H295v128.6zM464.5 207c-21.9 25.6-48.3 56.2-58.5 68-10.2 11.8-19.1 22.3-19.8 23.2-1.2 1.5 4.4 10.2 47.4 74 26.8 39.8 52.8 78.1 57.7 85.2 14.7 21.1 13.9 30.6 13.5-149.9l-.3-146.9-40 46.4zM311.7 375.8 296 391.5V493h58c31.9 0 58-.3 58-.6 0-.6-82.5-130.1-83.9-131.6-.4-.4-7.7 6.3-16.4 15z" />
  </svg>
)
