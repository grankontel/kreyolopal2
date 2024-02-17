import {
  DateTimeInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

export const SpellcheckedEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" />
      <ReferenceInput source="user_id" reference="auth_user" />
      <TextInput source="kreyol" />
      <TextInput source="request" />
      <TextInput source="status" />
      <TextInput source="message" />
      <TextInput source="response.kreyol" />
      <DateTimeInput disabeld source="created_at" />
      <DateTimeInput disabled source="updated_at" />
    </SimpleForm>
  </Edit>
)
