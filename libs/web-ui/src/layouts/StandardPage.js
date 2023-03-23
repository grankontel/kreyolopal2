import React from 'react'
import { TopNavbar } from '../components/TopNavbar'
import { Container, Content } from 'react-bulma-components'

export function StandardPage({ children, getHead }) {
  return (
    <>
      {getHead()}
      <TopNavbar />
      <Container className="main" renderAs="main">
        {children}
      </Container>
      <footer className="page-footer has-text-centered">
        <Content>&copy; TiMalo — 2022</Content>
      </footer>
    </>
  )
}
