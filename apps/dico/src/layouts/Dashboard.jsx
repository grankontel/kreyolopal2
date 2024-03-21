import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import { Button, Container, Footer, Icon, Image, Level, Menu, Navbar, Section } from "react-bulma-components";
import classNames from 'classnames'
import FeatherIcon from '@/components/FeatherIcon';

const useToggle = (initialState = false) => {
	// Initialize the state
	const [state, setState] = useState(initialState)

	// Define and memorize toggler function in case we pass down the comopnent,
	// This function change the boolean value to it's opposite value
	const toggle = useCallback(() => setState((state) => !state), [])

	return [state, toggle]
}

export default function Dashboard({ children }) {
	const [mobileOpen, openMobileMenu] = useToggle(false)
	const navMenu = classNames({
		'is-active': mobileOpen,
	})

	return (
		<div id="dashboard">
			<Navbar fixed="top" color="dark">
				<Navbar.Brand>
					<Navbar.Item renderAs="li">
						<Link href="/">
							<img src="/images/logo_name.svg" alt="Zakari Brand" />
						</Link>
					</Navbar.Item>
				</Navbar.Brand>

				<Navbar.Container align='right'>
					<Navbar.Burger onClick={openMobileMenu} aria-label="menu" />

					<Navbar.Menu renderAs="div" className={navMenu}>
						<Navbar.Container>

							<Navbar.Item href="#" hoverable>
								<Navbar.Link arrowless>
									Thierry Malo</Navbar.Link>
								<Navbar.Dropdown>
									<Navbar.Item href="#">
										<Icon>

											<FeatherIcon iconName='user' />
										</Icon>
										<span>My profile</span>
									</Navbar.Item>
									<Navbar.Item href="#">
										<Icon>
											<FeatherIcon iconName='settings' />
										</Icon>
										<span>Settings</span>
									</Navbar.Item>
									<Navbar.Divider />
									<Navbar.Item href="#">
										<Icon>
											<FeatherIcon iconName='log-out' />
										</Icon>
										<span>Log out</span>
									</Navbar.Item>
								</Navbar.Dropdown>
							</Navbar.Item>
							<Navbar.Divider />

							<Navbar.Item>
								<Icon>
									<FeatherIcon iconName='log-out' />
								</Icon>
							</Navbar.Item>
						</Navbar.Container>
					</Navbar.Menu>
				</Navbar.Container>
			</Navbar>
			<aside className='aside is-placed-left is-expanded'>
				<div className='aside-tools'>
					<div className='aside-tools-label'>

					</div>
				</div>
				<Menu renderAs='div'>
					<Menu.List title="Général">
						<Menu.List.Item>
							<Icon>

								<FeatherIcon iconName='user' />
							</Icon>
							<span>My profile</span>
						</Menu.List.Item>
					</Menu.List>
				</Menu>

			</aside>
			<Section className='title-bar'>
				<Level>
					<Level.Side align='left'>
						<Level.Item>
							<ul>
								<li>Admin</li>
								<li>Tables</li>
							</ul>
						</Level.Item>
					</Level.Side>
					<Level.Side align='right'>
						<Level.Item>
							<Button>a button</Button>

						</Level.Item>
					</Level.Side>
				</Level>
			</Section>
			<Section>
				Hero
			</Section>
			<Section>
				{children}
			</Section>
			<Footer>
				<Level>
					<Level.Side align='left'>
						&copy; 2020 - 2024 TiMalo
					</Level.Side>
				</Level>
			</Footer>
		</div>
	)
}