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
      <article className="prose ">{children}</article>
      <HomeFooter />
    </main>
  )
}
