import { Admin, Resource, ListGuesser, EditGuesser, fetchUtils } from "react-admin";
import { Auth_userList } from "./admin/Auth_userList";
import { Auth_userEdit } from "./admin/Auth_userEdit";
import { SpellcheckedList } from "./admin/SpellcheckedList";
import { SpellcheckedEdit } from "./admin/SpellcheckedEdit";
import { User_sessionList } from "./admin/User_sessionList";

import postgrestRestProvider,
{
    IDataProviderConfig,
    defaultPrimaryKeys,
    defaultSchema
} from '@raphiniert/ra-data-postgrest';

const config = {
    apiUrl: '/postgrest',
    httpClient: fetchUtils.fetchJson,
    defaultListOp: 'eq',
    primaryKeys: defaultPrimaryKeys,
    schema: defaultSchema
}
const AdminApp = () => (
    <Admin dataProvider={postgrestRestProvider(config)}>
        <Resource
            name="auth_user"
            list={Auth_userList}
            edit={Auth_userEdit}
            recordRepresentation="username"
            options={{ label: 'Users' }}
        />
        <Resource
            name="user_session"
            list={User_sessionList}
            edit={EditGuesser}
            recordRepresentation="id"
            options={{ label: 'Sessions' }}
        />
        <Resource
            name="spellcheckeds"
            list={SpellcheckedList}
            edit={SpellcheckedEdit}
            recordRepresentation="id"
        />
        <Resource
            name="ratings"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="spellchecked_id"
        />
    </Admin>
);

export default AdminApp;