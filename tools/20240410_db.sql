-- Adminer 4.8.1 PostgreSQL 16.1 dump

-- create user 'kreyolapp' with encrypted password '';
GRANT ALL ON SCHEMA public TO 'kreyolapp';
create database 'kreyol';
alter database 'kreyol' OWNER TO 'kreyolapp';


\connect "kreyol";

DROP TABLE IF EXISTS "auth_user";
CREATE TABLE "public"."auth_user" (
    "id" text NOT NULL,
    "username" text NOT NULL,
    "firstname" character varying(255) NOT NULL,
    "lastname" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "password" text NOT NULL,
    "birth_date" date,
    "lastlogin" timestamptz,
    "email_verif_token" character varying(255),
    "reset_pwd_token" character varying(255),
    "is_admin" boolean DEFAULT false NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "auth_user_email_key" UNIQUE ("email"),
    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "auth_user_username_key" UNIQUE ("username")
) WITH (oids = false);

CREATE INDEX "IX_auth_user_reset_pwd_token" ON "public"."auth_user" USING btree ("reset_pwd_token");

INSERT INTO "auth_user" ("id", "username", "firstname", "lastname", "email", "password", "birth_date", "lastlogin", "email_verif_token", "reset_pwd_token", "is_admin", "created_at", "updated_at") VALUES
('c8e94e4tu645v6t',	'tmalo',	'Thierry',	'Malo',	'thierry.malo@gmail.com',	'$argon2id$v=19$m=24,t=2,p=1$o2gAYFvA6w5lbP8yo9LAcw$KqO1HFG/yCUcFjjWkCZ3BLSb5ijcHeZv',	'1974-09-30',	'2024-04-10 12:19:10.062124+00',	NULL,	NULL,	'f',	'2024-02-08 11:19:24.128999+00',	'2024-04-10 12:19:10.062124+00');

DELIMITER ;;

CREATE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."auth_user" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();;

DELIMITER ;

DROP TABLE IF EXISTS "lexicons";
CREATE TABLE "public"."lexicons" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "owner" text NOT NULL,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "description" character varying(255),
    "is_private" boolean DEFAULT false NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "IX_owner_slug" UNIQUE ("owner", "slug"),
    CONSTRAINT "lexicons_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DELIMITER ;;

CREATE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."lexicons" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();;

DELIMITER ;

DROP TABLE IF EXISTS "ratings";
CREATE TABLE "public"."ratings" (
    "spellchecked_id" uuid NOT NULL,
    "rating" integer,
    "user_correction" character varying(255),
    "user_notes" character varying(255),
    "admin_correction" character varying(255),
    "admin_notes" character varying(255),
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "ratings_pkey" PRIMARY KEY ("spellchecked_id")
) WITH (oids = false);


DELIMITER ;;

CREATE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."ratings" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();;

DELIMITER ;

DROP TABLE IF EXISTS "spellcheckeds";
CREATE TABLE "public"."spellcheckeds" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" text NOT NULL,
    "kreyol" character(2) NOT NULL,
    "request" character varying(255) NOT NULL,
    "status" character varying(255) NOT NULL,
    "message" character varying(255),
    "response" jsonb,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "spellcheckeds_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DELIMITER ;;

CREATE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."spellcheckeds" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();;

DELIMITER ;

DROP TABLE IF EXISTS "user_session";
CREATE TABLE "public"."user_session" (
    "id" text NOT NULL,
    "expires_at" timestamptz DEFAULT now() NOT NULL,
    "user_id" text NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "user_session_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DELIMITER ;;

CREATE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."user_session" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();;

DELIMITER ;

ALTER TABLE ONLY "public"."lexicons" ADD CONSTRAINT "lexicons_owner_fkey" FOREIGN KEY (owner) REFERENCES auth_user(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."ratings" ADD CONSTRAINT "ratings_spellchecked_fkey" FOREIGN KEY (spellchecked_id) REFERENCES spellcheckeds(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."spellcheckeds" ADD CONSTRAINT "spellcheckeds_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE NOT DEFERRABLE;

-- 2024-04-10 14:56:06.167227+00