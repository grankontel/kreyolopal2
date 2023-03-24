import '@/styles/index.sass'
import { StandardPage } from '@kreyolopal/web-ui'
import FrontHead from '@/components/FrontHead'

const links = [
  {
    id: 1,
    url: process.env.DICO_URL,
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
    <StandardPage links={links} getHead={() => (<FrontHead />)}>
      <Component {...pageProps} />
    </StandardPage>
  )
}
