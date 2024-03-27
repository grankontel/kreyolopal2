export default function MainPanel({
  title,
  children,
}: Readonly<{
  title: string
  children: React.ReactNode
}>) {
  return (
    <div>
      <section className="flex p-6 bg-gray-100 border-y-gray-200 border-y-2 dark:bg-gray-800 dark:border-y-gray-700">
        <h1 className="font-bold text-2xl">{title}</h1>
      </section>
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
