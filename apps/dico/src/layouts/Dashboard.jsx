import React from 'react'
import Link from 'next/link'
import { Button, Footer, Heading, Hero, Icon, Level, Navbar, Notification, Section } from "react-bulma-components";
import classNames from 'classnames'
import FeatherIcon from '@/components/FeatherIcon';
import { useToggle } from '@kreyolopal/web-ui'
import { DashboardProvider, useDashboard } from '@/components/dashboard/DashboardProvider';
import { DashboardMenu } from '@/components/dashboard/DashboardMenu';
import BreadCrumb from '@/components/dashboard/BreadCrumb';

const Notifier = () => {
	const dash = useDashboard()
	return dash.hasNotif ? (
		<Notification color={dash.notificationManager.getNotif().color}>
			{dash.notificationManager.getNotif().message}
			<Button remove onClick={() => dash.notificationManager.clearMessage()} />
		</Notification>
	) : (
		''
	)
}

const menus = []

const general = []
general.push({ icon: 'book', label: 'Dictionnaire', path: '/me/dictionary' })
general.push({ icon: 'tool', label: 'Orthographe', path: '/me/spellcheck' })

const personnel = []
personnel.push({ icon: 'book-open', label: 'Mon dictionnaire', path: '/me' })
const lexicons = []
lexicons.push({ label: 'Lexique 1', path: '/tmalo/lexicons/lexique-1' })

personnel.push({ icon: 'bookmark', label: 'Mes lexiques', path: '/me/lexicons', items: lexicons })

menus.push({ label: 'Général', items: general })
menus.push({ label: 'Personnel', items: personnel })

export default function Dashboard({ children }) {
	const [mobileOpen, openMobileMenu] = useToggle(false)
	const navMenu = classNames({
		'is-active': mobileOpen,
	})

	return (
		<DashboardProvider>
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
					<DashboardMenu menus={menus} />
				</aside>
				<Section className='title-bar'>
					<Level>
						<Level.Side align='left'>
							<BreadCrumb menus={menus} />
						</Level.Side>
						<Level.Side align='right'>
							<Level.Item>
								<Button>a button</Button>

							</Level.Item>
						</Level.Side>
					</Level>
				</Section>
				<Hero>
					<Hero.Body>
						<Level renderAs='div'>
							<Level.Side align='left'>
								<Level.Item>
									<Heading  >Mon dictionnaire</Heading>
								</Level.Item>
							</Level.Side>
						</Level>
					</Hero.Body>
				</Hero>
				<Section>
					<Notifier />

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
		</DashboardProvider>
	)
}