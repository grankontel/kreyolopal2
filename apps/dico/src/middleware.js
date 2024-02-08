import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";

export async function middleware(request) {
	const currentUser = request.cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME)?.value
	// console.log(currentUser)

	if (request.method === "GET") {
		return NextResponse.next();
	}
	const originHeader = request.headers.get("Origin");
	const hostHeader = request.headers.get("Host");
	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
		return new NextResponse(null, {
			status: 403
		});
	}
	return NextResponse.next();
}