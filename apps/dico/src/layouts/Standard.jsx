import { StandardPage, useAuth } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bulma-components'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { Turnstile } from '@marsidev/react-turnstile'

const dico_url = process.env.NEXT_PUBLIC_DICO_URL || `http://localhost:${process.env.PORT || 3000}`
const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'

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

const logout = async (auth) => {
  return fetch(apiServer + `/api/auth/logout`, {
    method: 'POST',
//    credentials: 'same-origin',
  }).then(() => {
    auth?.closeSession()
  })
}

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
          {auth?.session ? (<span className="navbar-item">
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
      <div className={modalclass}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Déconnexion</p>
            <button className="delete" aria-label="close" onClick={() => setOpenLogout(false)}></button>
          </header>
          <section className="modal-card-body">
            Êtes-vous sûr(e) ?
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={(e) => {
              e.preventDefault()
              logout(auth).then(() => setOpenLogout(false))
            }}>Save changes</button>
            <button className="button" onClick={() => setOpenLogout(false)}>Annuler</button>
          </footer>
        </div>
      </div>
      {children}
    </StandardPage>
  )
}