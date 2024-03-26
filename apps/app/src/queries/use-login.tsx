'use client'

import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { ResponseError, User } from '@/lib/types'
import { useDicoStore } from '@/store/dico-store'
import { useMutation } from '@tanstack/react-query'
import { parseCookie } from '@/lib/utils'

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

interface IUserCredentials {
  username: string
  password: string
}

const fetchLogin = (content: IUserCredentials): Promise<User> => {

  return fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: content.username,
      password: content.password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) throw new ResponseError('Failed on sign in request', response)

    return response.json()
  })
}

export function useLogin(notifyer?: ((error: Error) => void)) {
  const [cookies, setCookies, removeCookie] = useCookies()
  const router = useRouter()
  const { user, setUser } = useDicoStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }))

  const { mutate: signInMutation } = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      setCookies(cookieName, data.cookie)
      const auth = parseCookie(data.cookie)
      data.bearer = auth?.session_id
      // save the user in the state
      setUser(data)
      router.push('/dashboard')
    },
    onError: (err: Error) => {
      notifyer?.(err)
    },
  })

  return signInMutation
}
