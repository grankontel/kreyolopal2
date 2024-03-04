import React, { useRef, useState } from 'react'
import { Box, Button, Columns, Form, Notification } from 'react-bulma-components'
import { Turnstile } from '@marsidev/react-turnstile'
import { FormField } from '#components/FormField'
import PropTypes from 'prop-types'
import { siteVerify } from '../turnstile'

export function LoginForm({ endpoint, turnstileKey, destination }) {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
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

      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        router.push(destination)
      } else {
        const error = (await response.json()).error
        setNotif({
          color: 'danger',
          message: error?.error || error.toString(),
        })
      }
    } catch (error) {
      setNotif({ color: 'danger', message: error?.error || error.toString() })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Box className="login_form">
      <form ref={formRef} onSubmit={handleSubmit}>
        <FormField
          label="Username"
          name="username"
          type="text"
          value={username}
          autoComplete="usernane"
          onChange={handler(setUsername)}
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={pwd}
          autoComplete="current-password"
          onChange={handler(setPwd)}
          required
        />
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
            Login
          </Button>
        </Button.Group>
        <Turnstile siteKey={turnstileKey} />
      </form>
    </Box>
  )
}

LoginForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
  turnstileKey: PropTypes.string,
  destination: PropTypes.string.isRequired,
}

LoginForm.defaultProps = {
  endpoint: '/api/auth/login',
  destination: '/',
}
