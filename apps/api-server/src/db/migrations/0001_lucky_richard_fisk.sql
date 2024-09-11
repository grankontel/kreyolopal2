ALTER TABLE "auth_user" ADD COLUMN "customer_id" varchar(25) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD CONSTRAINT "auth_user_customer_id" UNIQUE("customer_id");