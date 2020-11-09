import React from 'react'
import { Box, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import NavBar from './NavBar'

import Home from '../pages/Home'

const UPPER_MARGIN = 12

const useStyles = makeStyles(theme => ({
  root: { border: '', padding: theme.spacing(2), marginTop: theme.spacing(30) },
}))

const MainView = () => {
  const { root } = useStyles()
  return (
    <div>
      <NavBar />
      <Container maxWidth="xl">
        <Box my={UPPER_MARGIN} className={root} width="100%">
          <Home />
        </Box>
      </Container>
    </div>
  )
}

export default MainView
