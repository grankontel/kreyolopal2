'use client'

import { hashKey } from '@/lib/utils'
import Link from 'next/link'
import FeatherIcon from '../FeatherIcon'
import { useDicoStore } from '@/store/dico-store'
import { DashboardMenuItem } from '@/lib/dashboard'

const SideMenuItem = ({
  menu,
  active = false,
}: {
  menu: DashboardMenuItem
  active?: boolean
}) => {
  let cl = active
    ? 'flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50'
    : 'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'

  cl = menu.items?.length ? (cl = cl + ' uppercase text-xs') : cl
  return (
    <li>
      <Link className={cl} href={menu.path || '#'}>
        {menu.icon ? <FeatherIcon iconName={menu.icon} className="h-4 w-4" /> : ''}
        {menu.label}
      </Link>

      {menu.items?.length ? (
        <ul className="pl-4">
          {menu.items.map((item) => (
            <SideMenuItem menu={item} key={hashKey('menu', item.label)} />
          ))}
        </ul>
      ) : (
        ''
      )}
    </li>
  )
}

export default function SideMenu({
  username,
  token,
}: {
  username: string
  token: string
}) {
  const { menus, setPersonnel } = useDicoStore()

  return (
    <nav className="menu grid items-start px-4 text-sm font-medium">
      <ul>
        {menus.map((menu) => {
          const active = false
          return menu?.label?.length || 0 > 0 ? (
            <SideMenuItem key={hashKey('menu', menu.label)} menu={menu} active={active} />
          ) : (
            ' '
          )
        })}
      </ul>
    </nav>
  )
}
