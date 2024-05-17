CREATE OR REPLACE FUNCTION trigger_set_timestamp()
 RETURNS TRIGGER AS $$
 BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
 END;
 $$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"birth_date" date,
	"lastlogin" timestamp with time zone,
	"email_verif_token" varchar(255),
	"reset_pwd_token" varchar(255),
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_user_username_key" UNIQUE("username"),
	CONSTRAINT "auth_user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."auth_user" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lexicons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" varchar(255),
	"is_private" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."lexicons" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" varchar(40) NOT NULL,
	"subject" varchar(60) NOT NULL,
	"conditions" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."permissions" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"spellchecked_id" uuid PRIMARY KEY NOT NULL,
	"rating" integer,
	"user_correction" varchar(255),
	"user_notes" varchar(255),
	"admin_correction" varchar(255),
	"admin_notes" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."ratings" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(40) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "IX_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."ratings" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."roles_permissions" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spellcheckeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kreyol" char(2) NOT NULL,
	"request" varchar(255) NOT NULL,
	"status" varchar(255) NOT NULL,
	"message" varchar(255),
	"response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."spellcheckeds" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."user_session" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_roles" (
	"user_id" text NOT NULL,
	"role_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE OR REPLACE TRIGGER "set_timestamp" 
 BEFORE UPDATE ON "public"."users_roles" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lexicons" ADD CONSTRAINT "lexicons_owner_auth_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_spellchecked_id_spellcheckeds_id_fk" FOREIGN KEY ("spellchecked_id") REFERENCES "public"."spellcheckeds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spellcheckeds" ADD CONSTRAINT "spellcheckeds_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IX_auth_user_reset_pwd_token" ON "auth_user" ("reset_pwd_token");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "IX_owner_slug" ON "lexicons" ("owner","slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IX_users_roles_userid" ON "users_roles" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_action_subject" ON "permissions" USING btree ("action", "subject");
--> statement-breakpoint
