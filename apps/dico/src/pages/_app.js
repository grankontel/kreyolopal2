import '@/styles/index.sass'
import { AuthProvider } from '@kreyolopal/web-ui'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )

}
