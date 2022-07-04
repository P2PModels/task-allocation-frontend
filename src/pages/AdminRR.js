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
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ReplayIcon from '@material-ui/icons/Replay'
import LowPriorityIcon from '@material-ui/icons/LowPriority'
import Chip from '@material-ui/core/Chip'
import CheckCircleRounded from '@material-ui/icons/CheckCircleRounded'
import CancelRounded from '@material-ui/icons/CancelRounded'
import MuiAlert from '@material-ui/lab/Alert'

import MainView from '../components/MainView'
import TasksTable from '../components/Tables/TasksTable'
import UsersTable from '../components/Tables/UsersTable'
import TxsTable from '../components/Tables/TxsTable'
import { useAppState } from '../contexts/AppState'
import useAdminActions from '../hooks/useAdminActions'
import { useTasksQueryPolling, useUsersQuery } from '../hooks/useRequests'

import ModelSelect from '../components/ModelSelect'

const {
    startManager: startEthManager,
    stopManager: stopEthManager,
    restartContract: restartRRContract,
    reallocateTasks: reallocateContractTasks,
} = require('@p2pmodels/eth-manager')

const drawerWidth = 240

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

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

const AdminRR = () => {
    const classes = useStyles()
    const theme = useTheme()
    const { modelName, modelDisplayName } = useAppState()
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
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')
    const [snackbarAutoHide, setSnackbarAutoHide] = useState(null)
    const [managerStatus, setManagerStatus] = useState(false)
    const newData = useRef(false)
    const signer = useRef(undefined)
    const cronJobs = useRef(undefined)

    console.log('[Admin]')
    console.log(startEthManager)

    useEffect(() => {
        if (openSnackbar) {
            setOpenSnackbar(false)
        }
        if (snackbarMsg !== '') {
            setOpenSnackbar(true)
        }
    }, [snackbarMsg])

    useEffect(() => {
        newData.current = false
    })

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

    const handleSnackbarExited = () => {
        setSnackbarMsg('')
        setOpenSnackbar(false)
    }

    function processMgrRes(
        msg,
        severity,
        autoHide,
        nData = true,
        mgtStatus = false
    ) {
        setSnackbarSeverity(severity)
        setSnackbarMsg(msg)
        setManagerStatus(mgtStatus)
        newData.current = nData
        setSnackbarAutoHide(autoHide)
    }

    function initMgr(msg) {
        setSnackbarMsg(msg)
        setSnackbarSeverity('info')
        setSnackbarAutoHide(null)
    }

    const startManager = async () => {
        initMgr(
            'Starting manager, this takes some minutes to complete. Please wait...'
        )
        try {
            setManagerStatus(true)
            const { mgrSigner, mgrCronJobs } = await startEthManager()
            signer.current = mgrSigner
            cronJobs.current = mgrCronJobs
            processMgrRes(
                'Manager started successfully!',
                'success',
                6000,
                true,
                true
            )
        } catch (err) {
            processMgrRes(
                `Error when starting manager: ${err.message}`,
                'error',
                null,
                false,
                false
            )
        }
    }

    const stopManager = () => {
        initMgr('Stopping manager...')
        try {
            stopEthManager(signer.current, cronJobs.current)
            signer.current = undefined
            cronJobs.current = undefined
            processMgrRes(
                'Manager stopped successfully!',
                'success',
                6000,
                false,
                false
            )
        } catch (err) {
            processMgrRes(
                `Error when stopping manager: ${err.message}`,
                'error',
                null,
                false,
                true
            )
        }
    }

    const restartContract = async () => {
        initMgr(
            'Restarting contract, this takes several minutes to complete. Please wait...'
        )
        try {
            await restartRRContract()
            processMgrRes(
                'Contract restarted successfully!',
                'success',
                6000,
                true,
                false
            )
        } catch (err) {
            processMgrRes(
                `Error when restarting contract: ${err.message}`,
                'error',
                null,
                false,
                false
            )
        }
    }

    const reallocateTasks = async () => {
        initMgr(
            'Reallocating tasks, this takes some minutes to complete. Please wait...'
        )
        try {
            await reallocateContractTasks()
            processMgrRes(
                'Tasks were reallocated successfully!',
                'success',
                6000,
                true,
                false
            )
        } catch (err) {
            processMgrRes(
                `Error when reallocating tasks: ${err.message}`,
                'error',
                null,
                false,
                false
            )
        }
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
                        key="StartManager"
                        disabled={managerStatus}
                    >
                        <ListItemIcon onClick={startManager}>
                            <PlayArrowIcon />
                        </ListItemIcon>
                        <ListItemText primary="Start Manager" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="StopManager"
                        disabled={!managerStatus}
                    >
                        <ListItemIcon onClick={stopManager}>
                            <StopIcon />
                        </ListItemIcon>
                        <ListItemText primary="Stop Manager" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="RestartContract"
                        disabled={managerStatus}
                    >
                        <ListItemIcon onClick={restartContract}>
                            <ReplayIcon />
                        </ListItemIcon>
                        <ListItemText primary="Restart Contract" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="ReallocateTasks"
                        disabled={managerStatus}
                    >
                        <ListItemIcon onClick={reallocateTasks}>
                            <LowPriorityIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reallocate Tasks" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                {managerStatus ? (
                    <Chip
                        icon={<CheckCircleRounded />}
                        label="On"
                        color="primary"
                    />
                ) : (
                    <Chip
                        icon={<CancelRounded />}
                        label="Off"
                        color="secondary"
                    />
                )}
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
                                <ModelSelect />
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
                <Typography variant="h6">Allocated Tasks</Typography>
                <TasksTable refreshTable={newData.current} />
            </main>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSnackbar}
                onClose={handleSnackbarClose}
                onExited={handleSnackbarExited}
                autoHideDuration={snackbarAutoHide}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </MainView>
    )
}

export default AdminRR