import { useState } from 'react'
import {
  Columns,
  Container,
  Heading,
  Section,
  Form,
  Button,
  Message,
  Notification,
  Icon,
} from 'react-bulma-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { StarRating } from '@kreyolopal/web-ui'
import * as feather from 'feather-icons'
import { FlagGp } from '@kreyolopal/web-ui'
import { parseCookie } from '@/lib/auth'
import Standard from '@/layouts/Standard'

async function postRateCorrection(token, msgId, rating) {
  console.log('postRateCorrection')

  const myHeaders = {
    'Content-Type': 'application/json',
  }
  if (token) myHeaders['Authorization'] = `Bearer ${token}`

  return fetch(`/api/spellcheck/${msgId}/rating`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(rating),
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

function addEmphasis(src) {
  const strArray = Array.from(src)

  var inEm = false
  const result = strArray
    .map((c) => {
      var rep = c
      if (c === '~') {
        rep = inEm ? '</mark>' : '<mark>'
        inEm = !inEm
      }
      return rep
    })
    .join('')
  return result
}

const postSpellCheck = async (token, text) => {
  const word = text.trim()
  if (word.length === 0) return Promise.resolve([])

  const query = {
    kreyol: 'GP',
    request: word,
  }

  const myHeaders = {
    'Content-Type': 'application/json',
  }
  if (token) myHeaders['Authorization'] = `Bearer ${token}`

  return fetch(`/api/spellcheck`, {
    method: 'POST',
//    credentials: 'same-origin',
    headers: myHeaders,
    body: JSON.stringify(query),
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
export default function Spellcheck({ session }) {
  const [request, setRequest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [response, setResponse] = useState(null)

  const eraseErrorMessage = () => setErrorMessage('')

  const rateCorrection = (note) => {
    console.log(`rateCorrection: ${JSON.stringify(response)}`)

    if (response?.id === undefined) return
    setIsLoading(true)
    try {
      const resp = postRateCorrection(session.session_id, response?.id, {
        rating: note,
      })

      resp.then((data) => {
        setIsLoading(false)

        if (data.errors !== undefined) {
          setErrorMessage('Erreur de zakari')
        }
      })
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submitting...')
    setErrorMessage('')
    setResponse(null)
    setIsLoading(true)
    setCopied(false)

    try {
      postSpellCheck(session.session_id, request).then((data) => {
        setIsLoading(false)

        if (data.errors !== undefined) {
          setErrorMessage('Erreur de zakari')
        } else {
          const result = data.response
          result.html = addEmphasis(result.message)
          result.id = data.id

          setResponse(result)
        }
      })
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error)
    }
  }

  return (
    <Section>
      <Heading size={2} renderAs="h1">
        Correcteur orthographique
      </Heading>
      <Container>
        {errorMessage.length > 0 && (
          <Notification className="error" mt={2} light color="danger">
            <Button remove onClick={eraseErrorMessage} />
            {errorMessage}
          </Notification>
        )}
        <hr />
        <form onSubmit={handleSubmit}>
          <Columns>
            <Columns.Column size="half">
              {/* <FlagGp /> */}
              <Form.Control>
                <Form.Textarea
                  name="source"
                  value={request}
                  onChange={(e) => {
                    setRequest(e.target.value)
                    setCopied(false)
                  }}
                  required
                />
              </Form.Control>
              <Button.Group align="right" mt={2}>
                <Button
                  color="primary"
                  disabled={!isLoading && request.length < 2}
                  loading={isLoading}
                >
                  Korijé
                </Button>
              </Button.Group>
            </Columns.Column>
            <Columns.Column size="half">
              <Message className="zakari_repons">
                <Message.Header>Répons</Message.Header>
                <Message.Body
                  dangerouslySetInnerHTML={{ __html: response?.html }}
                ></Message.Body>
              </Message>
              <Button.Group align="right" mt={2}>
                {response === null ? null : (
                  <Icon
                    size={24}
                    data-tooltip={`Kliké sé zétwal-la pou mèt on nòt,\n sa ké rédé-nou amélyoré zouti-la.`}
                    className="has-tooltip-arrow"
                    color="success"
                    dangerouslySetInnerHTML={{
                      __html: feather.icons.info.toSvg({
                        height: '1em',
                        width: '1em',
                      }),
                    }}
                  />
                )}
                <StarRating
                  hidden={response === null}
                  onRated={rateCorrection}
                />
                {/*                 <StarRating
                  hidden={response === null}
                  onRated={rateCorrection}
                /> */}
                <CopyToClipboard
                  text={response?.message}
                  onCopy={() => setCopied(true)}
                >
                  <Button
                    type="button"
                    color={copied ? 'info' : 'light'}
                    disabled={response === null}
                  >
                    {copied ? 'I adan !' : 'Kopyé'}
                  </Button>
                </CopyToClipboard>
              </Button.Group>
            </Columns.Column>
          </Columns>
        </form>
      </Container>
    </Section>
  )
}

Spellcheck.getLayout = function getLayout(page) {
  return <Standard>{page}</Standard>
}

export const config = {
  runtime: 'experimental-edge',
}

export async function getServerSideProps(context) {
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'
  const session = parseCookie(
    context.req.cookies?.[cookieName]
  )
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
