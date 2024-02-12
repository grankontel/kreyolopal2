import { Datagrid, DateField, List, ReferenceField, TextField } from 'react-admin';

export const User_sessionList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <DateField source="expires_at" />
            <ReferenceField source="user_id" reference="auth_user" />
            <DateField source="created_at" />
            <DateField source="updated_at" />
        </Datagrid>
    </List>
);