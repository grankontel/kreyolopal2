import { StateCreator } from 'zustand'
import { DashboardMenuItem } from '@/lib/dashboard'
import { DicoStore, DicoSlice } from './types'
import { getDefaultMenu } from './menus'

const removeByLabel = (
  label: string,
  items: DashboardMenuItem[]
): DashboardMenuItem[] => {
  const response: DashboardMenuItem[] = []
  for (let index = 0; index < items.length; index++) {
    const element = items[index]
    if (element.label === label) continue
    if (!element.items?.length) {
      response.push(element)
    } else {
      element.items = removeByLabel(label, element.items)
    }
  }
  return response
}

const defaultMenus = getDefaultMenu()
export const createDicoSlice: StateCreator<DicoStore, [], [], DicoSlice> = (set) => ({
  menus: defaultMenus,
  set: (newMenu: DashboardMenuItem[]) => set((state) => ({ menus: newMenu })),
  setPersonnel: (newMenu: DashboardMenuItem[]) => {
    console.log('set Personnel')
    set((state) => ({ menus: getDefaultMenu(newMenu) }))
  },
  addMenu: (item: DashboardMenuItem) =>
    set((state) => ({ menus: [...state.menus, item] })),
  removeItem: (label: string) =>
    set((state) => ({ menus: [...removeByLabel(label, state.menus)] })),
})
