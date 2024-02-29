import { parseCookie } from '@/lib/auth'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Section } from 'react-bulma-components'
import { FormField } from '@/components/FormField'

export const config = {
  runtime: 'experimental-edge',
}

export async function getServerSideProps(context) {
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'
  const user = parseCookie(
    context.req.cookies?.[cookieName]
  )
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

export default function Page() {
  const router = useRouter()
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const formElement = e.target
    const response = await fetch(formElement.action, {
      method: formElement.method,
      body: JSON.stringify(
        Object.fromEntries(new FormData(formElement).entries())
      ),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      router.push('/')
    } else {
      setError((await response.json()).error)
    }
  }

  return (
    <Section>
      <Heading size={3} renderAs="h1">
        Create an account
      </Heading>
      <Box className="w-80">
        <form method="post" action="/api/auth/signup" onSubmit={onSubmit}>
          <FormField
            name="email"
            label="Email"
            autocomplete="email"
            type="text"
          />
          <FormField
            name="username"
            label="Identifiant"
            autocomplete="username"
            type="text"
          />
          <FormField
            name="password"
            label="Mot de passe"
            autocomplete="new-password"
            type="password"
          />
          <br />
          <FormField
            name="firstname"
            label="Prénom"
            autocomplete="give-name"
            type="text"
          />
          <FormField
            name="lastname"
            label="Nom"
            autocomplete="family-name"
            type="text"
          />
          <Button.Group align="center">
            <Button color="primary">Continue</Button>
          </Button.Group>
          <p>{error}</p>
        </form>
        <hr />
        <Link href="/login">Sign in</Link>
      </Box>
    </Section>
  )
}
