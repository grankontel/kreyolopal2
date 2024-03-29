'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {  LogoutDialogContent } from '@/components/dashboard/logout-dialog'
import { IconAttributes } from '@kreyolopal/react-ui'
import { useQuery } from '@tanstack/react-query'
import { useDicoStore } from '@/store/dico-store'
import { ResponseError, User } from '@/lib/types'
import { useEffect } from 'react'
import { useCookies } from "react-cookie"
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'
const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

const fetchUserInfo = async (token: string) => {
  return fetch(apiServer + '/api/me/', {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new ResponseError('Could not fetch user info', res)
    }
    return res.json<User>()
  })
}

export const UserDropdown = ({ token }: { token: string }) => {
  const { user, setUser, unsetUser } = useDicoStore()
  const [cookies, setCookies, removeCookie] = useCookies()
  const router = useRouter()

  const { data, isError, error, isLoading } = useQuery<unknown, ResponseError, User, string[]>({
    queryKey: ['me'],
    queryFn: () => fetchUserInfo(token),

  })

  if (isError) {
    console.log(error.response.status)
    if (error.response.status == 403) {
      removeCookie(cookieName)
      unsetUser()
      router.push('/login')
    }

  }
  useEffect(() => {
    if (data != null) {
      data.bearer = token
      setUser(data)
    }
  }, [data])

  return isLoading ? (
    <>...</>
  ) : (
    <Dialog>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
          id="profile-menu"
          size="icon"
          variant="ghost"
        >
          <UserIcon className="h-4 w-4" />
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
