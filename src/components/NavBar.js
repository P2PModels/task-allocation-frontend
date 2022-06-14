import React from 'react'
import { AppBar,
         Container
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Logo from './Logo'

import AccountModule from '../components/AccountModule/AccountModule'

const useStyles = makeStyles(theme => ({
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}))

const NavBar = () => {
  const { navBar, buttonWrapper } = useStyles()
  return (
    <AppBar color="default" elevation={3}>
      <Container maxWidth="xl" className={navBar}>
        <Logo />
        <div>
          <AccountModule />
        </div>
      </Container>
    </AppBar>
  )
}

export default NavBar
