import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getEditorLink } from '../helpers/amara-utils'
import { TaskStatuses } from '../types'
import { useAppState } from '../contexts/AppState'
import useUserLogic from '../hooks/useUserLogic'

import {
  Grid,
  Typography,
  Box,
  Fade,
  Snackbar,
  Slide,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import TaskSection from '../components/TaskSection'
import MessageModal from '../components/MessageModal'
import Homepage from '../assets/Homepage.svg'
import { Alert } from '@material-ui/lab'

const { Assigned, Accepted } = TaskStatuses

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
  taskSection: {
    width: '90%',
    // border: '1px solid black',
  },
  toastMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgress: {
    marginRight: theme.spacing(1),
  },
}))

const SlideUp = props => <Slide {...props} direction="up" />

const Home = () => {
  const theme = useTheme()
  const { root, taskSection, toastMessage, circularProgress } = useStyles()
  const userId = 'p2pmodels.user4'
  const web3React = useWeb3React()
  const {
    library,
    connector,
    account,
    chainId,
    activate,
    deactivate,
  } = web3React

  const [openModal, setOpenModal] = useState(false)
  const appState = useAppState()
  console.log('APP STATE')
  console.log(appState)
  const {
    user,
    videosRegistry,
    acceptedTasks,
    allocatedTasks,
    loadingAppLogic,
  } = useUserLogic(userId)

  const handleAcceptTask = task => {
    const { job_id: taskId } = task
    if (!account) setOpenModal(true)
    else {
      console.log('Accept task ...')
      // acceptTask(userId, taskId)
      // setFetchTasks(true)
    }
  }

  const handleRejectTask = task => {
    const { job_id: taskId } = task
    if (!account) setOpenModal(true)
    else {
      console.log('Reject task ...')
      // rejectTask(userId, taskId)
      // setFetchTasks(true)
    }
  }

  const handleTranslateTask = task => {
    console.log('Translating task...')
    window.open(getEditorLink(task), '_blank')
  }

  const availableTaskActionButtons = [
    {
      label: 'Accept',
      color: theme.palette.success.main,
      actionHandler: handleAcceptTask,
    },
    {
      label: 'Reject',
      color: theme.palette.error.main,
      actionHandler: handleRejectTask,
    },
  ]

  const assignedTaskActionButtons = [
    {
      label: 'Translate',
      color: theme.palette.success.light,
      actionHandler: handleTranslateTask,
    },
  ]

  return (
    <div className={root}>
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
      >
        <Grid container direction="row" justify="space-evenly">
          <Fade in={true} style={{ transitionDelay: '300ms' }}>
            <Grid item lg={4} xl={4}>
              <Grid item>
                <Box mb={1}>
                  <Typography variant="h2">Hi {userId}!</Typography>
                </Box>
                <Box mb={4}>
                  <Typography variant="h5">
                    Nice to see you. Welcome to the new allocation asignement
                    system.
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={8} xl={8}>
                <Typography variant="subtitle1">
                  You have 12 hours to get them assigned. During this time,
                  they&apos;ll be blocked to you. After those hours, we&apos;ll
                  release them to someone else in the group.
                </Typography>
              </Grid>
            </Grid>
          </Fade>
          <Fade in={true} style={{ transitionDelay: '500ms' }}>
            <Grid item lg={6} xl={6}>
              <img src={Homepage} alt="Homepage image" />
            </Grid>
          </Fade>
        </Grid>
        <Grid container className={taskSection}>
          <Grid item>
            <Box mt={'16vh'} width="100">
              <TaskSection
                tasks={acceptedTasks}
                videoRegistry={videosRegistry}
                title="Your assignments: "
                emptyText="You don't have any accepted assignments."
                taskActionButtons={assignedTaskActionButtons}
              />
            </Box>
            {/* acceptedTasks.length */}
            <Box mt={!acceptedTasks ? 0 : 15} width="100">
              <TaskSection
                tasks={allocatedTasks}
                videoRegistry={videosRegistry}
                title="These assignments are currently free: "
                emptyText="No assignments available."
                taskActionButtons={availableTaskActionButtons}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={loadingAppLogic} TransitionComponent={SlideUp}>
        <Alert icon={false} variant="filled" color="info">
          <div className={toastMessage}>
            <CircularProgress
              className={circularProgress}
              color="white"
              size={20}
              thickness={5}
            />
            Loading your assingments!
          </div>
        </Alert>
      </Snackbar>
      <MessageModal
        open={openModal}
        type="error"
        title="You can't perform this action"
        message="Check you have an Ethereum provider installed and you're connected to your account."
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}

export default Home
