import { defineConfig } from "drizzle-kit";
import config from './config'

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	migrations: {
		table: "migrations",
		schema: "public"
	},
	dbCredentials: {
		url: config.db.uri,
	}
});

