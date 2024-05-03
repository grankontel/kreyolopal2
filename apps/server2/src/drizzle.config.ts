import type { Config } from 'drizzle-kit'
import config from './config'

const connectionString = `postgresql://${config.db.username}:${encodeURIComponent(
  String(config.db.password)
)}@${config.db.host}:${config.db.port}/${config.db.database}`

export default {
  schema: './src/schema/*',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies Config
