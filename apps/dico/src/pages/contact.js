import { Section, Heading } from 'react-bulma-components'
import { ContactForm } from '@kreyolopal/web-ui'
import Standard from '@/layouts/Standard'

const apiServer = process.env.API_SERVER || 'https://api.kreyolopal.com'

export default function ContactPage() {
  return (
    <Section>
      <Heading size={2} renderAs="h1">
        Contact
      </Heading>
      <ContactForm
        endpoint={apiServer + '/api/contact'}
        turnstileKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
      />
    </Section>
  )
}

ContactPage.getLayout = function getLayout(page) {
  return <Standard>{page}</Standard>
}
