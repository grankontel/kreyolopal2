import '@/styles/index.sass'
import { AuthProvider } from '@/AuthContext'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )

}
