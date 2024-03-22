import React from 'react'
import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types'
import { FormFieldWrapper } from '#components/FormFieldWrapper'

export const FormField = (props) => {
  const { label, value, name, type, autoComplete, onChange } = props
  return (
    <FormFieldWrapper name={name} label={label}>
      <Form.Input
        name={name}
        placeholder={label}
        type={type}
        value={value}
        id={name}
        autoComplete={autoComplete || ''}
        onChange={onChange}
        required
      />
    </FormFieldWrapper>
  )
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  name: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password']).isRequired,
  autoComplete: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
}

FormField.defaultProps = {
  type: 'text',
  required: false,
  autoComplete: 'on',
  onChange: (e) => e.preventDefault(),
}
