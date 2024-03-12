import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Box, Button, Columns, Form, Notification } from 'react-bulma-components'
import { Turnstile } from '@marsidev/react-turnstile'
import { FormField } from '#components/FormField'
import PropTypes from 'prop-types'
import { siteVerify } from '../turnstile'
import { FormFieldWrapper } from '#components/FormFieldWrapper'
import DatePicker from 'react-datepicker'

const addYears = (aDate, nbYears) => {
  var aYear = aDate.getFullYear() + nbYears
  aDate.setFullYear(aYear)
  return aDate
}

const nextDay = (aDate) => {
  let tomorrow = new Date();
  tomorrow.setDate(aDate.getDate() + 1);
  return tomorrow
}

export function SignupForm({ endpoint, turnstileKey, destination }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notif, setNotif] = useState({ color: 'warning', message: '' })
  const maxDate = addYears(new Date(), -12)

  const [startDate, setStartDate] = useState(nextDay(maxDate))

  const clearMessage = () => {
    setNotif({ color: notif.color, message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target).entries())
    const token = formData['cf-turnstile-response']
    delete formData['cf-turnstile-response']

    try {
      setIsLoading(true)
      clearMessage()

      await siteVerify(token)

      await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
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
          router.push(destination)
        })
    } catch (error) {
      setNotif({ color: 'danger', message: error?.error || error.toString() })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box className="register_form">
      <form method="post" action="/api/auth/signup" onSubmit={handleSubmit}>
        <FormField name="email" label="Email" autocomplete="email" type="text" />
        <FormField
          name="username"
          label="Identifiant"
          autocomplete="username"
          type="text"
        />
        <FormField
          name="password"
          label="Mot de passe"
          autocomplete="new-password"
          type="password"
        />
        <br />
        <FormField
          name="firstname"
          label="Prénom"
          autocomplete="given-name"
          type="text"
        />
        <FormField name="lastname" label="Nom" autocomplete="family-name" type="text" />

        <FormFieldWrapper name="birth_date" label="Date de naissance">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            maxDate={maxDate}
            startDate={addYears(new Date(), -20)}
            minDate={addYears(new Date(), -100)}
            autoComplete="bday"
            name="birth_date"
            locale="fr"
            className="input"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </FormFieldWrapper>
        {notif.message.length > 0 ? (
          <Notification color={notif.color}>
            {notif.message}
            <Button remove onClick={() => clearMessage()} />
          </Notification>
        ) : (
          ''
        )}

        <Button.Group align="center">
          <Button loading={isLoading} color="primary">
            Continue
          </Button>
        </Button.Group>
        <Turnstile siteKey={turnstileKey} />
      </form>
      <hr />
      <Link href="/login">Sign in</Link>
    </Box>
  )
}

SignupForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
  turnstileKey: PropTypes.string,
  destination: PropTypes.string.isRequired,
}

SignupForm.defaultProps = {
  endpoint: '/api/auth/signup',
  destination: '/',
}
