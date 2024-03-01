import React, { useRef, useState } from 'react'
import { Box, Button, Columns, Form, Notification } from 'react-bulma-components'
import { Turnstile } from '@marsidev/react-turnstile'
import { FormField } from '#components/FormField'
import PropTypes from 'prop-types'
import { siteVerify } from '../turnstile'

export function ContactForm({ endpoint, turnstileKey }) {
  const [isLoading, setIsLoading] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [notif, setNotif] = useState({ color: 'warning', message: '' })
  const formRef = useRef()

  const clearMessage = () => {
    setNotif({ color: notif.color, message: '' })
  }

  const handler = (setter) => {
    return (event) => {
      setter(event.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const token = formData.get('cf-turnstile-response')

    try {
      setIsLoading(true)
      clearMessage()

      await siteVerify(token)

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, subject, message }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log('not ok')
            throw Error(response.statusText)
          }

          return response.json()
        })
        .then(() => {
          setNotif({ color: 'success', message: 'Opération réussie' })
        })
        .catch((error) => {
          console.log(error)
          setNotif({
            color: 'danger',
            message: error?.error || error.toString(),
          })
          console.log(notif)
        })
    } catch (error) {
      setNotif({ color: 'danger', message: error?.error || error.toString() })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Box className="contact_form">
      <form ref={formRef} onSubmit={handleSubmit}>
        <Columns>
          <Columns.Column size="half">
            <FormField
              label="Prénom"
              type="text"
              name="firstname"
              autoComplete="given-name"
              value={firstname}
              onChange={handler(setFirstname)}
            />
          </Columns.Column>
          <Columns.Column size="half">
            <FormField
              label="Nom"
              type="text"
              name="lastname"
              autoComplete="family-name"
              value={lastname}
              onChange={handler(setLastname)}
            />
          </Columns.Column>
          <Columns.Column size="full">
            <FormField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handler(setEmail)}
            />
          </Columns.Column>
          <Columns.Column size="full">
            <FormField
              label="Sujet"
              type="text"
              name="subject"
              value={subject}
              onChange={handler(setSubject)}
            />
          </Columns.Column>
          <Columns.Column size="full">
            <Form.Field>
              <Form.Label>Message</Form.Label>
              <Form.Control>
                <Form.Textarea
                  name="message"
                  value={message}
                  required
                  onChange={handler(setMessage)}
                />
              </Form.Control>
            </Form.Field>
          </Columns.Column>
        </Columns>
        {notif.message.length > 0 ? (
          <Notification color={notif.color}>
            {notif.message}
            <Button remove onClick={() => clearMessage()} />
          </Notification>
        ) : (
          ''
        )}
        <Button.Group align="right">
          <Button loading={isLoading} color="primary">
            Voyé-y
          </Button>
        </Button.Group>
        <Turnstile siteKey={turnstileKey} />
      </form>
    </Box>
  )
}

ContactForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
  turnstileKey: PropTypes.string
}

ContactForm.defaultProps = {
  endpoint: '/api/contact',
}
