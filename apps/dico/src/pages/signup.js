import { parseCookie } from '@/lib/auth'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Section, Form } from 'react-bulma-components'
import { FormField } from '@/components/FormField'
import { SignupForm } from '@kreyolopal/web-ui'
import Standard from '@/layouts/Standard'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { fr } from 'date-fns/locale/fr'
import { addDays, addYears } from 'date-fns'
registerLocale('fr', fr)

const apiServer = process.env.API_SERVER || 'https://api.kreyolopal.com'

// import 'react-datepicker/dist/react-datepicker.css'

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export const config = {
  runtime: 'experimental-edge',
}

export async function getServerSideProps(context) {
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'
  const user = parseCookie(context.req.cookies?.[cookieName])
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

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const maxDate = addYears(new Date(), -12)
  const [startDate, setStartDate] = useState(addDays(maxDate, 1))

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const formElement = e.target
    const response = await fetch(formElement.action, {
      method: formElement.method,
      body: JSON.stringify(Object.fromEntries(new FormData(formElement).entries())),
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
      <SignupForm 
       endpoint={apiServer + '/api/auth/signup'}
       turnstileKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
     />
    </Section>
  )
}

SignupPage.getLayout = function getLayout(page) {
  return <Standard>{page}</Standard>
}
