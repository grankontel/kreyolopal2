

```sql
INSERT INTO "roles" ("id", "name", "created_at", "updated_at") VALUES
(1,	'admin',	'2024-05-07 09:59:09.230519+00',	'2024-05-07 09:59:09.230519+00'),
(2,	'standard',	'2024-05-07 09:59:24.792949+00',	'2024-05-07 09:59:24.792949+00');
--> statement-breakpoint
INSERT INTO "permissions" ("id", "action", "subject", "conditions", "created_at", "updated_at") VALUES
(1,	'manage',	'all',	NULL,	'2024-05-07 10:11:46.47642+00',	'2024-05-07 10:11:46.47642+00');
--> statement-breakpoint
INSERT INTO "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") VALUES
(1,	1,	'2024-05-07 10:12:04.930803+00',	'2024-05-07 10:12:04.930803+00');
--> statement-breakpoint
```
