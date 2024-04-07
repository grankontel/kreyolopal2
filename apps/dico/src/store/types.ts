import { DashboardMenuItem } from '@/lib/dashboard'
import { Lexicon } from '@/lib/lexicons/types'
import { User } from '@/lib/types'

export interface UserSlice {
  user: User | null
  unsetUser: () => void
  setUser: (newUser: User) => void
}

export interface LexiconSlice {
  lexicons: Lexicon[]
  setLexicons: (data: Lexicon[]) => void
}

export interface DicoSlice {
  menus: DashboardMenuItem[]
  setMenus: (item: DashboardMenuItem[]) => void
  setPersonnel: (item: DashboardMenuItem[]) => void
  addMenu: (item: DashboardMenuItem) => void
  removeItem: (label: string) => void
}

export type DicoStore = UserSlice & DicoSlice & LexiconSlice
