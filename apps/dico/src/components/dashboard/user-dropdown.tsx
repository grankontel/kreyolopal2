import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { LogoutDialogContent } from '@/components/dashboard/logout-dialog'
import { IconAttributes } from '@kreyolopal/react-ui'
import { useDicoStore } from '@/store/dico-store'
import { ResponseError, User, apiServer, cookieName } from '@/lib/types'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { cookies } from 'next/headers'

const fetchUserInfo = async (token: string) => {
  return fetch(apiServer + '/api/me/', {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      cookies().delete(cookieName)
      throw new ResponseError('Could not fetch user info', res)
    }
    return res.json<User>()
  })
}

export const UserDropdown = async ({ token }: { token: string }) => {
  try {
    const data = await fetchUserInfo(token)
    if (data != null) {
      data.bearer = token
      useDicoStore.setState({ user: data })
    }
  } catch (error) {
    console.log(error)
    useDicoStore.setState({ user: null })
    redirect('/login')
  }
  const user = useDicoStore.getState().user

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-lg border border-gray-200 dark:border-gray-800"
            id="profile-menu"
            variant="ghost"
          >
            <UserIcon className="h-4 w-4" />&nbsp;{user?.firstname} {user?.lastname}
            <span className="sr-only">Toggle profile menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            {user?.firstname} {user?.lastname}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialogContent />
    </Dialog>
  )
}

function UserIcon(props: IconAttributes) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
