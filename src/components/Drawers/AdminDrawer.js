import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ReplayIcon from '@material-ui/icons/Replay'
import LowPriorityIcon from '@material-ui/icons/LowPriority'
import Chip from '@material-ui/core/Chip'
import CheckCircleRounded from '@material-ui/icons/CheckCircleRounded'
import CancelRounded from '@material-ui/icons/CancelRounded'
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'

import TasksTable from '../Tables/TasksTable'

const {
  startManager: startEthManager,
  stopManager: stopEthManager,
  restartContract: restartRRContract,
  reallocateTasks: reallocateContractTasks,
} = require('eth-manager')

const drawerWidth = 240
const heightAmaraBar = 9

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    margin: theme.spacing(heightAmaraBar, 0),
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
    margin: theme.spacing(heightAmaraBar, 0),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    margin: theme.spacing(heightAmaraBar, 0),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

export default function AdminDrawer() {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [snackbarMsg, setSnackbarMsg] = React.useState('')
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success')
  const [snackbarAutoHide, setSnackbarAutoHide] = React.useState(null)
  const [managerStatus, setManagerStatus] = React.useState(false)
  const newData = React.useRef(false)
  const signer = React.useRef(undefined)
  const cronJobs = React.useRef(undefined)

  React.useEffect(() => {
    if (openSnackbar) {
      setOpenSnackbar(false)
    }
    if (snackbarMsg !== '') {
      setOpenSnackbar(true)
    }
  }, [snackbarMsg])

  React.useEffect(() => {
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
      console.log('In AdminDrawer')
      console.log(mgrSigner)
      console.log(mgrCronJobs)
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
      console.log('To stop with')
      console.log(signer.current)
      console.log(cronJobs.current)
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
          <ListItem button key="StartManager" disabled={managerStatus}>
            <ListItemIcon onClick={startManager}>
              <PlayArrowIcon />
            </ListItemIcon>
            <ListItemText primary="Start Manager" />
          </ListItem>
          <ListItem button key="StopManager" disabled={!managerStatus}>
            <ListItemIcon onClick={stopManager}>
              <StopIcon />
            </ListItemIcon>
            <ListItemText primary="Stop Manager" />
          </ListItem>
          <ListItem button key="RestartContract" disabled={managerStatus}>
            <ListItemIcon onClick={restartContract}>
              <ReplayIcon />
            </ListItemIcon>
            <ListItemText primary="Restart Contract" />
          </ListItem>
          <ListItem button key="ReallocateTasks" disabled={managerStatus}>
            <ListItemIcon onClick={reallocateTasks}>
              <LowPriorityIcon />
            </ListItemIcon>
            <ListItemText primary="Reallocate Tasks" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        {managerStatus ? (
          <Chip icon={<CheckCircleRounded />} label="On" color="primary" />
        ) : (
          <Chip icon={<CancelRounded />} label="Off" color="secondary" />
        )}
        <div className={classes.toolbar} />
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  )
}
