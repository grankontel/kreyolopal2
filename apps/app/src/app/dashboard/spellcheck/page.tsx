import MainPanel from "@/components/dashboard/main-panel"
import { SpellcheckForm } from "@/components/spellcheck-form"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
	return(
		<MainPanel title="Orthographe">
			<div className="flex flex-row justify-center">
			<Card className="basis-1/2">
				<CardContent className="p4 my-4">
				<SpellcheckForm />

				</CardContent>
			</Card>
			</div>
		</MainPanel>
	)
}