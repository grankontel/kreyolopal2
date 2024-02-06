import { db } from "@/lib/db";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/auth";

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

	const existingUser = db.prepare("SELECT * FROM user WHERE username = ?").get(username)
	if (!existingUser) {
		res.status(400).json({
			error: "Incorrect username or password"
		});
		return;
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);
	if (!validPassword) {
		res.status(400).json({
			error: "Incorrect username or password"
		});
		return;
	}

	const session = await lucia.createSession(existingUser.id, {});
	res
		.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
		.status(200)
		.end();
}