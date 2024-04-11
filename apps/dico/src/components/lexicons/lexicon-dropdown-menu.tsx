'use client'

import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useDicoStore } from "@/store/dico-store"

export const LexiconDropdownMenu = () => {
	const { lexicons } = useDicoStore()
	return (
		<DropdownMenuContent>
			<DropdownMenuLabel>Ajouter à...</DropdownMenuLabel>
			<DropdownMenuSeparator />
			{lexicons.map((lexicon) => {
				return (<DropdownMenuItem key={lexicon.id}>{lexicon.name}</DropdownMenuItem>
				)
			})}
		</DropdownMenuContent>
	)
}