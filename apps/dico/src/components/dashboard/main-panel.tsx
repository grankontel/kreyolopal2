interface MainPanelProps {
  title: string
  description?: string
  children: React.ReactNode
}
export default function MainPanel({
  title,
  description,
  children,
}: Readonly<MainPanelProps>) {
  return (
    <div>
      <section className=" p-6 bg-gray-100 border-y-gray-200 border-y-2 dark:bg-gray-800 dark:border-y-gray-700">
        <h1 className="font-bold text-2xl">{title}</h1>
        {description === undefined ? (' ') : (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>)}
      </section>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
