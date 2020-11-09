import React from 'react'
import { AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Logo from './Logo'

import AccountModule from '../components/AccountModule/AccountModule'

const useStyles = makeStyles(theme => ({
  root: {},
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollWrapper: {
    position: 'fixed',
    bottom: `${theme.spacing(2)}px`,
    top: `${theme.spacing(2)}px`,
  },
  buttonWrapper: {
    marginRight: theme.spacing(4),
  },
}))

const NavBar = () => {
  const { navBar, buttonWrapper } = useStyles()
  return (
    <div>
      <AppBar className={navBar} position="fixed" color="default" elevation={3}>
        <Logo />
        <div className={buttonWrapper}>
          <AccountModule />
        </div>
      </AppBar>
    </div>
  )
}

export default NavBar
