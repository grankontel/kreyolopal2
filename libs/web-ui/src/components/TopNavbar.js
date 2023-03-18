import React, { useCallback, useState } from "react";
import Link from 'next/link'
import { Button, Navbar } from 'react-bulma-components'
import classNames from 'classnames';

const useToggle = (initialState = false) => {
    // Initialize the state
    const [state, setState] = useState(initialState)

    // Define and memorize toggler function in case we pass down the comopnent,
    // This function change the boolean value to it's opposite value
    const toggle = useCallback(() => setState((state) => !state), [])

    return [state, toggle]
}

export const TopNavbar = () => {
    const [mobileOpen, openMobileMenu] = useToggle(false)
    const navMenu = classNames({
        'is-active': mobileOpen,
    })

    return (
        <Navbar color="dark" className="navbar_top">
       <Navbar.Brand>
        <Navbar.Item renderAs="li">
          <Link href="/">
            <img src="/images/logo_name.svg" alt="Zakari Brand" />
          </Link>
        </Navbar.Item>
      </Navbar.Brand>

      <Navbar.Burger onClick={openMobileMenu} aria-label="menu" />
      <Navbar.Menu renderAs="div" className={navMenu}>
        <Navbar.Container align="right">
          <Navbar.Item href="/contact">Contact</Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>

        </Navbar>
    )
};

