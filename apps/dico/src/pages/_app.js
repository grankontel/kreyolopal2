import '@/styles/index.sass'
import {
  ClerkProvider,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/nextjs'
import { frFR } from "@clerk/localizations"
import { StandardPage } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'

const links = [
  {
    id: 1,
    url: process.env.NEXT_PUBLIC_DICO_URL,
    text: 'Dictionnaire',
  },
  {
    id: 2,
    url: `${process.env.NEXT_PUBLIC_DICO_URL}/spellcheck`,
    text: 'Correcteur',
  },
  {
    id: 3,
    url: '/contact',
    text: 'Contact',
  },
]

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider localization={frFR} {...pageProps}>
      <StandardPage
        links={links}
        getHead={() => <DicoHead />}
        CustomItems={() => (
          <>
            <span className="navbar-item">
              <UserButton afterSignOutUrl="/" />
            </span>
            <span className="navbar-item">
              <SignedOut>
                <SignInButton className="button is-parimay" mode="modal">
                  Login
                </SignInButton>
              </SignedOut>
            </span>
          </>
        )}
      >
        <Component {...pageProps} />
      </StandardPage>
    </ClerkProvider>
  )
}
