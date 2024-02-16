import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types'

export const FormField = (props) => {
  const { label, value, name, type, autoComplete, setValue } = props
  return (
    <Form.Field>
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Form.Input
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete || ''}
          onChange={(e) => setValue(e.target.value)}
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
  setValue: PropTypes.func,
  required: PropTypes.bool,
}

FormField.defaultProps = {
  type: 'text',
  required: false,
  autoComplete: 'on',
  setValue: (e) => e.preventDefault(),
}

export default FormField
