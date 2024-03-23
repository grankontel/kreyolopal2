'use client'

import {
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbList,
  Breadcrumb,
} from '@/components/ui/breadcrumb'
import { DashboardMenuItem } from '@/lib/dashboard'
import { hashKey } from '@/lib/utils';
import { useDicoStore } from '@/store/dico-store';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const getBreadcrumb = (pathName: string, menus: Array<DashboardMenuItem>, start: Array<{ label: string, path: string }> = []): Array<{ label: string, path: string }> | boolean => {
  const sortedMenus = menus.toSorted((a, b) => (a.path?.length || 0) - (b.path?.length || 0))

  for (let index = 0; index < sortedMenus.length; index++) {
    const menu = sortedMenus[index];
    if (menu.path != null && pathName.includes(menu.path as string)) {
      return [...start, { label: menu.label, path: menu.path }]
    }
    if (menu.items) {
      const result: Array<{ label: string, path: string }> | boolean = getBreadcrumb(pathName, menu.items, [...start, { label: menu.label, path: menu.path as string }])
      if (result) return result
    }
  }

  return false
}

export default function DashboardPath() {
  const pathName = usePathname()
  const { menus } = useDicoStore()

  const crumbs = getBreadcrumb(pathName, menus) as { label: string, path: string }[]

  return (
    <Breadcrumb className="breadcrumb">
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={hashKey('crumb', crumb.label)}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>

            </BreadcrumbItem>
            {(index < crumbs.length - 1) ? (<BreadcrumbSeparator />) : (' ')}
          </Fragment>
        ))}

      </BreadcrumbList>
    </Breadcrumb>
  )
}
