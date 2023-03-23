import '@/styles/index.sass'
import { StandardPage } from '@kreyolopal/web-ui'
import FrontHead from '@/components/FrontHead'

export default function App({ Component, pageProps }) {
  return (
    <StandardPage getHead={() => (<FrontHead />)}>
      <Component {...pageProps} />
    </StandardPage>
  )
}
