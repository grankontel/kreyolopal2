import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types'

export const FormField = (props) => {
  const { label, value, name, type, autoComplete, onChange } = props
  return (
    <Form.Field>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control>
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
      </Form.Control>
    </Form.Field>
  )
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
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

export default FormField
