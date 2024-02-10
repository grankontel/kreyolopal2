import {useAuth} from '@kreyolopal/web-ui'
import { useRouter } from "next/navigation";
import Standard from '@/layouts/Standard'


/* export async function getServerSideProps(context) {
	const user = parseCookie(context.req.cookies?.[process.env.NEXT_PUBLIC_COOKIE_NAME])
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
} */

export default function Page(/* { user } */) {
	const user = useAuth()?.session
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
			<h1>Hi, {user?.username}!</h1>
			<p>Your user ID is {user?.user_id}.</p>
			<form method="post" action="/api/auth/logout" onSubmit={onSubmit}>
				<button>Sign out</button>
			</form>
		</>
	);
}

Page.getLayout = function getLayout(page) {
  return (
    <Standard>
      {page}
    </Standard>
  )
}
