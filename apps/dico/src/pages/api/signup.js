import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { SqliteError } from "better-sqlite3";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(404).end();
		return;
	}

	const body = req.body;
	const username = body?.username;
	if (!username || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
		res.status(400).json({
			error: "Invalid username"
		});
		return;
	}
	const password = body?.password;
	if (!password || password.length < 6 || password.length > 255) {
		res.status(400).json({
			error: "Invalid password"
		});
		return;
	}

	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);

	try {
		db.prepare("INSERT INTO user (id, username, password) VALUES(?, ?, ?)").run(
			userId,
			username,
			hashedPassword
		);

		const session = await lucia.createSession(userId, {});
		res
			.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
			.status(200)
			.end();
		return;
	} catch (e) {
		if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
			res.status(400).json({
				error: "Username already used"
			});
			return;
		}
		res.status(500).json({
			error: "An unknown error occurred"
		});
		return;
	}
}