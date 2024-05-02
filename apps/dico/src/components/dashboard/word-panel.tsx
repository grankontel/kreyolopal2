import { EntryHeader } from '../entry/entry-header'

export default function WordPanel({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col ">
      <EntryHeader />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
