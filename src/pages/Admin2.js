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
    Chip,
    Snackbar,
    Grid,
    Slide,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ReplayIcon from '@material-ui/icons/Replay'
import LowPriorityIcon from '@material-ui/icons/LowPriority'
import CheckCircleRounded from '@material-ui/icons/CheckCircleRounded'
import CancelRounded from '@material-ui/icons/CancelRounded'
import MuiAlert from '@material-ui/lab/Alert'

import TasksTable from '../components/Tables/TasksTable'
import UsersTable from '../components/Tables/UsersTable'
import TxsTable from '../components/Tables/TxsTable'
import { useAppState } from '../contexts/AppState'
import useAdminActions from '../hooks/useAdminActions'
import { useTasksQueryPolling, useUsersQuery } from '../hooks/useRequests'
import { getTxStatus } from '../helpers/transaction-helpers'

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

const SlideLeft = React.forwardRef((props, ref) => (
    <Slide {...props} ref={ref} direction="left">
        {props.children}
    </Slide>
))

export default function Admin() {
    const classes = useStyles()
    const theme = useTheme()
    const { modelName, modelDisplayName } = useAppState()
    const tasks = useTasksQueryPolling()
    const users = useUsersQuery()
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
    const [openTxSnackbar, setOpenTxSnackbar] = useState(false)
    const [txSnackbar, setTxSnackbar] = useState({})
    const [lastUpdate, setLastUpdate] = useState()
    const newData = useRef(false)

    useEffect(() => {
        if (openSnackbar) {
            setOpenSnackbar(false)
        }
        if (snackbarMsg !== '') {
            setOpenSnackbar(true)
        }
    }, [snackbarMsg])

    // useEffect(() => {
    //     newData.current = false
    // })

    // useEffect(() => {
    //     x
    //     return
    // }, [restartPrototypeData, restartPrototypeError, restartPrototypeLoading])

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

    const handleTxSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenTxSnackbar(false)
    }

    /**
     * Handle that is executed every time snakbars need to be open
     */
    const handleExecutedTransaction = (type, action) => {
        const snackbar = { type }
        const txStatus = getTxStatus(type)

        snackbar.message = <span>{txStatus}</span>

        setTxSnackbar(snackbar)
        setOpenTxSnackbar(true)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
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
                        disabled={managerStatus}
                    >
                        <ListItemIcon onClick={restartPrototype}>
                            <ReplayIcon />
                        </ListItemIcon>
                        <ListItemText primary="Restart prototype" />
                    </ListItem>
                    {/* <ListItem
                        className={classes.listItem}
                        button
                        key="RegisterUsers"
                        disabled={managerStatus}
                    >
                        <ListItemIcon onClick={registerUsers}>
                            <PlayArrowIcon />
                        </ListItemIcon>
                        <ListItemText primary="Register users" />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        button
                        key="CreateTasks"
                        disabled={managerStatus}
                    >
                        <ListItemIcon onClick={createTasks}>
                            <LowPriorityIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create tasks" />
                    </ListItem> */}
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
                        <Typography variant="h6" align="right">
                            Choose model
                        </Typography>
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
            <Snackbar
                open={openTxSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                // TransitionComponent={SlideLeft}
                // transitionDuration={500}
                // autoHideDuration={3000}
                onClose={handleTxSnackbarClose}
                key={'bottomright'}
            >
                <Alert severity={txSnackbar.type || 'info'}>
                    {txSnackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
