/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pKsStMqiF1s
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { UserDropdown } from '@/components/dashboard/user-dropdown'
import { LogoutDialog } from '@/components/dashboard/logout-dialog'
import { LayoutFooter } from "@/components/layout-footer"
import { parseCookie } from '@/lib/utils'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'
import SideMenu from "@/components/dashboard/side-menu"
import DashboardPath from '@/components/dashboard/dashboard-path'
import { ModeToggle } from "@/components/mode-toogle"

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

const DashboardHeader = ({ token }: { token: string }) => {
	return (
		<header className="flex h-14 lg:h-[60px] items-center gap-4 bg-gray-100/40 px-6 dark:bg-gray-800/40">
			<div className="flex items-center gap-4">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="lg:hidden">
							<MenuIcon className="h-6 w-6" />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<div className="flex flex-col gap-2">
							<div className="flex h-[60px] items-center px-6">
								<Link href="/dashboard" className="flex items-center gap-2 font-semibold" prefetch={false}>
									<Logo className="h-6 w-6" />
									<span className="">Kreyolopal</span>
								</Link>
							</div>
							<div className="flex-1">
								<SideMenu />
							</div>
						</div>
					</SheetContent>
				</Sheet>
				<DashboardPath className="hidden lg:block" />
			</div>
			<div className="flex sd:flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				{/*             <form className="ml-auto flex-1 sm:flex-initial">
			<div className="relative">
				<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
				<Input
					type="search"
					placeholder="Search..."
					className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
				/>
			</div>
		</form>
*/}
				<UserDropdown token={token} />
				<ModeToggle />
				<LogoutDialog trigger={<Button variant="logo">Logout</Button>} />

			</div>
		</header>

	)
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
		const getAuthValue = () => {
		const cookieValue = cookies().get(cookieName)
		if (cookieValue === undefined) {
			return false
		}
		const auth = parseCookie(cookieValue.value)

		if (auth?.session_id === undefined) {
			cookies().delete(cookieName)
			return false
		}
		console.log('***** is logged in  *****')
		return auth
	}

	const auth = getAuthValue()
	if (!auth) {
		redirect('/login')
	}

	return (
		<div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
			<DashboardProvider init={{ ...auth }}>
				{/* <Sidebar> */}
				<aside className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
					<div className="flex flex-col gap-2">
						<div className="bg-logo flex h-[60px] items-center px-6">
							<Link href="/dashboard" className="flex items-center gap-2 font-semibold" prefetch={false}>
								<Image
									src="/images/logo_name-transparent.svg"
									width={182}
									height={50}
									alt="Zakari Brand"
									priority
								/>
							</Link>
						</div>
						<div className="flex-1">
							<SideMenu />
						</div>
					</div>
				</aside>
				{/* </Sidebar> */}
				<div className="flex flex-col">
					<DashboardHeader token={auth.session_id} />
					{children}
					<LayoutFooter />
				</div>
			</DashboardProvider>
		</div>
	)
}

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		viewBox="0 0 520 520"
		{...props}
	>
		<path d="M42 25.4c-14.5 4.1-25.7 15.4-29.6 30-2 7.5-2.1 398.6 0 406.1 4 15 15.1 26.1 30 30.1 4.1 1.1 20.4 1.4 84.4 1.4H206V24l-79.7.1c-60.6.1-80.9.4-84.3 1.3zM295 152.6c0 70.7.4 128.4.9 128.2.4-.2 23.9-27.5 52.2-60.6l51.4-60.4 52.8.1 52.7.1v-49.7c0-54-.1-55.3-5.6-65.3-3.2-5.8-10.7-13.1-16.8-16.2-9.4-4.8-8.8-4.8-100.8-4.8H295v128.6zM464.5 207c-21.9 25.6-48.3 56.2-58.5 68-10.2 11.8-19.1 22.3-19.8 23.2-1.2 1.5 4.4 10.2 47.4 74 26.8 39.8 52.8 78.1 57.7 85.2 14.7 21.1 13.9 30.6 13.5-149.9l-.3-146.9-40 46.4zM311.7 375.8 296 391.5V493h58c31.9 0 58-.3 58-.6 0-.6-82.5-130.1-83.9-131.6-.4-.4-7.7 6.3-16.4 15z" />
	</svg>
)

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	)
}


function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	)
}
