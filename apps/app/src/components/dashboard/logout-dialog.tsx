'use client'

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog"
import { useLogout } from "@/queries/use-logout"

export function LogoutDialog({trigger}: {trigger: React.ReactNode}) {

	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger}
			</DialogTrigger>
			<LogoutDialogContent />
		</Dialog>
	)
}

export const LogoutDialogContent = () => {
	const logout = useLogout()

	return (
		<DialogContent className="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Déconnexion</DialogTitle>
			<DialogDescription>
				Etes vous sûr de vouloir vous déconnecter ?
			</DialogDescription>
		</DialogHeader>
		<DialogFooter>
			<DialogClose asChild>
				<Button variant="logo" onClick={() => {
					logout()
				}}>Yes</Button>
			</DialogClose>

			<DialogClose asChild>
				<Button variant="default">No</Button>
			</DialogClose>
		</DialogFooter>
	</DialogContent>

	)
}