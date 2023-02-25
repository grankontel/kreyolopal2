import '@/styles/index.sass'
import StandardPage from '@/layouts/StandardPage'

export default function App({ Component, pageProps }) {
  return (
    <StandardPage>
      <Component {...pageProps} />
    </StandardPage>
  )
}
