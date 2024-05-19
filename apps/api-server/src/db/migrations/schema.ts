import { pgTable, foreignKey, uuid, text, char, varchar, jsonb, timestamp, integer, unique, serial, index, date, boolean, uniqueIndex, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const spellcheckeds = pgTable("spellcheckeds", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => auth_user.id, { onDelete: "cascade" } ),
	kreyol: char("kreyol", { length: 2 }).notNull(),
	request: varchar("request", { length: 255 }).notNull(),
	status: varchar("status", { length: 255 }).notNull(),
	message: varchar("message", { length: 255 }),
	response: jsonb("response"),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
	spellchecked_id: uuid("spellchecked_id").primaryKey().notNull().references(() => spellcheckeds.id, { onDelete: "cascade" } ),
	rating: integer("rating"),
	user_correction: varchar("user_correction", { length: 255 }),
	user_notes: varchar("user_notes", { length: 255 }),
	admin_correction: varchar("admin_correction", { length: 255 }),
	admin_notes: varchar("admin_notes", { length: 255 }),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const roles = pgTable("roles", {
	name: varchar("name", { length: 40 }).primaryKey().notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
	id: serial("id").primaryKey().notNull(),
	action: varchar("action", { length: 40 }).notNull(),
	subject: varchar("subject", { length: 60 }).notNull(),
	conditions: jsonb("conditions"),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		permissions_action_subject: unique("permissions_action_subject").on(table.action, table.subject),
	}
});

export const auth_user = pgTable("auth_user", {
	id: text("id").primaryKey().notNull(),
	username: text("username").notNull(),
	firstname: varchar("firstname", { length: 255 }).notNull(),
	lastname: varchar("lastname", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: text("password").notNull(),
	birth_date: date("birth_date"),
	lastlogin: timestamp("lastlogin", { withTimezone: true, mode: 'string' }),
	email_verif_token: varchar("email_verif_token", { length: 255 }),
	reset_pwd_token: varchar("reset_pwd_token", { length: 255 }),
	is_admin: boolean("is_admin").default(false).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		IX_auth_user_reset_pwd_token: index("IX_auth_user_reset_pwd_token").on(table.reset_pwd_token),
		auth_user_username_key: unique("auth_user_username_key").on(table.username),
		auth_user_email_key: unique("auth_user_email_key").on(table.email),
	}
});

export const lexicons = pgTable("lexicons", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	owner: text("owner").notNull().references(() => auth_user.id, { onDelete: "cascade" } ),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	description: varchar("description", { length: 255 }),
	is_private: boolean("is_private").default(false).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		IX_owner_slug: uniqueIndex("IX_owner_slug").on(table.owner, table.slug),
	}
});

export const user_session = pgTable("user_session", {
	id: text("id").primaryKey().notNull(),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	user_id: text("user_id").notNull().references(() => auth_user.id, { onDelete: "cascade" } ),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const roles_permissions = pgTable("roles_permissions", {
	permission_id: integer("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" } ),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: varchar("role", { length: 40 }).notNull().references(() => roles.name),
},
(table) => {
	return {
		roles_permissions_role_permission_id: primaryKey({ columns: [table.permission_id, table.role], name: "roles_permissions_role_permission_id"}),
	}
});

export const users_roles = pgTable("users_roles", {
	user_id: text("user_id").notNull().references(() => auth_user.id, { onDelete: "cascade" } ),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: varchar("role", { length: 40 }).notNull().references(() => roles.name),
},
(table) => {
	return {
		IX_users_roles_userid: index("IX_users_roles_userid").on(table.user_id),
		users_roles_user_id_role: primaryKey({ columns: [table.user_id, table.role], name: "users_roles_user_id_role"}),
	}
});