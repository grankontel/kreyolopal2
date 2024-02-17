import '@/styles/index.sass'
import { AuthProvider, StandardPage } from '@kreyolopal/web-ui'
import FrontHead from '@/components/FrontHead'
import Link from 'next/link'

const links = [
  {
    id: 1,
    url: process.env.NEXT_PUBLIC_DICO_URL,
    text: 'Dictionnaire',
  },
  {
    id: 2,
    url: '/contact',
    text: 'Contact',
  },
]
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider cookieName={process.env.NEXT_PUBLIC_COOKIE_NAME}>
      <StandardPage
        links={links}
        getHead={() => <FrontHead />}
        CustomItems={() => (
          <>
            <span className="navbar-item">
              <Link
                href={process.env.NEXT_PUBLIC_DICO_URL}
                className="button is-primary"
              />
            </span>
          </>
        )}
      >
        <Component {...pageProps} />
      </StandardPage>
    </AuthProvider>
  )
}
