import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
    Drawer,
    AppBar,
    Toolbar,
    List,
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
import JobsTable from '../components/Tables/JobsTable'
import TasksTable from '../components/Tables/TasksTableRR'
import UsersTable from '../components/Tables/UsersTable'
import TxsTable from '../components/Tables/TxsTable'
import { useAppState } from '../contexts/AppState'
import useAdminActions from '../hooks/useAdminActionsRR'
import { useTasksQueryPolling, useUsersQuery } from '../hooks/useRequests'

import Select from '../components/Select'
import models from '../types/models'
import { LocalConvenienceStoreOutlined } from '@material-ui/icons'

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
    const { modelName, modelDisplayName, setModel } = useAppState()
    const { tasks, refetch: refetchTasks } = useTasksQueryPolling()
    const { users, refetch: refetchUsers } = useUsersQuery()
    const {
        startManager,
        stopManager,
        managerRunning,
        jobs,
        txsRecord,
        restartPrototype,
        restartPrototypeLoading,
    } = useAdminActions()
    const [open, setOpen] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')
    const [snackbarAutoHide, setSnackbarAutoHide] = useState(null)
    const firstRun = useRef(true)

    const modelsOptions = models.map(m => ({
        value: m.name,
        label: m.displayName,
    }))

    useEffect(() => {
        if (openSnackbar) {
            setOpenSnackbar(false)
        }
        if (snackbarMsg !== '') {
            setOpenSnackbar(true)
        }
    }, [snackbarMsg])

    useEffect(() => {
        if (!restartPrototypeLoading && !firstRun.current) {
            notifyWithSeverity(
                'Prototype restart successfuly completed',
                'success'
            )
        } else {
            firstRun.current = false
        }
    }, [restartPrototypeLoading])

    useEffect(() => {
        refetchUsers()
    }, [tasks])

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

    function notifyWithSeverity(msg, severity, autoHide = 5000) {
        setSnackbarSeverity(severity)
        setSnackbarMsg(msg)
        setSnackbarAutoHide(autoHide)
    }

    function notify(msg, autoHide = 5000) {
        setSnackbarMsg(msg)
        setSnackbarSeverity('info')
        setSnackbarAutoHide(autoHide)
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
                        disabled={managerRunning}
                    >
                        <ListItemIcon
                            onClick={() => {
                                notify(
                                    'Starting manager, this takes some minutes to complete. Please wait...'
                                )
                                try {
                                    startManager(tasks)
                                    notifyWithSeverity(
                                        'Manager started successfuly!',
                                        'success'
                                    )
                                } catch (error) {
                                    notifyWithSeverity(
                                        'Start manager failed',
                                        'error'
                                    )
                                    console.log(error)
                                }
                            }}
                        >
                            <PlayArrowIcon />
                        </ListItemIcon>
                        <ListItemText primary="Start Manager" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="StopManager"
                        disabled={!managerRunning}
                    >
                        <ListItemIcon
                            onClick={() => {
                                notify('Stopping manager. Please wait...')
                                try {
                                    stopManager()
                                    notifyWithSeverity(
                                        'Manager stopped successfuly!',
                                        'success'
                                    )
                                } catch (error) {
                                    notifyWithSeverity(
                                        'Stop manager failed',
                                        'error'
                                    )
                                    console.log(error)
                                }
                            }}
                        >
                            <StopIcon />
                        </ListItemIcon>
                        <ListItemText primary="Stop Manager" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="RestartContract"
                        disabled={managerRunning}
                    >
                        <ListItemIcon
                            onClick={() => {
                                notify(
                                    'Restarting prototype, this takes some minutes to complete. You can check the state of transactions in the table. Please wait...'
                                )
                                try {
                                    restartPrototype()
                                } catch (error) {
                                    notifyWithSeverity(
                                        'Restart prototype failed',
                                        'error'
                                    )
                                    console.log(error)
                                }
                            }}
                        >
                            <ReplayIcon />
                        </ListItemIcon>
                        <ListItemText primary="Restart Contract" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="ReallocateTasks"
                        disabled={managerRunning}
                    >
                        <ListItemIcon onClick={() => {}}>
                            <LowPriorityIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reallocate Tasks" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
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
                        <Grid container justify="space-between" spacing={2}>
                            <Grid item>
                                <Typography variant="h6">Manager </Typography>
                            </Grid>
                            <Grid item>
                                <Chip
                                    icon={
                                        managerRunning ? (
                                            <CheckCircleRounded />
                                        ) : (
                                            <CancelRounded />
                                        )
                                    }
                                    label={managerRunning ? 'On' : 'Off'}
                                    color={
                                        managerRunning ? 'primary' : 'secondary'
                                    }
                                    style={{ marginBottom: '1rem' }}
                                />
                            </Grid>
                        </Grid>
                        <JobsTable
                            jobs={[...jobs].map(([k, v]) => {
                                return {
                                    id: v.timerId,
                                    taskId: v.taskId,
                                    endDate: v.endDate,
                                    status:
                                        v.endDate > Date.now()
                                            ? 'waiting'
                                            : 'timed out',
                                }
                            })}
                        />
                    </Grid>
                    <Grid item lg={6} />
                    <Grid item lg={6}>
                        <Typography variant="h6">Registered users</Typography>
                        <UsersTable users={users} />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h6">Tasks</Typography>
                        <TasksTable
                            tasks={
                                tasks
                                    ? tasks.map(t => {
                                          return {
                                              id: t.id,
                                              status: t.status,
                                              userId: t.assignee
                                                  ? t.assignee.id
                                                  : null,
                                              endDate: t.endDate * 1000,
                                          }
                                      })
                                    : null
                            }
                        />
                    </Grid>
                    <Grid item lg={12}>
                        <Typography variant="h6">Transactions</Typography>
                        <TxsTable
                            txs={txsRecord.data ? txsRecord.data.receipts : {}}
                        />
                    </Grid>
                </Grid>
                {/* <Typography variant="h6">Allocated Tasks</Typography>
                <TasksTable refreshTable={newData.current} /> */}
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
