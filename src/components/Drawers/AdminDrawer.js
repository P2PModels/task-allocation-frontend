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
import RefreshIcon from '@material-ui/icons/Refresh'
import LowPriorityIcon from '@material-ui/icons/LowPriority'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import CheckCircleRounded from '@material-ui/icons/CheckCircleRounded'
import CancelRounded from '@material-ui/icons/CancelRounded'
import TasksTable from '../Tables/TasksTable'

import {
  startManager as startEthManager,
  stopManager as stopEthManager,
  restartContract as restartRRContact,
  getContractStatus,
} from 'eth-manager'

const drawerWidth = 240
const heightAmaraBar = 9

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
  const [managerStatus, setManagerStatus] = React.useState(false)
  const [signer, setSigner] = React.useState(null)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const startManager = () => {
    console.log('In Admin Drawer, starting manager...')
    startEthManager()
    setManagerStatus(true)
  }

  const stopManager = () => {
    console.log('In Admin Drawer, stoping manager...')
    stopEthManager()
    setManagerStatus(false)
  }

  const restartContract = () => {
    console.log('In Admin Drawer, restarting contract...')
    restartRRContact()
  }

  const updateTaskInfo = () => {
    console.log('In Admin Drawer, updating task info...')
    getContractStatus()
  }

  const reallocateTasks = () => {
    console.log('Reallocating tasks...')
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
          <ListItem button key="StartManager">
            <ListItemIcon onClick={startManager}>
              <PlayArrowIcon />
            </ListItemIcon>
            <ListItemText primary="Start Manager" />
          </ListItem>
          <ListItem button key="StopManager">
            <ListItemIcon onClick={stopManager}>
              <StopIcon />
            </ListItemIcon>
            <ListItemText primary="Stop Manager" />
          </ListItem>
          <ListItem button key="RestartContract">
            <ListItemIcon onClick={restartContract}>
              <ReplayIcon />
            </ListItemIcon>
            <ListItemText primary="Restart Contract" />
          </ListItem>
          <ListItem button key="UpdateTaskInfo">
            <ListItemIcon onClick={updateTaskInfo}>
              <RefreshIcon />
            </ListItemIcon>
            <ListItemText primary="Update Task Info" />
          </ListItem>
          <ListItem button key="ReallocateTasks">
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
        <TasksTable />
      </main>
    </div>
  )
}
