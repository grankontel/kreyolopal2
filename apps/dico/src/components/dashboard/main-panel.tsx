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
      <section className=" border-y-2 border-y-gray-200 bg-gray-100 p-6 dark:border-y-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description === undefined ? (
          ' '
        ) : (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </section>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
