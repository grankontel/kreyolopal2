import { StandardPage, useAuth } from '@kreyolopal/web-ui'
import DicoHead from '@/components/DicoHead'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bulma-components'
import { useRouter } from 'next/navigation'
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

const logout = async (auth) => {
  return fetch(`/api/auth/logout`, {
    method: 'POST',
    credentials: 'same-origin',
  }).then(() => {
    auth?.setSession(null)
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
            <p className="modal-card-title">Modal title</p>
            <button className="delete" aria-label="close" onClick={() => setOpenLogout(false)}></button>
          </header>
          <section className="modal-card-body">
            content
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={(e) => {
              e.preventDefault()
              logout(auth).then(() => setOpenLogout(false))
            }}>Save changes</button>
            <button className="button" onClick={() => setOpenLogout(false)}>Cancel</button>
          </footer>
        </div>
      </div>


      {children}
    </StandardPage>
  )
}