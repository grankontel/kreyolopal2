import HomeFooter from '../_components/home-footer'
import HomeHeader from '../_components/home-header'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-[100dvh] flex-col">
      <HomeHeader />
      <article className="prose prose-lg dark:prose-invert max-w-none m-6 w-3/4">{children}</article>
      <HomeFooter />
    </main>
  )
}
