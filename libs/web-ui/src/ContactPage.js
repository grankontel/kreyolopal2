import { useReducer } from 'react'
import { Box, Button, Container, Form, Heading, Icon } from 'react-bulma-components'

export default function ContactPage() {
  const [messageInfo, dispatch] = useReducer(messageReducer, {
    firstname: '',
    lastname: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleInputChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    dispatch({ type: name, text: value })
  }

  return (
    <Box>
      <form>
        <Form.Field>
          <Form.Label htmlFor="firstname">Prénom</Form.Label>
          <Form.Input
            required
            placeholder="prénom"
            type="text"
            name="firstname"
            id="firstname"
            autoComplete="given-name"
            value={messageInfo.firstname}
            onChange={handleInputChange}
          />
        </Form.Field>
      </form>
    </Box>
  )
}

function messageReducer(original, action) {
  let response = { ...original }
  response[action.type] = action.text
  return response
}
