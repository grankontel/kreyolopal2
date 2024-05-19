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
