import { BooleanInput, DateTimeInput, Edit, SimpleForm, TextInput } from 'react-admin';

export const Auth_userEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id"  />
            <TextInput source="username" />
            <TextInput source="firstname" />
            <TextInput source="lastname" />
            <TextInput source="email" />
            <TextInput source="password" />
            <TextInput source="lastlogin" />
            <TextInput source="email_verif_token" />
            <TextInput source="reset_pwd_token" />
            <BooleanInput source="is_admin" />
            <DateTimeInput disabled source="created_at" />
            <DateTimeInput disabled source="updated_at" />
        </SimpleForm>
    </Edit>
);