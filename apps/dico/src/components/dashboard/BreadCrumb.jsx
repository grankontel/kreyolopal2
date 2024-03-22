import React from 'react'
import { Level} from "react-bulma-components";
import { usePathname } from 'next/navigation';

const BreadCrumb = ({ menus }) => {
	const pathName = usePathname()

	const getBreadcrumb = (pathName, menus, start = []) => {
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
	const crumbs = getBreadcrumb(pathName, menus)

	return (<Level.Item>
		<ul>
			{crumbs.map((crumb) => (<li>{crumb}</li>))}
		</ul>
	</Level.Item>
	)
}

export default BreadCrumb

