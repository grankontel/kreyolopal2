import React from 'react'
import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types'

export const FormFieldWrapper = (props) => {
  const { label, name, children } = props
  return (
    <Form.Field>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control>{children}</Form.Control>
    </Form.Field>
  )
}

FormFieldWrapper.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    children: PropTypes.node.isRequired
  }
  
  