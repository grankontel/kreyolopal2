import '@/styles/index.sass'
import { AuthProvider } from '@kreyolopal/web-ui'

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <AuthProvider cookieName={cookieName}>
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  )
}
