import { lucia, validateRequest } from "@/lib/auth";

// https://github.com/lucia-auth/examples/tree/main/nextjs-pages/username-and-password

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(404).end();
		return;
	}
	const { session } = await validateRequest(req, res);
	if (!session) {
		res.status(401).end();
		return;
	}
	await lucia.invalidateSession(session.id);
	res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize()).status(200).end();
}