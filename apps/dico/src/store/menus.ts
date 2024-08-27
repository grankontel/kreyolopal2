import { DashboardMenuItem } from '@/lib/dashboard'

export const getDefaultMenu = (pMenu: DashboardMenuItem[] = []) => {
  const menus: DashboardMenuItem[] = []

  const general: DashboardMenuItem[] = []
  general.push({
    icon: 'book',
    label: 'Dictionnaire',
    path: '/dashboard/dictionary',
    permission: { action: 'read', subject: 'dictionary' },
  })
  general.push({
    icon: 'tool',
    label: 'Orthographe',
    path: '/dashboard/spellcheck',
    permission: { action: 'request', subject: 'spellcheck' },
  })

  menus.push({ label: 'Général', items: general })
  return menus.concat(getPersonalSubMenu(pMenu))
}

export const getPersonalSubMenu = (
  pMenu: DashboardMenuItem[] = []
): DashboardMenuItem => {
  const personnel: DashboardMenuItem[] = []
  personnel.push({ icon: 'book-open', label: 'Mon dictionnaire', path: '/dashboard' })
  if (pMenu.length) personnel.push(...pMenu)
  return { label: 'Personnel', items: personnel }
}
