import '@/styles/index.sass'
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { StandardPage } from '@kreyolopal/web-ui'
import FrontHead from '@/components/FrontHead'

const links = [
  {
    id: 1,
    url: process.env.NEXT_PUBLIC_DICO_URL,
    text: 'Dictionnaire'
  },
  {
    id: 2,
    url: '/contact',
    text: 'Contact'
  }
]
export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <StandardPage links={links} getHead={() => (<FrontHead />)} CustomItems={() =>(<UserButton afterSignOutUrl="/" />)}>
        <Component {...pageProps} />
      </StandardPage>
    </ClerkProvider>
  )
}
