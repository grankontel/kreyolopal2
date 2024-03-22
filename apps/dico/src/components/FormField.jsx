import { Form } from "react-bulma-components";


export function FormField({ name, label, type, autocomplete }) {
  return (
    <Form.Field horizontal>
      <Form.Field.Label>

        <Form.Label htmlFor={name}>{label}</Form.Label>
      </Form.Field.Label>
      <Form.Field.Body>
        <Form.Input name={name} type={type} autoComplete={autocomplete} id={name} />
      </Form.Field.Body>
    </Form.Field>
  )
}