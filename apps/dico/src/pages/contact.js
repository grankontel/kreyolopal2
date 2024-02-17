import { Section, Heading } from 'react-bulma-components'
import { ContactForm } from '@kreyolopal/web-ui'
import Standard from '@/layouts/Standard'

export default function ContactPage() {
  return (
    <Section>
      <Heading size={2} renderAs="h1">
        Contact
      </Heading>
      <ContactForm />
    </Section>
  )
}

ContactPage.getLayout = function getLayout(page) {
  return <Standard>{page}</Standard>
}