import React from 'react'
import {
  Grid,
  Typography,
  Box,
  Snackbar,
  Slide,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AdminDrawer from '../components/Drawers/AdminDrawer'
import TasksTable from '../components/Tables/TasksTable'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  welcomeContainer: {
    border: '1px solid black',
  },
  welcomContainer: {
    border: '1px solid blue',
    // maxWidth: '30%',
  },
  toastMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLoadingState: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
  disabledModal: {
    opacity: 0.4,
  },
}))

const Admin = () => {
  return (
    <div>
      <AdminDrawer />
    </div>
  )
}

export default Admin
