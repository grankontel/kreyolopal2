import { StateCreator } from 'zustand'
import { DashboardMenuItem } from '@/lib/dashboard'
import { DicoStore, DicoSlice } from './types'

const menus: DashboardMenuItem[] = []

const general = []
general.push({ icon: 'book', label: 'Dictionnaire', path: '/dashboard/dictionary' })
general.push({ icon: 'tool', label: 'Orthographe', path: '/dashboard/spellcheck' })

const personnel = []
personnel.push({ icon: 'book-open', label: 'Mon dictionnaire', path: '/dashboard' })
const lexicons = []
lexicons.push({ label: 'Lexique 1', path: '/tmalo/lexicons/lexique-1' })

personnel.push({
  icon: 'bookmark',
  label: 'Mes lexiques',
  path: '/dashboard/lexicons',
  items: lexicons,
})

menus.push({ label: 'Général', items: general })
menus.push({ label: 'Personnel', items: personnel })

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

export const createDicoSlice: StateCreator<DicoStore, [], [], DicoSlice> = (set) => ({
  menus: menus,
  addMenu: (item: DashboardMenuItem) =>
    set((state) => ({ menus: [...state.menus, item] })),
  removeItem: (label: string) =>
    set((state) => ({ menus: [...removeByLabel(label, state.menus)] })),
})
