import WordPanel from "@/components/dashboard/word-panel";

export default function DicoLayout({ children }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
<WordPanel>
	{children}
</WordPanel>
	)
}