import { DashboardMenuItem } from '@/lib/dashboard'
import { User } from '@/lib/types'

export interface UserSlice {
	user: User | null
	setUser: (newUser:User) => void
}

export interface DicoSlice {
  menus: DashboardMenuItem[]
  addMenu: (item: DashboardMenuItem) => void
  removeItem: (label: string) => void
}

export type DicoStore = UserSlice & DicoSlice