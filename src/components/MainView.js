import React from 'react'
import { Box, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import NavBar from './NavBar'
import Footer from './Footer'
import NoMetamaskDetected from './ErrorPanels/NoMetamaskDetected'

const useStyles = makeStyles(theme => ({
    root: {
        border: 'none',
        marginTop: theme.mixins.toolbar.minHeight,
        marginBottom: theme.spacing(4),
    },
}))

const MainView = ({ children }) => {
    const { root } = useStyles()
    const hasMetamask = window.ethereum

    return (
        <div>
            <NavBar />
            <Container maxWidth="xl">
                <Box className={root}>
                    {hasMetamask ? children : <NoMetamaskDetected />}
                </Box>
            </Container>
            <Footer />
        </div>
    )
}

export default MainView
