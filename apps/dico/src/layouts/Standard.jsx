import { StandardPage, useAuth } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bulma-components'
import { useRouter } from 'next/router'
import classNames from 'classnames'

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
	const [openLogout, setOpenLogout] = useState(false)
	let auth = useAuth()
	const router = useRouter()
	const modalclass = classNames({ 'modal': true, 'is-active': openLogout })
	return (
		<StandardPage
			links={links}
			getHead={() => <DicoHead />}
			CustomItems={() => (
				<>
					{auth ? (<span className="navbar-item">
						<Button color="primary" onClick={() => {
							console.log('logout')
							setOpenLogout(true)
						}}>Logout</Button>
					</span>
					) : (<span className="navbar-item">
						Connect
					</span>
					)}
				</>
			)}
		>
<div id="modal-js-example" className={modalclass}>
  <div className="modal-background"></div>

  <div className="modal-content">
    <div className="box">
      <p>Modal JS example</p>
    </div>
  </div>

  <button className="modal-close is-large" aria-label="close" onClick={() => setOpenLogout(false)}></button>
</div>
			{children}
		</StandardPage>
	)
}