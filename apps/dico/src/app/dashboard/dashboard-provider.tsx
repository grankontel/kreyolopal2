'use client'

import { createContext, useContext } from 'react'

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
  return (
    <DashboardContext.Provider value={{ ...init, isLoggedIn: () => init.session_id }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = (): DashboardContextValue | null => {
  return useContext(DashboardContext)
}
