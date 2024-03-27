import { StateCreator } from 'zustand'
import { User } from '@/lib/types'
import { UserSlice, DicoStore } from './types'

export const createUserSlice: StateCreator<DicoStore, [], [], UserSlice> = (set) => ({
  user: null,
  setUser: (aUser: User) => set(() => ({ user: aUser })),
})
