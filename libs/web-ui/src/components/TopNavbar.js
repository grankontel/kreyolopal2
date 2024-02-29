import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import { Button, Navbar } from 'react-bulma-components'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState)

  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setState((state) => !state), [])

  return [state, toggle]
}

export const TopNavbar = ({ links, CustomItems }) => {
  const [mobileOpen, openMobileMenu] = useToggle(false)
  const hasItems = CustomItems !== undefined
  const navMenu = classNames({
    'is-active': mobileOpen,
  })

  const rootUrl =
    links.filter((item) => item.id == 0)?.url || 'https://www.kreyolopal.com'
  const navs = links.filter((item) => item.id != 0) || []

  return (
    <Navbar color="dark" className="navbar_top">
      <Navbar.Brand>
        <Navbar.Item renderAs="li">
          <Link href={rootUrl}>
            <img src="/images/logo_name.svg" alt="Zakari Brand" />
          </Link>
        </Navbar.Item>
      </Navbar.Brand>

      <Navbar.Burger onClick={openMobileMenu} aria-label="menu" />
      <Navbar.Menu renderAs="div" className={navMenu}>
        <Navbar.Container align="right">
          {navs.map((item, index) => {
            return (
              <Navbar.Item key={item.id || index} href={item.url}>
                {item.text}
              </Navbar.Item>
            )
          })}
          {hasItems ? <CustomItems /> : null}
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  )
}

TopNavbar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  CustomItems: PropTypes.func,
}
