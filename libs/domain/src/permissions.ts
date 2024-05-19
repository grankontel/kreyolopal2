import { AbilityBuilder, AnyAbility, createMongoAbility } from '@casl/ability';

export interface Permission {
	action: string
	subject: string
	conditions?: string
}

export interface LoginResponse {
	cookie: string;
	firstname: string;
	lastname: string;
	permissions: Permission[];
	token?: string;
}

export const getEnforcer = (perms: Permission[]) : AnyAbility => {
	// define abilities
	const { can: allow, cannot: forbid, build } = new AbilityBuilder(createMongoAbility);

	perms.forEach(row => {
		if (row.conditions) {
			const conditions = JSON.parse(row.conditions);
			allow(row.action, row.subject, conditions);
		} else {
			allow(row.action, row.subject);
		}
	})

	const ability = build();
	return ability
}
