import '@/styles/index.sass'
import { AuthProvider } from '@kreyolopal/web-ui'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <AuthProvider cookieName={process.env.NEXT_PUBLIC_COOKIE_NAME}>
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  )

}
