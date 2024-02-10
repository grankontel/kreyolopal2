import React from 'react';
import { createContext, useEffect, useState , useContext} from 'react';
import { useCookies } from 'react-cookie';
import PropTypes from 'prop-types'

const AuthContext = createContext(null)

function parseCookie(cookie) {
	if (cookie === null)
		return null
	const [data, digest] = cookie.split('.')

	const info = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
	return info
}

export const AuthProvider = ({ cookieName, children }) => {
	const [cookies, setCookies, removeCookie] = useCookies();
	const [session, setSession] = useState(null)

	useEffect(() => {
		const x = parseCookie(cookies[cookieName] ?? null)
		if (x === null) return
		const expires = new Date(x.expiresAt)
		const now = new Date()
		if (expires < now) {
			console.log('session expired')
			removeCookie(cookieName)
			setSession(null)
		}
		setSession(x)
	}, [])
	return (
		<AuthContext.Provider value={{session, setSession}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
};

AuthProvider.propTypes = {
	cookieName: PropTypes.string.isRequired
}

AuthProvider.defaultProps = {
	cookieName: 'wabap'
}