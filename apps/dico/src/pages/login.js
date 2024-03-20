import { Section, Heading } from 'react-bulma-components'
import { parseCookie } from '@/lib/auth'
import { LoginForm } from '@kreyolopal/web-ui'
import Standard from '@/layouts/Standard'
import Cookies from "js-cookie"
import { useRouter } from 'next/navigation'

const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'
const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export const config = {
  runtime: 'experimental-edge',
}

export async function getServerSideProps(context) {
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'
  const user = parseCookie(context.req.cookies?.[cookieName])
  console.log(user)
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: {},
  }
}

export default function LoginPage() {
  const router = useRouter()

  return (
    <Section>
      <Heading size={2} renderAs="h1">Sign in</Heading>
      <LoginForm
        endpoint={apiServer + '/api/auth/login'}
        turnstileKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
        onLogin={(data) => {
          console.log(data)
          Cookies.set(cookieName, data.cookie)
          // router.push('/')
        }}
      />
    </Section>
  )
}

LoginPage.getLayout = function getLayout(page) {
  return <Standard>{page}</Standard>
}
