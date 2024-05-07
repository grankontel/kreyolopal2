import { pgTable, index, unique, text, varchar, date, timestamp, boolean, foreignKey, uuid, char, jsonb, integer, uniqueIndex } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const authUser = pgTable("auth_user", {
	id: text("id").primaryKey().notNull(),
	username: text("username").notNull(),
	firstname: varchar("firstname", { length: 255 }).notNull(),
	lastname: varchar("lastname", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: text("password").notNull(),
	birthDate: date("birth_date"),
	lastlogin: timestamp("lastlogin", { withTimezone: true, mode: 'string' }),
	emailVerifToken: varchar("email_verif_token", { length: 255 }),
	resetPwdToken: varchar("reset_pwd_token", { length: 255 }),
	isAdmin: boolean("is_admin").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		ixAuthUserResetPwdToken: index("IX_auth_user_reset_pwd_token").on(table.resetPwdToken),
		authUserUsernameKey: unique("auth_user_username_key").on(table.username),
		authUserEmailKey: unique("auth_user_email_key").on(table.email),
	}
});

export const userSession = pgTable("user_session", {
	id: text("id").primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const spellcheckeds = pgTable("spellcheckeds", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" } ),
	kreyol: char("kreyol", { length: 2 }).notNull(),
	request: varchar("request", { length: 255 }).notNull(),
	status: varchar("status", { length: 255 }).notNull(),
	message: varchar("message", { length: 255 }),
	response: jsonb("response"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
	spellcheckedId: uuid("spellchecked_id").primaryKey().notNull().references(() => spellcheckeds.id, { onDelete: "cascade" } ),
	rating: integer("rating"),
	userCorrection: varchar("user_correction", { length: 255 }),
	userNotes: varchar("user_notes", { length: 255 }),
	adminCorrection: varchar("admin_correction", { length: 255 }),
	adminNotes: varchar("admin_notes", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const lexicons = pgTable("lexicons", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	owner: text("owner").notNull().references(() => authUser.id, { onDelete: "cascade" } ),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	description: varchar("description", { length: 255 }),
	isPrivate: boolean("is_private").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		ixOwnerSlug: uniqueIndex("IX_owner_slug").on(table.owner, table.slug),
	}
});