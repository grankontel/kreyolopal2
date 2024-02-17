import { Section, Heading } from 'react-bulma-components'
import { ContactForm } from '@kreyolopal/web-ui'

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
