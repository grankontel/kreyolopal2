import config from '#config'
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import pg from 'pg'

export const pgPool = new pg.Pool({
  user: config.db.username,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  connectionTimeoutMillis: 5000,
})

pgPool.connect().then((client) => {
  // create trigger for timestamp
  client.query(`CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`)

  //table auth_user
  client.query(`CREATE TABLE IF NOT EXISTS "public"."auth_user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "firstname" character varying(255) NOT NULL,
    "lastname" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "password" TEXT NOT NULL,
    "lastlogin" timestamptz,
    "email_verif_token" character varying(255),
    "reset_pwd_token" character varying(255),
    "is_admin" boolean DEFAULT false NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "auth_user_email_key" UNIQUE ("email"),
    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
) WITH (oids = false);`)

  client.query(`CREATE INDEX IF NOT EXISTS "IX_auth_user_reset_pwd_token" 
    ON "public"."auth_user" USING btree ("reset_pwd_token");`)

  client.query(`CREATE OR REPLACE TRIGGER "set_timestamp" 
    BEFORE UPDATE ON "public"."auth_user" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp()`)

  //table session
  client.query(`CREATE TABLE IF NOT EXISTS "public"."user_session" (
        "id" TEXT PRIMARY KEY,
        "expires_at" timestamptz DEFAULT now() NOT NULL,
        user_id TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
    ) WITH (oids = false);`)

  client.query(`CREATE OR REPLACE TRIGGER "set_timestamp" 
    BEFORE UPDATE ON "public"."user_session" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp()`)

  // table spellecheck
  client.query(`CREATE TABLE IF NOT EXISTS "public"."spellcheckeds" (
    "id" uuid DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "kreyol" char(2) NOT NULL,
    "request" character varying(255) NOT NULL,
    "status" character varying(255) NOT NULL,
    "message" character varying(255),
    "response" jsonb,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "spellcheckeds_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "spellcheckeds_user_id_fkey" FOREIGN KEY ("user_id") 
    REFERENCES "auth_user"(id) ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false)`)

  client.query(`CREATE OR REPLACE TRIGGER "set_timestamp" 
BEFORE UPDATE ON "public"."spellcheckeds" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp()`)

  client.query(`CREATE TABLE IF NOT EXISTS "public"."ratings" (
        "spellchecked_id" uuid NOT NULL,
        "rating" integer,
        "user_correction" character varying(255),
        "user_notes" character varying(255),
        "admin_correction" character varying(255),
        "admin_notes" character varying(255),
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "ratings_pkey" PRIMARY KEY ("spellchecked_id"),
        CONSTRAINT "ratings_spellchecked_fkey" FOREIGN KEY ("spellchecked_id") 
        REFERENCES "spellcheckeds"(id) ON DELETE CASCADE NOT DEFERRABLE
    ) WITH (oids = false);`)

  client.query(`CREATE OR REPLACE TRIGGER "set_timestamp" 
    BEFORE UPDATE ON "public"."ratings" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp()`)

  client.release()
})

export const adapter = new NodePostgresAdapter(pgPool, {
  user: 'auth_user',
  session: 'user_session',
})

export interface DatabaseUser {
  id: string
  username: string
  password: string
  is_admin: boolean
}
