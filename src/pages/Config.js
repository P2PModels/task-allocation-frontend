import React, { useState, useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { getEditorLink } from '../helpers/amara-helpers'
import { getTxStatus } from '../helpers/transaction-helpers'
import { getResourceFromPathname, generateUrl } from '../helpers/route-helpers'
import { Actions, convertToString } from '../types/actions'
import useUserLogic from '../hooks/useUserLogic'
import useActions from '../hooks/useActions'
import AmaraApi from '../amara-api'

import {
    Grid,
    Typography,
    Box,
    Fade,
    Snackbar,
    Slide,
    CircularProgress,
    Button,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ContentCopyIcon from '@material-ui/icons/ContentCopy'

import ConfigView from '../components/ConfigView'
import ModelSelect from '../components/ModelSelect'
import UserSelect from '../components/UserSelect'
import { useAppState } from '../contexts/AppState'

const { AcceptTask, RejectTask } = Actions
const SNACKBAR_FIXED_TIME = 700

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: 'calc(100vh - 116px)',
        '& > div': {
            height: '100%',
        },
        '& h2': {
            marginBottom: theme.spacing(4),
        },
    },
    select: {
        '& label, span, div, svg': {
            color: '#fff',
        },
    },
    button: {
        color: '#fff',
    },
}))

const Config = () => {
    const theme = useTheme()
    const { root, select, button } = useStyles()
    const { modelName } = useAppState()
    const [generatedUrl, setGeneratedUrl] = useState('')
    const baseUrl = 'https://task-allocation.p2pmodels.eu/'

    const handleCopyButton = () => {
        navigator.clipboard.writeText(generatedUrl)
    }

    return (
        <ConfigView className={root}>
            <Grid
                container
                justify="flex-start"
                alignContent="center"
                alignItems="center"
                spacing={2}
            >
                <Grid item lg={12}>
                    <Typography variant="h2">
                        Welcome to the task allocation prototype!
                    </Typography>
                    <Typography variant="h6">
                        Let's{' '}
                        <b>
                            <u>configure</u>
                        </b>{' '}
                        what model you want to test and choose a user:
                    </Typography>
                </Grid>
                <Grid item lg={12}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Typography variant="h6">Model</Typography>
                                </Grid>
                                <Grid item>
                                    <ModelSelect
                                        className={select}
                                        onChange={e => {
                                            let url = generateUrl(
                                                baseUrl,
                                                e.target.value
                                            )
                                            setGeneratedUrl(url)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Typography variant="h6">User</Typography>
                                </Grid>
                                <Grid item>
                                    <UserSelect
                                        className={select}
                                        onChange={e => {
                                            let url = generateUrl(
                                                baseUrl,
                                                e.target.value
                                            )
                                            setGeneratedUrl(url)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={12}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button
                                variant="outlined"
                                className={button}
                                onClick={handleCopyButton}
                            >
                                Copy link <ContentCopyIcon />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                className={button}
                                onClick={() => <Redirect to={generatedUrl} />}
                            >
                                Access
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ConfigView>
    )
}

export default Config
