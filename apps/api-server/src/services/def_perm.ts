import { Permission } from '@kreyolopal/domain'
import { pgPool } from './db';

// default permissions
const defaultPermissions: Permission[] = [
  {
    "action": "manage",
    "subject": "all",
  },
  {
    "action": "read",
    "subject": "dictionary",
  },
  {
    "action": "add",
    "subject": "lexicon",
  },
  {
    "action": "read",
    "subject": "lexicon",
  },
  {
    "action": "edit",
    "subject": "lexicon",
  },
  {
    "action": "delete",
    "subject": "lexicon",
  },
  {
    "action": "list",
    "subject": "lexicon",
  },
  {
    "action": "read_entry",
    "subject": "lexicon",
  },
  {
    "action": "list_entry",
    "subject": "lexicon",
  },
]

export const setDefaultPermissions = () => {
  let query = 'INSERT INTO "permissions" ("action", "subject", "conditions") VALUES '

  for (let index = 0; index < defaultPermissions.length; index++) {
    const element = defaultPermissions[index];
    const hasConditions = (element.conditions && element.conditions.length > 0) as boolean
    const elemSql = `('${element.action}','${element.subject}',${hasConditions ? "'" + element.conditions + "'" : 'NULL'})`

    if (index > 0)
      query += ','
    query += elemSql
  }

  query += ' ON CONFLICT ON CONSTRAINT permissions_action_subject DO NOTHING;'
  return pgPool.query(query)
}

