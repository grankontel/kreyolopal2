import { relations } from "drizzle-orm/relations";
import { authUser, lexicons, spellcheckeds, ratings, userSession, roles, roles_permissions, permissions, users_roles } from "./schema";

export const lexiconsRelations = relations(lexicons, ({one}) => ({
	authUser: one(authUser, {
		fields: [lexicons.owner],
		references: [authUser.id]
	}),
}));

export const authUserRelations = relations(authUser, ({many}) => ({
	lexicons: many(lexicons),
	spellcheckeds: many(spellcheckeds),
	userSessions: many(userSession),
	users_roles: many(users_roles),
}));

export const spellcheckedsRelations = relations(spellcheckeds, ({one, many}) => ({
	authUser: one(authUser, {
		fields: [spellcheckeds.userId],
		references: [authUser.id]
	}),
	ratings: many(ratings),
}));

export const ratingsRelations = relations(ratings, ({one}) => ({
	spellchecked: one(spellcheckeds, {
		fields: [ratings.spellcheckedId],
		references: [spellcheckeds.id]
	}),
}));

export const userSessionRelations = relations(userSession, ({one}) => ({
	authUser: one(authUser, {
		fields: [userSession.userId],
		references: [authUser.id]
	}),
}));

export const roles_permissionsRelations = relations(roles_permissions, ({one}) => ({
	role: one(roles, {
		fields: [roles_permissions.roleId],
		references: [roles.id]
	}),
	permission: one(permissions, {
		fields: [roles_permissions.permissionId],
		references: [permissions.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	roles_permissions: many(roles_permissions),
	users_roles: many(users_roles),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	roles_permissions: many(roles_permissions),
}));

export const users_rolesRelations = relations(users_roles, ({one}) => ({
	authUser: one(authUser, {
		fields: [users_roles.userId],
		references: [authUser.id]
	}),
	role: one(roles, {
		fields: [users_roles.roleId],
		references: [roles.id]
	}),
}));