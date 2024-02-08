import '@/styles/index.sass'
import { StandardPage } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'

const dico_url = process.env.NEXT_PUBLIC_DICO_URL || `http://localhost:${process.env.PORT || 3000}`
const links = [
  {
    id: 1,
    url: dico_url,
    text: 'Dictionnaire',
  },
  {
    id: 2,
    url: `${dico_url}/spellcheck`,
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
