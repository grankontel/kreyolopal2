import '@/styles/index.sass'
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
    <StandardPage
      links={links}
      getHead={() => <DicoHead />}
      CustomItems={() => (
        <>
          <span className="navbar-item">
            Connect
            </span>
        </>
      )}
    >
      <Component {...pageProps} />
    </StandardPage>
  )
}
