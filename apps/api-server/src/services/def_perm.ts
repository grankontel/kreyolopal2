import { Permission } from '@kreyolopal/domain'
import { pgPool } from './db'

const subjectPermissions = (subject: string, actions: string[]) =>
  actions.map((action) => ({ action, subject }))

// default permissions
const defaultPermissions: Permission[] = [
  {
    action: 'manage',
    subject: 'all',
  },
  ...subjectPermissions('dictionary', ['read', 'bookmark']),
  ...subjectPermissions('lexicon', [
    'add',
    'read',
    'edit',
    'delete',
    'list',
    'read_entry',
    'list_entry',
  ]),
  ...subjectPermissions('proposals', ['submit', 'read', 'validate', 'vote']),
  ...subjectPermissions('spellcheck', ['request', 'rate']),
]

const defaultRoles: string[] = ['admin', 'standard', 'reader', 'validator']

const defaultRolesPermissions: { role: string; permissions: number[] }[] = [
  {
    role: 'admin',
    permissions: [1],
  },
  {
    role: 'reader',
    permissions: [2, 5, 8, 9, 10, 12],
  },
  {
    role: 'standard',
    permissions: [...Array(14).keys()].map((i) => i + 2),
  },
]
export const setDefaultPermissions = () => {
  let query =
    'INSERT INTO "permissions" ("id","action", "subject", "conditions") VALUES '

  for (let index = 0; index < defaultPermissions.length; index++) {
    const element = defaultPermissions[index]
    const hasConditions = (element.conditions &&
      element.conditions.length > 0) as boolean
    const elemSql = `(${index + 1}, '${element.action}','${element.subject}',${hasConditions ? "'" + element.conditions + "'" : 'NULL'})`

    if (index > 0) query += ','
    query += elemSql
  }

  query +=
    ' ON CONFLICT (id) DO UPDATE SET action = EXCLUDED.action, subject = EXCLUDED.subject, conditions = EXCLUDED.conditions;'
  //  query += ' ON CONFLICT ON CONSTRAINT permissions_action_subject DO NOTHING;'
  return pgPool.query(query)
}

export const setDefaultRoles = () => {
  let query = 'INSERT INTO "roles" ("name") VALUES '

  for (let index = 0; index < defaultRoles.length; index++) {
    const element = defaultRoles[index]
    const elemSql = `('${element}')`

    if (index > 0) query += ','
    query += elemSql
  }

  query += ' ON CONFLICT DO NOTHING;'
  return pgPool.query(query)
}

export const rolesPermissions = () => {
  let query =
    'INSERT INTO "roles_permissions" ("role", "permission_id") VALUES '
  for (
    let roleIndex = 0;
    roleIndex < defaultRolesPermissions.length;
    roleIndex++
  ) {
    const item = defaultRolesPermissions[roleIndex]
    for (let permIndex = 0; permIndex < item.permissions.length; permIndex++) {
      const perm = item.permissions[permIndex]
      const elemSql = `('${item.role}',${perm})`

      if (roleIndex + permIndex > 0) query += ','

      query += elemSql
    }
  }
  query += ' ON CONFLICT DO NOTHING;'
  return pgPool.query(query)
}
