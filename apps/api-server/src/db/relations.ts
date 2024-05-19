import { relations } from "drizzle-orm/relations";
import { auth_user, spellcheckeds, ratings, lexicons, user_session, permissions, roles_permissions, roles, users_roles } from "./schema";

export const spellcheckedsRelations = relations(spellcheckeds, ({one, many}) => ({
	auth_user: one(auth_user, {
		fields: [spellcheckeds.user_id],
		references: [auth_user.id]
	}),
	ratings: many(ratings),
}));

export const auth_userRelations = relations(auth_user, ({many}) => ({
	spellcheckeds: many(spellcheckeds),
	lexicons: many(lexicons),
	user_sessions: many(user_session),
	users_roles: many(users_roles),
}));

export const ratingsRelations = relations(ratings, ({one}) => ({
	spellchecked: one(spellcheckeds, {
		fields: [ratings.spellchecked_id],
		references: [spellcheckeds.id]
	}),
}));

export const lexiconsRelations = relations(lexicons, ({one}) => ({
	auth_user: one(auth_user, {
		fields: [lexicons.owner],
		references: [auth_user.id]
	}),
}));

export const user_sessionRelations = relations(user_session, ({one}) => ({
	auth_user: one(auth_user, {
		fields: [user_session.user_id],
		references: [auth_user.id]
	}),
}));

export const roles_permissionsRelations = relations(roles_permissions, ({one}) => ({
	permission: one(permissions, {
		fields: [roles_permissions.permission_id],
		references: [permissions.id]
	}),
	role: one(roles, {
		fields: [roles_permissions.role],
		references: [roles.name]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	roles_permissions: many(roles_permissions),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	roles_permissions: many(roles_permissions),
	users_roles: many(users_roles),
}));

export const users_rolesRelations = relations(users_roles, ({one}) => ({
	auth_user: one(auth_user, {
		fields: [users_roles.user_id],
		references: [auth_user.id]
	}),
	role: one(roles, {
		fields: [users_roles.role],
		references: [roles.name]
	}),
}));