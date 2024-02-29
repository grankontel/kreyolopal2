import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  fetchUtils,
} from 'react-admin'
import { Auth_userList } from './admin/Auth_userList'
import { Auth_userEdit } from './admin/Auth_userEdit'
import { SpellcheckedList } from './admin/SpellcheckedList'
import { SpellcheckedEdit } from './admin/SpellcheckedEdit'
import { User_sessionList } from './admin/User_sessionList'

import postgrestRestProvider, {
  IDataProviderConfig,
  defaultPrimaryKeys,
  defaultSchema,
} from '@raphiniert/ra-data-postgrest'
import adminAuthProvider from '../lib/adminAuthProvider'

const httpClient = (url, options = {}) => {
  const data = localStorage.getItem('auth')
  if (data !== null) {
    const auth = JSON.parse(data)
    if (auth?.token) {
      options.user = {
        authenticated: true,
        token: `Bearer ${auth.token}`,
      }
    }
  }

  return fetchUtils.fetchJson(url, options)
}

const config = {
  apiUrl: '/postgrest',
  httpClient: httpClient, // fetchUtils.fetchJson,
  defaultListOp: 'eq',
  primaryKeys: defaultPrimaryKeys,
  schema: defaultSchema,
}

export const AdminApp = () => (
  <Admin
    dataProvider={postgrestRestProvider(config)}
    authProvider={adminAuthProvider}
  >
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
)
