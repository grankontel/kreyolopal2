import type { PoolClient } from 'pg'
import { pgPool } from './db'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import * as schema from '../db/schema'

export const migratePostgres = async (migrationsFolder: string) => {
    const client: PoolClient = await pgPool.connect()
    try {
      const db = drizzle(client, { schema })
    
      await migrate(db, {
        migrationsFolder
      })
    
    } finally {
      client.release()
    }
  
  }