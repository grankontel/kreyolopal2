import React from 'react'
import { TopNavbar } from '../components/TopNavbar'
import { Content } from 'react-bulma-components'

export function StandardPage({ children, getHead }) {
  return (
    <>
      {getHead()}
      <TopNavbar />
      <main className="main">
        {children}
      </main>
      <footer className="page-footer has-text-centered">
        <Content>&copy; TiMalo — 2022</Content>
      </footer>
    </>
  )
}
