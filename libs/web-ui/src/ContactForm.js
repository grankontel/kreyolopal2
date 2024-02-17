import React, { useState } from 'react'
import { Box, Button, Columns, Form, Notification } from 'react-bulma-components'
import { FormField } from './components/FormField'
import PropTypes from 'prop-types'

export function ContactForm({ endpoint }) {
  const [isLoading, setIsLoading] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [notif, setNotif] = useState({ color: 'warning', message: '' })

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

    try {
      setIsLoading(true)
      clearMessage()

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
          setNotif({ color: 'danger', message: error?.error || error.toString() })
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
      <form onSubmit={handleSubmit}>
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
      </form>
    </Box>
  )
}

ContactForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
}

ContactForm.defaultProps = {
  endpoint: '/api/contact',
}
