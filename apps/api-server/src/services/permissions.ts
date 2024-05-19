import { Permission, getEnforcer } from "@kreyolopal/domain"
import { DatabaseUser, pgPool } from "./db"

export const getPermissionsFromDb = async (userId: string) => {
	const result = await pgPool.query<Permission>(`WITH user_role as (
		SELECT role
		FROM users_roles
		WHERE user_id =$1
	), 
	user_perms as (
		SELECT DISTINCT rp.permission_id
		FROM roles_permissions rp JOIN user_role ON rp.role in 
		(select role from user_role)
	) 
	SELECT p.action, p.subject, p.conditions 
	FROM permissions p JOIN user_perms up ON p.id = up.permission_id`
	, [userId])
	return result.rows
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

export const getUserEnforcer = async (user: DatabaseUser) => getUserPermissions(user).then(perms => getEnforcer(perms))

