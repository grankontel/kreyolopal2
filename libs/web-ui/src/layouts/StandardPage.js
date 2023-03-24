import React from 'react'
import PropTypes from 'prop-types';
import { TopNavbar } from '../components/TopNavbar'
import { Content } from 'react-bulma-components'

export function StandardPage({ children, links, getHead }) {
  return (
    <>
      {getHead()}
      <header>
        <TopNavbar links={links || []} />
      </header>
      <main className="main">{children}</main>
      <footer className="page-footer has-text-centered">
        <Content>&copy; TiMalo — 2022</Content>
      </footer>
    </>
  )
}

StandardPage.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
}
