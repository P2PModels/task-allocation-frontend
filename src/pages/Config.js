import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { generateUrl } from '../helpers/route-helpers'

import { Grid, Typography, Snackbar, Slide, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import FileCopyIcon from '@material-ui/icons/FileCopy'

import ConfigView from '../components/ConfigView'
import { useAppState } from '../contexts/AppState'
import Select from '../components/Select'
import { useUsersQuery } from '../hooks/useRequests'
import models from '../types/models'

const useStyles = makeStyles(theme => ({
    root: {
        height: 'calc(100vh - 100px)',
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

const SlideLeft = props => <Slide {...props} direction="left" />

const Config = () => {
    const { root, select, button } = useStyles()
    const history = useHistory()
    const { users } = useUsersQuery()
    const [selectedUser, setSelectedUser] = useState('')
    const [usersOptions, setUsersOptions] = useState()
    const [selectedModel, setSelectedModel] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const snackbarMsg = 'Custom link copied to clipboard!'
    const baseUri = '/home/'

    const modelsOptions = models.map(m => ({
        value: m.name,
        label: m.displayName,
    }))

    const handleCopyButton = () => {
        let generatedUrl = generateUrl(window.location.origin + baseUri, [
            { key: 'userId', value: selectedUser },
            { key: 'model', value: selectedModel },
        ])
        navigator.clipboard.writeText(generatedUrl)
        setOpenSnackbar(true)
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackbar(false)
    }

    useEffect(() => {
        if (users) {
            setUsersOptions(users.map(u => ({ value: u.id, label: u.id })))
            setSelectedUser(users[0].id)
        }
    }, [users])

    useEffect(() => {
        if (models) {
            setSelectedModel(models[0].name)
        }
    }, [models])

    return (
        <ConfigView>
            <Grid
                container
                justify="flex-start"
                alignContent="center"
                alignItems="center"
                spacing={2}
                className={root}
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
                        {modelsOptions ? (
                            <Grid item>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Typography variant="h6">
                                            Model
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Select
                                            name="model"
                                            label="model"
                                            value={selectedModel}
                                            options={modelsOptions}
                                            className={select}
                                            onChange={e =>
                                                setSelectedModel(e.target.value)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                        {usersOptions ? (
                            <Grid item>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Typography variant="h6">
                                            User
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Select
                                            name="user"
                                            label="User"
                                            value={selectedUser}
                                            options={usersOptions}
                                            className={select}
                                            onChange={e =>
                                                setSelectedUser(e.target.value)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
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
                                <FileCopyIcon /> Copy link
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                className={button}
                                onClick={() =>
                                    history.push(
                                        generateUrl(baseUri, [
                                            {
                                                key: 'userId',
                                                value: selectedUser,
                                            },
                                            {
                                                key: 'model',
                                                value: selectedModel,
                                            },
                                        ])
                                    )
                                }
                            >
                                Access
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar
                open={openSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={SlideLeft}
                transitionDuration={500}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                key={'bottomright'}
            >
                <Alert severity={'info'}>{snackbarMsg}</Alert>
            </Snackbar>
        </ConfigView>
    )
}

export default Config
