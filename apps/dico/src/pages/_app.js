import '@/styles/index.sass'
import { StandardPage } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'

export default function App({ Component, pageProps }) {
  return (
    <StandardPage getHead={() => <DicoHead />}>
      <Component {...pageProps} />
    </StandardPage>
  )
}
