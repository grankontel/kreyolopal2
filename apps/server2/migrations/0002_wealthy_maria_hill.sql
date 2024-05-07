INSERT INTO "roles" ("id", "name", "created_at", "updated_at") VALUES
(1,	'admin',	'2024-05-07 09:59:09.230519+00',	'2024-05-07 09:59:09.230519+00'),
(2,	'standard',	'2024-05-07 09:59:24.792949+00',	'2024-05-07 09:59:24.792949+00');
--> statement-breakpoint
INSERT INTO "permissions" ("id", "action", "subject", "conditions", "created_at", "updated_at") VALUES
(1,	'manage',	'all',	NULL,	'2024-05-07 10:11:46.47642+00',	'2024-05-07 10:11:46.47642+00');
--> statement-breakpoint
INSERT INTO "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") VALUES
(1,	1,	'2024-05-07 10:12:04.930803+00',	'2024-05-07 10:12:04.930803+00');
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
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IX_users_roles_userid" ON "users_roles" ("user_id");
