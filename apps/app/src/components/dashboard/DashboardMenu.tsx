import React from 'react'
import { Icon, Menu } from "react-bulma-components";
import FeatherIcon from '@/components/FeatherIcon';
import { usePathname } from 'next/navigation';
import { DashboardMenuItem } from '@/lib/dashboard';

export const DashboardMenu = ({ menus }: {menus: Array<DashboardMenuItem>}) => {
	return (<Menu renderAs='div'>

		{menus.map((menu) =>
		(<Menu.List title={menu.label} >
			{menu.items?.map((item) =>
				item.items?.length > 0 ? (<SubMenu item={item} />) : (<SimpleItem item={item} />)
			)}
		</Menu.List>
		))}
	</Menu>
	)
}

const SimpleItem = ({ item }: {item: DashboardMenuItem}) => {
	const pathName = usePathname()

	return (
		<Menu.List.Item href={item.path} alt={item.label} active={pathName === item.path}>
			<>
				{item.icon ? (<Icon>
					<FeatherIcon iconName={item.icon} />
				</Icon>
				) : ''}
				<span>{item.label}</span>
			</>
		</Menu.List.Item>
	)
}

const SubMenu = ({ item }: {item: DashboardMenuItem}) => {
	const pathName = usePathname()

	return (
		<Menu.List.Item href={item.path} alt={item.label} active={pathName === item.path}>
			<Menu.List title={
				<>					{item.icon ? (<Icon>
					<FeatherIcon iconName={item.icon} />
				</Icon>
				) : ''}
					<span>{item.label}</span>
				</>
			}>
				{item.items.map((item) => <SimpleItem item={item} />)}
			</Menu.List>
		</Menu.List.Item>

	)
}
