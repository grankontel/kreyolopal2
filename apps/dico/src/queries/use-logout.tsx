'use client'

import { useRouter } from 'next/navigation'
import { useDicoStore } from '@/store/dico-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'universal-cookie'
import { cookieName } from '@/lib/types'

const fetchLogout = async (token: string) => {
  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')

  myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/auth/logout`, {
    method: 'POST',
    //    credentials: 'same-origin',
    headers: myHeaders,
  })
}

export function useLogout(notifyer?: (error: Error) => void) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const cookies = new Cookies(null, { path: '/' });
  const { user, unsetUser } = useDicoStore((state) => ({
    user: state.user,
    unsetUser: state.unsetUser,
  }))

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => fetchLogout(user?.bearer as string),
    onSuccess: () => {
       cookies.remove(cookieName)
      unsetUser()
      queryClient.invalidateQueries({ queryKey: ['me', 'personalDico', 'suggest'] })
      router.push('/login')
    },
    onError: (err: Error) => {
      notifyer?.(err)
    },
  })

  return logoutMutation
}
