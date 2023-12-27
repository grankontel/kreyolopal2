import { useState } from 'react'
import {
  Columns,
  Container,
  Heading,
  Section,
  Form,
  Button,
} from 'react-bulma-components'
import { FlagGp } from '@kreyolopal/web-ui'

const postSpellCheck = (text) =>{
    const word = text.trim()
    if (word.length === 0) return Promise.resolve([])

    const query = {
        kreyol: 'GP',
        request: word
    }

    return fetch(`/api/spellcheck`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json",
          },     
          body: JSON.stringify(query)   
      })
        .then(
          async (result) => {
            if (!result.ok) {
              return []
            }
    
            return result.json()
          },
          (reason) => {
            console.log(reason)
            return []
          }
        )
        .catch((er) => {
          console.log(er)
          return []
        })    
}
export default function Spellcheck() {
  const [requestText, setRequestText] = useState('')
  const [responseText, setResponseText] = useState('')

  return (
      <Section>
      <Heading size={2} renderAs="h1">
        Correcteur orthographique
      </Heading>
      <Container>

        <Columns>
          <Columns.Column size="half">
            {/* <FlagGp /> */}
            <Form.Control>
              <Form.Textarea
                value={requestText}
                onChange={(e) => {
                  setRequestText(e.target.value)
                }}
              ></Form.Textarea>
            </Form.Control>
            <Button.Group align="right">
              <Button
                mt={2}
                color="primary"
                onClick={async (event) => {
                  console.log(requestText)
                  const rep = await postSpellCheck(requestText)
                  console.log(rep)
                }}
              >
                Envoyer
              </Button>
            </Button.Group>
          </Columns.Column>
          <Columns.Column size="half">
            <Form.Control>
              <Form.Textarea value={responseText} readOnly></Form.Textarea>
            </Form.Control>
          </Columns.Column>
        </Columns>
        </Container>
      </Section>
  )
}
