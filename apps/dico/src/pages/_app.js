import '@/styles/index.sass'
import { StandardPage } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'

const links = [
  {
    id: 2,
    url: '/contact',
    text: 'Contact'
  }
]

export default function App({ Component, pageProps }) {
  return (
    <StandardPage links={links} getHead={() => <DicoHead />}>
      <Component {...pageProps} />
    </StandardPage>
  )
}
