import { StandardPage, useAuth } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'
import { useEffect } from 'react'

const dico_url = process.env.NEXT_PUBLIC_DICO_URL || `http://localhost:${process.env.PORT || 3000}`
const links = [
	{
		id: 1,
		url: dico_url,
		text: 'Dictionnaire',
	},
	{
		id: 2,
		url: `${dico_url}/spellcheck`,
		text: 'Correcteur',
	},
	{
		id: 3,
		url: '/contact',
		text: 'Contact',
	},
]

export default function Standard({ children }) {
	let auth = useAuth()
	console.log(auth)
	
	return (
		<StandardPage
			links={links}
			getHead={() => <DicoHead />}
			CustomItems={() => (
				<>
					<span className="navbar-item">
						Connect
					</span>
				</>
			)}
		>
			{children}
		</StandardPage>
	)
}