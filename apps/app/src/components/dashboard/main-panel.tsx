import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RocketIcon } from "@radix-ui/react-icons"

export default function MainPanel({ title, children }: Readonly<{
	title:string, children: React.ReactNode;
}>) {
	return (
		<div>
			<section className="flex p-6 bg-gray-100 border-y-gray-200 border-y-2 dark:bg-gray-800 dark:border-y-gray-700">
				<h1 className="font-bold text-2xl">{title}</h1>
			</section>
			<main className="flex-1 p-4 md:p-6">
				<Alert variant="danger" className="my-2">
					<RocketIcon className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						You can add components to your app using the cli.
					</AlertDescription>
				</Alert>

				<Alert variant="danger" className="my-2">
					<RocketIcon className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						You can add components to your app using the cli.
					</AlertDescription>
				</Alert>

				{children}
			</main>
		</div>
	)
}