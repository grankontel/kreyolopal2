import React from 'react'
import { Level } from "react-bulma-components";
import { usePathname } from 'next/navigation';
import { DashboardMenuItem } from '@/lib/dashboard';

const BreadCrumb = ({ menus }: { menus: Array<DashboardMenuItem> }) => {
	const pathName = usePathname()

	const getBreadcrumb = (pathName: string, menus: Array<DashboardMenuItem>, start: string[] = []): string[] | boolean => {
		for (let index = 0; index < menus.length; index++) {
			const menu = menus[index];
			if (menu.path === pathName) {
				return [...start, menu.label]
			}
			if (menu.items) {
				const result = getBreadcrumb(pathName, menu.items, [...start, menu.label])
				if (result) return result
			}
		}

		return false
	}
	const crumbs = getBreadcrumb(pathName, menus) as string[]

	return (<Level.Item>
		<ul>
			{crumbs.map((crumb) => (<li>{crumb}</li>))}
		</ul>
	</Level.Item>
	)
}

export default BreadCrumb

