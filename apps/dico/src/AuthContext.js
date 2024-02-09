import { createContext, useEffect, useState , useContext} from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext(null)

function parseCookie(cookie) {
	if (cookie === null)
		return null
	const [data, digest] = cookie.split('.')

	const info = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
	return info
}

export const AuthProvider = ({ children }) => {
	const [cookies, setCookies, removeCookie] = useCookies();
	const [session, setSession] = useState(null)

	useEffect(() => {
		const x = parseCookie(cookies[process.env.NEXT_PUBLIC_COOKIE_NAME] ?? null)
		if (x === null) return
		const expires = new Date(x.expiresAt)
		const now = new Date()
		if (expires < now) {
			console.log('session expired')
			removeCookie(process.env.NEXT_PUBLIC_COOKIE_NAME)
		}
		setSession(x)
	}, [])
	return (
		<AuthContext.Provider value={session}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
};