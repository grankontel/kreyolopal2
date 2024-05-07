import config from './src/config'
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from "pg";
import * as schema from './src/schema/schema';

const pool = new Pool({
  connectionString: config.db.uri,
});

const db = drizzle(pool, {schema});

migrate(db, {migrationsFolder: './migrations'}).then(() => {
  console.log('Migrations complete');
});