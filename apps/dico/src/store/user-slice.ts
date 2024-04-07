import { StateCreator } from 'zustand'
import { User } from '@/lib/types'
import { UserSlice, DicoStore } from './types'
import { parseCookie } from '@/lib/utils'

export const createUserSlice: StateCreator<DicoStore, [], [], UserSlice> = (set) => ({
  user: null,
  unsetUser: () => set(() => ({ user: null })),
  setUser: (aUser: User) =>
    set(() => {
      if (aUser.cookie) {
        const auth = parseCookie(aUser.cookie)
        aUser.bearer = auth?.session_id
      }
      return { user: aUser }
    }),
})
