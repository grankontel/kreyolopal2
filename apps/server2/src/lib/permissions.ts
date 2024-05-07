import { DatabaseUser, pgPool } from "./db"
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

interface Permission {
	action: string
	subject: string
	conditions?: string
}

const getPermissionsFromDb = async (id: string) => {
	return pgPool.query<Permission>(`WITH user_role as (
		SELECT role_id
		FROM users_roles
		WHERE user_id =$1
		), user_perms as (
		SELECT DISTINCT rp.permission_id
		FROM roles_permissions rp JOIN user_role ON rp.role_id in 
		(select role_id from user_role)
		) 
		SELECT p.action, p.subject, p.conditions 
		FROM permissions p JOIN user_perms up ON p.id = up.permission_id
		`, [id]).then(result => result.rows.map(row =>
		(row.conditions !== null) ? row : ({
			action: row.action,
			subject: row.subject,

		})))
}


export const getUserPermissions = async (user: DatabaseUser) => {
	return new Promise<Permission[]>(async (resolve, reject) => {
		const perms: Permission[] = []

		if (user.is_admin) {
			resolve([{
				action: 'manage',
				subject: 'all'
			}])
		}
		else {
			return getPermissionsFromDb(user.id).then(result => {
				resolve(result)
			})
		}
	})
}

export const getEnforcer = (perms: Permission[]) => {
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

export const getUserEnforcer = async (user: DatabaseUser) => getUserPermissions(user).then(perms => getEnforcer(perms))

