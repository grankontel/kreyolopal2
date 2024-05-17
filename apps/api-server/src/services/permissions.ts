import { Permission } from "@kreyolopal/domain"
import { DatabaseUser, pgPool } from "./db"

export const getUserPermissions = async (user: DatabaseUser) => {
	if (user.is_admin) {
		return [{
			action: 'manage',
			subject: 'all'
		}]
	}
	const result = await pgPool.query<Permission>(`WITH user_role as (
		SELECT role_id
		FROM users_roles
		WHERE user_id =$1
	), 
	user_perms as (
		SELECT DISTINCT rp.permission_id
		FROM roles_permissions rp JOIN user_role ON rp.role_id in 
		(select role_id from user_role)
	) 
	SELECT p.action, p.subject, p.conditions 
	FROM permissions p JOIN user_perms up ON p.id = up.permission_id`
	, [user.id])
	return result.rows
}
