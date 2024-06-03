/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pKsStMqiF1s
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { LayoutFooter } from "@/components/layout-footer"
import { parseCookie } from '@/lib/utils'
import { DashboardProvider } from '@/components/dashboard/dashboard-provider'
import SideMenu from "@/components/dashboard/side-menu"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

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
