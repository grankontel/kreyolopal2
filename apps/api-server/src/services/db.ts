import config from '#config'
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import pg from 'pg'

export const pgPool = new pg.Pool({
  connectionString: config.db.uri, //config.neon.uri,
  connectionTimeoutMillis: 5000,
})

export const adapter = new NodePostgresAdapter(pgPool, {
  user: 'auth_user',
  session: 'user_session',
})

export interface DatabaseUser {
  id: string
  username: string
  password: string
  firstname: string
  lastname: string
  is_admin: boolean
}

export type PgPool = pg.Pool
