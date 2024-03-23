import { EntryHeader } from "../entry-header";

export default function WordPanel({ children }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col min-h-screen ">
			<EntryHeader />
			<main className="flex-1 p-4 md:p-6">
				{children}
			</main>
		</div>
	)
}