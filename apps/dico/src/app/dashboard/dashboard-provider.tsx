'use client'

import { createContext, useContext } from 'react'
import { useDicoStore } from '@/store/dico-store'
import { DashboardMenuItem } from '@/lib/dashboard'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getLexicons } from '@/queries/get-lexicons'
import { Lexicon } from '@/lib/lexicons/types'
import { ResponseError } from '@/lib/types'
import { useEffect } from 'react'

export interface AuthValue {
  session_id: string
  user_id: string
  username: string
}
export interface DashboardContextValue extends AuthValue {
  isLoggedIn: () => string | false
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export const DashboardProvider = ({
  children,
  init,
}: Readonly<{
  children: React.ReactNode
  init: AuthValue
}>) => {
  const { setLexicons, setPersonnel } = useDicoStore()
  const queryClient = useQueryClient()
  const username = init.username
  const token = init.session_id

  const { data, isError, error, isLoading } = useQuery<
    unknown,
    ResponseError,
    Lexicon[],
    string[]
  >({
    queryKey: ['me', 'lexicons'],
    staleTime: Infinity,
    queryFn: () => {
      console.log('querying lexicons...')
      return username ? getLexicons(username, token) : []
    },
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['me', 'lexicons'],
      refetchType: 'active',
    })
  }, [username])

  useEffect(() => {
    console.log('handling lexicons...')
    if (data !== undefined) {
      setLexicons(data)
      const personnel: DashboardMenuItem[] = []

      personnel.push({
        icon: 'bookmark',
        label: 'Mes lexiques',
        path: '/dashboard/lexicons',
        items: data?.map((item) => ({ label: item.name, path: '/dashboard' + item.path })),
      })
      setPersonnel(personnel)
    }
  }, [data])

  return (
    <DashboardContext.Provider value={{ ...init, isLoggedIn: () => init.session_id }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = (): DashboardContextValue | null => {
  return useContext(DashboardContext)
}
