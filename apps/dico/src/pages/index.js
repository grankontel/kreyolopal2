import { validateRequest } from "@/lib/auth";
import { useRouter } from "next/router";


export async function getServerSideProps(context) {
	const { user } = await validateRequest(context.req, context.res);
	if (!user) {
		return {
			redirect: {
				permanent: false,
				destination: "/login"
			}
		};
	}
	return {
		props: {
			user
		}
	};
}

export default function Page({ user }) {
	const router = useRouter();

	async function onSubmit(e) {
		e.preventDefault();
		const formElement = e.target;
		await fetch(formElement.action, {
			method: formElement.method
		});
		router.push("/login");
	}

	return (
		<>
			<h1>Hi, {user.username}!</h1>
			<p>Your user ID is {user.id}.</p>
			<form method="post" action="/api/logout" onSubmit={onSubmit}>
				<button>Sign out</button>
			</form>
		</>
	);
}