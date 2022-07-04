import React from 'react'
import clsx from 'clsx'
import { Box, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Footer from './Footer'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.green,
        color: '#fff',
    },
    mainContainer: {
        border: 'none',
    },
}))

const ConfigView = ({ className, children }) => {
    const { root, mainContainer } = useStyles()

    return (
        <div className={root}>
            <Container maxWidth="xl">
                <Box className={clsx(className, mainContainer)}>{children}</Box>
            </Container>
            <Footer />
        </div>
    )
}

export default ConfigView
