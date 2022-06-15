import React from 'react'
import clsx from 'clsx'
import Link from '@material-ui/core/Link'
import { Box, Typography, makeStyles, Container } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    flexRowPT: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: '1rem',
    },
    flexCol: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    footer: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.text.light,
        position: 'relative',
        zIndex: 1200
    },
    footerContent: {
        justifyContent: 'space-between',
        height: '100px',
        '& p': {
            fontSize: '14px',
            fontWeight: 600
        },
    },
    logos: {
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& img': {
            padding: '0.1rem',
            height: '100%',
            width: 'auto',
            marginRight: '1rem',
        },
    },
    info: {
        justifyContent: 'flex-end',
        color: theme.palette.text.light,
        textAlign: 'right',
        '& div': {
            padding: '1rem 0.5rem',
        },
        '& a': {
            color: theme.palette.text.light,
            textDecoration: 'underline',
        },
    },
    githubIcon: {
        '& img': {
            width: theme.spacing(2),
            height: theme.spacing(2),
        }
    },
}))

export default function Footer() {
    const {
        flexRow,
        flexRowPT,
        flexCol,
        footer,
        footerContent,
        logos,
        info,
        githubIcon,
    } = useStyles()

    return (
        <div className={footer}>
            <Container maxWidth="xl" className={clsx(flexRow, footerContent)}>
                <div className={flexCol}>
                    <Typography>Experiment created by:</Typography>
                    <div className={logos}>
                        <img id="p2pmod" src="./assets/p2p-logo.svg" />
                        <img id="amara" src="./assets/Logo.svg" />
                    </div>
                </div>
                <Box className={clsx(flexRowPT, info)}>
                    <Box className={flexCol}>
                        <Link
                            href="https://github.com/p2pmodels"
                            target="_blank"
                        >
                            <i className={githubIcon}>
                                <img src="./assets/ico-github.svg" />
                            </i>       
                        </Link>
                    </Box>
                    <Box className={flexCol}>
                        <span>Copyleft with credits</span>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}
