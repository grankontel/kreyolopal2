import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
	const { user } = await validateRequest(context.req, context.res);
	if (user) {
		return {
			redirect: {
				permanent: false,
				destination: "/"
			}
		};
	}
	return {
		props: {}
	};
}

export default function Page() {
	const router = useRouter();
	const [error, setError] = useState(null);

	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		const formElement = e.target;
		const response = await fetch(formElement.action, {
			method: formElement.method,
			body: JSON.stringify(Object.fromEntries(new FormData(formElement).entries())),
			headers: {
				"Content-Type": "application/json"
			}
		});
		if (response.ok) {
			router.push("/");
		} else {
			setError((await response.json()).error);
		}
	}

	return (
		<>
			<h1>Sign in</h1>
			<form method="post" action="/api/login" onSubmit={onSubmit}>
				<label htmlFor="username">Username</label>
				<input name="username" id="username" />
				<br />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<br />
				<button>Continue</button>
				<p>{error}</p>
			</form>
			<Link href="/signup">Create an account</Link>
		</>
	);
}