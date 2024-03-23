import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
	return (
		<div className="h-screen flex flex-row size-full">
			<div className="basis-1/2 bg-logo">
				<div className="m-4 px-4 py-12">
					<Image src="/images/logo_name-transparent.svg" width={218} height={60} alt="Zakari Brand" />
					<p className="pl-4 scroll-m-20 font-medium text-3xl tracking-tight text-gray-300 dark:text-gray-400">
						Utiliser les technologies d&apos;aujourd&apos;hui pour encourager, améliorer et diffuser l&apos;écriture du créole.
					</p>
				</div>

			</div>
			<div className="basis-1/2 my-auto">
				<LoginForm />
			</div>
		</div>
	)
}
