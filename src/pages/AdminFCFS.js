import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Grid,
    Slide,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ReplayIcon from '@material-ui/icons/Replay'
import { Alert } from '@material-ui/lab'

import MainView from '../components/MainView'
import Select from '../components/Select'
import TasksTable from '../components/Tables/TasksTable'
import UsersTable from '../components/Tables/UsersTable'
import TxsTable from '../components/Tables/TxsTable'
import { useAppState } from '../contexts/AppState'
import useAdminActions from '../hooks/useAdminActions'
import { useTasksQueryPolling, useUsersQuery } from '../hooks/useRequests'
import models from '../types/models'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        margin: theme.spacing(5.5, 0),
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        margin: theme.spacing(5.5, 0),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(3.5),
        // [theme.breakpoints.up('sm')]: {
        //   width: theme.spacing(9) + 1,
        // },
        margin: theme.spacing(5.5, 0),
        '& div.MuiListItemIcon-root': {
            marginRight: theme.spacing(0),
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    listItem: {
        '& > div.MuiListItemIcon-root': {
            marginRight: theme.spacing(1),
            minWidth: theme.spacing(1.5),
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}))

const SlideLeft = props => <Slide {...props} direction="left" />

const AdminFCFS = () => {
    const classes = useStyles()
    const theme = useTheme()
    const { modelName, modelDisplayName, setModel } = useAppState()
    const tasks = useTasksQueryPolling(true)
    const { users, refetch: refecthUsers } = useUsersQuery()
    const [
        restartPrototype,
        {
            data: restartPrototypeData,
            loading: restartPrototypeLoading,
            error: restartPrototypeError,
        },
    ] = useAdminActions()
    const [open, setOpen] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState('')

    const modelsOptions = models.map(m => ({
        value: m.name,
        label: m.displayName,
    }))

    useEffect(() => {
        refecthUsers()
    }, [restartPrototypeData])

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackbar(false)
    }

    const handleRestartPrototype = () => {
        setSnackbarMsg("Restarting prototype... Don't close the tab.")
        setOpenSnackbar(true)
        restartPrototype()
    }

    return (
        <MainView className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Administration Panel
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="RestartPrototype"
                    >
                        <ListItemIcon onClick={handleRestartPrototype}>
                            <ReplayIcon />
                        </ListItemIcon>
                        <ListItemText primary="Restart prototype" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <Typography variant="h3">{modelDisplayName}</Typography>
                    </Grid>
                    <Grid item lg={6}>
                        <Grid
                            container
                            justify="flex-end"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <Typography variant="h6">
                                    Change model:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Select
                                    name="model"
                                    label="model"
                                    value={modelName}
                                    options={modelsOptions}
                                    onChange={e => setModel(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h6">Registered users</Typography>
                        <UsersTable users={users} />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h6">Tasks</Typography>
                        <TasksTable tasks={tasks} />
                    </Grid>
                    <Grid item lg={12}>
                        <Typography variant="h6">Transactions</Typography>
                        <TxsTable txs={restartPrototypeData.receipts} />
                    </Grid>
                </Grid>
            </main>
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
        </MainView>
    )
}

export default AdminFCFS
