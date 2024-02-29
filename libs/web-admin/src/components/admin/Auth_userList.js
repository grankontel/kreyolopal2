import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  List,
  TextField,
} from 'react-admin'

export const Auth_userList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="firstname" />
      <TextField source="lastname" />
      <BooleanField source="is_admin" />
      <EmailField source="email" />
      <TextField source="password" />
      <TextField source="lastlogin" />
      <TextField source="email_verif_token" />
      <TextField source="reset_pwd_token" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
)
