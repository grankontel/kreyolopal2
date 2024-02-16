import { useReducer, useState } from 'react'
import {
  Box,
  Button,
  Columns,
  Container,
  Form,
  Heading,
  Icon,
  Notification,
} from 'react-bulma-components'
import FormField from './components/FormField'

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [notif, setNotif] = useState({ color: 'warning', message: '' })
  const [messageInfo, dispatch] = useReducer(messageReducer, {
    firstname: '',
    lastname: '',
    email: '',
    subject: '',
    message: '',
  })

  const clearMessage = () => {
    setNotif({ color: notif.color, message: '' })
  }

  const handleInputChange = (event) => {
    event.preventDefault()
    const target = event.target
    const name = target.name
    const value = target.value
    dispatch({ type: name, text: value })
  }

  
  return (
    <Box>
      {notif.message.length > 0 ? (
        <Notification color={notif.color}>
          {notif.message}
          <Button remove onClick={() => clearMessage()} />
        </Notification>
      ) : (
        ''
      )}
      <form>
        <Columns>
          <Columns.Column size="half">
            <FormField
              label="Prénom"
              type="text"
              name="firstname"
              autoComplete="given-name"
              value={messageInfo.firstname}
              onChange={handleInputChange}
            />
          </Columns.Column>
          <Columns.Column size="half">
            <FormField
              label="Nom"
              type="text"
              name="lastname"
              autoComplete="family-name"
              value={messageInfo.lastname}
              onChange={handleInputChange}
            />
          </Columns.Column>
          <Columns.Column size="full">
            <FormField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={messageInfo.email}
              onChange={handleInputChange}
            />
          </Columns.Column>
          <Columns.Column size="full">
            <FormField
              label="Sujet"
              type="text"
              name="subject"
              value={messageInfo.subject}
              onChange={handleInputChange}
            />
          </Columns.Column>
          <Columns.Column size="full">
            <Form.Field>
              <Form.Label>Message</Form.Label>
              <Form.Control>
                <Form.Textarea
                  name="message"
                  value={messageInfo.message}
                  required
                  onChange={handleInputChange}
                />
              </Form.Control>
            </Form.Field>
          </Columns.Column>
        </Columns>
        <Button.Group align="right">
          <Button loading={isLoading} color="primary">
            Voyé-y
          </Button>
        </Button.Group>
      </form>
    </Box>
  )
}

function messageReducer(original, action) {
  let response = { ...original }
  response[action.type] = action.text
  return response
}
