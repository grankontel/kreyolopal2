import HomeFooter from '../_components/home-footer'
import HomeHeader from '../_components/home-header'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-[100dvh] flex-col py-12 md:py-24 lg:py-32 xl:py-48">
      <HomeHeader />
      <article className="prose prose-lg dark:prose-invert max-w-none m-6 w-3/4">{children}</article>
      <HomeFooter />
    </main>
  )
}
