import { Datagrid, DateField, List, ReferenceField, TextField } from 'react-admin';

export const SpellcheckedList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="user_id" reference="auth_user" />
            <TextField source="kreyol" />
            <TextField source="request" />
            <TextField source="status" />
            <TextField source="message" />
            <TextField source="response.kreyol" />
            <DateField source="created_at" />
            <DateField source="updated_at" />
        </Datagrid>
    </List>
);